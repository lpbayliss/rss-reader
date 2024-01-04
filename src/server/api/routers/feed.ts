import { z } from 'zod';
import axios from 'axios';
import { createHash } from 'crypto';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { articles, sources } from '~/server/db/schema';

type Feed = {
  title: string;
  desc: string;
  items: {
    title: string;
    url: string;
    desc: string;
    content: string;
    time: string;
  }[];
};

type NewArticle = typeof articles.$inferInsert;

export const feedRouter = createTRPCRouter({
  fetch: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    return await ctx.db.query.articles.findMany({});
  }),
  createSource: protectedProcedure.input(z.object({ url: z.string() })).mutation(async ({ ctx, input }) => {
    const { data } = await axios.get<{ title: string; desc: string }>(
      `https://morss.fly.dev/:proxy:format=json:cors/${input.url}`,
    );
    const hash = createHash('sha1').update(input.url).digest('hex');
    await ctx.db.insert(sources).values({
      title: data.title,
      description: data.desc,
      hash: hash,
      url: input.url,
    });
  }),
  processSources: protectedProcedure.input(z.object({})).mutation(async ({ ctx }) => {
    const sources = await ctx.db.query.sources.findMany();
    const jobs = sources.map(async (source) => {
      const { data } = await axios.get<{ items: { title: string; url: string; desc: string; time: string }[] }>(
        `https://morss.fly.dev/:proxy:format=json:cors/${source.url}`,
      );
      await ctx.db.insert(articles).values(
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
      );
    });
    await Promise.all(jobs);
  }),
});
