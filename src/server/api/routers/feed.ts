import { z } from 'zod';
import axios from 'axios';
import { createHash } from 'crypto';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { articles, sources, usersToArticles, usersToSources } from '~/server/db/schema';
import { desc, eq, inArray } from 'drizzle-orm';

type NewArticle = typeof articles.$inferInsert;

export const feedRouter = createTRPCRouter({
  fetch: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const sources = await ctx.db.query.usersToSources.findMany({
      where: eq(usersToSources.userId, ctx.session.user.id),
    });
    if (sources.length === 0) return [];
    return await ctx.db.query.articles.findMany({
      where: inArray(
        articles.source,
        sources.map((s) => s.sourceId),
      ),
      orderBy: [desc(articles.timestamp)],
      with: {
        source: { columns: { title: true } },
        usersToArticles: {
          where: eq(usersToArticles.userId, ctx.session.user.id),
          columns: { lastRead: true },
        },
      },
    });
  }),
  createSource: protectedProcedure.input(z.object({ url: z.string() })).mutation(async ({ ctx, input }) => {
    const hash = createHash('sha1').update(input.url).digest('hex');

    let source = await ctx.db.query.sources.findFirst({ where: eq(sources.hash, hash) });

    if (!source) {
      const { data } = await axios.get<{ title: string; desc: string }>(
        `https://morss.fly.dev/:proxy:format=json:cors/${input.url}`,
      );

      source = (
        await ctx.db
          .insert(sources)
          .values({
            title: data.title,
            description: data.desc,
            hash: hash,
            url: input.url,
          })
          .returning()
      )[0];
    }

    await ctx.db.insert(usersToSources).values({
      userId: ctx.session.user.id,
      sourceId: source!.id,
    });
  }),
  processSources: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    const sources = await ctx.db.query.sources.findMany();
    const jobs = sources.map(async (source) => {
      const { data } = await axios.get<{ items: { title: string; url: string; desc: string; time: string }[] }>(
        `https://morss.fly.dev/:proxy:format=json:cors/${source.url}`,
      );
      await ctx.db
        .insert(articles)
        .values(
          data.items.map(
            (item): NewArticle => ({
              title: item.title,
              url: item.url,
              description: item.desc,
              timestamp: new Date(item.time),
              source: source.id,
              hash: createHash('sha1').update(item.url).digest('hex'),
            }),
          ),
        )
        .onConflictDoNothing({ target: articles.hash });
    });
    await Promise.all(jobs);
  }),
  fetchMySources: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const sourceIds = (
      await ctx.db.query.usersToSources.findMany({
        where: eq(usersToSources.userId, ctx.session.user.id),
      })
    ).map((s) => s.sourceId);
    if (sourceIds.length === 0) return [];

    return await ctx.db.query.sources.findMany({
      where: inArray(sources.id, sourceIds),
      columns: { id: true, title: true },
    });
  }),
  readArticle: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.db
      .insert(usersToArticles)
      .values({
        userId: ctx.session.user.id,
        articleId: input.id,
        lastRead: new Date(),
      })
      .onConflictDoUpdate({
        target: [usersToArticles.articleId, usersToArticles.userId],
        set: { lastRead: new Date() },
      });
  }),
});
