import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("SEO Agent Publication System", () => {
  it("should fetch pending topics", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const topics = await caller.topics.pending();
    
    expect(topics).toBeDefined();
    expect(Array.isArray(topics)).toBe(true);
    expect(topics.length).toBeGreaterThan(0);
    
    // Check first topic structure
    const firstTopic = topics[0];
    expect(firstTopic).toHaveProperty("id");
    expect(firstTopic).toHaveProperty("topicName");
    expect(firstTopic).toHaveProperty("keywords");
    expect(firstTopic).toHaveProperty("status");
    expect(firstTopic.status).toBe("pending");
  });

  it("should fetch all blog posts", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const posts = await caller.posts.list();
    
    expect(posts).toBeDefined();
    expect(Array.isArray(posts)).toBe(true);
  });

  it("should fetch configuration", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const config = await caller.config.get();
    
    expect(config).toBeDefined();
    expect(typeof config).toBe("object");
  });

  it("should save configuration", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.config.set({
      key: "test_key",
      value: "test_value",
    });
    
    expect(result).toEqual({ success: true });
  });
});
