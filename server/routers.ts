import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getAllBlogPosts, 
  getBlogPostById, 
  getPendingTopics, 
  getPublicationLogs,
  getConfig,
  getAllConfigs,
  setConfig,
  getDb,
} from './db';

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // SEO Agent routers
  config: router({
    get: protectedProcedure.query(async () => {
      const configs = await getAllConfigs();
      return configs.reduce((acc, config) => {
        acc[config.key] = config.value;
        return acc;
      }, {} as Record<string, string>);
    }),
    set: protectedProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => {
        await setConfig(input.key, input.value);
        return { success: true };
      }),
  }),

  posts: router({
    list: protectedProcedure.query(async () => {
      return await getAllBlogPosts();
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getBlogPostById(input.id);
      }),
  }),

  topics: router({
    pending: protectedProcedure.query(async () => {
      return await getPendingTopics();
    }),
  }),

  publication: router({
    logs: protectedProcedure.query(async () => {
      return await getPublicationLogs();
    }),
    trigger: protectedProcedure.mutation(async () => {
      // This will be implemented to trigger manual publication
      return { success: true, message: 'Manual publication triggered' };
    }),
  }),

  workflow: router({
    approve: publicProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input }) => {
        const { approveArticle } = await import('./publication-workflow');
        await approveArticle(input.postId);
        return { success: true };
      }),
    reject: publicProcedure
      .input(z.object({ postId: z.number(), reason: z.string().optional() }))
      .mutation(async ({ input }) => {
        const { rejectArticle } = await import('./publication-workflow');
        await rejectArticle(input.postId, input.reason);
        return { success: true };
      }),
    publish: publicProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ input }) => {
        const { publishApprovedArticle } = await import('./publication-workflow');
        await publishApprovedArticle(input.postId);
        return { success: true };
      }),
  }),

  socialMedia: router({
    getByPostId: publicProcedure
      .input(z.object({ postId: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const { socialMediaPosts } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        return db.select().from(socialMediaPosts).where(eq(socialMediaPosts.blogPostId, input.postId));
      }),
  }),
});

export type AppRouter = typeof appRouter;
