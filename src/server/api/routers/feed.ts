import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';

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

export const feedRouter = createTRPCRouter({
  fetch: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    console.log(ctx.session.user.email);
    const res = await fetch('https://morss.fly.dev/:format=json:cors:order=newest/https://news.ycombinator.com/rss');
    const feed = (await res.json()) as Feed;
    return feed;
  }),
});
