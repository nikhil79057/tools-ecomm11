import {
  users,
  tools,
  subscriptions,
  keywordResearches,
  usageStats,
  cmsContent,
  type User,
  type UpsertUser,
  type Tool,
  type InsertTool,
  type Subscription,
  type InsertSubscription,
  type KeywordResearch,
  type InsertKeywordResearch,
  type UsageStats,
  type InsertUsageStats,
  type CmsContent,
  type InsertCmsContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, count } from "drizzle-orm";

export interface IStorage {
  // User operations (IMPORTANT) these are mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Tool operations
  getAllTools(): Promise<Tool[]>;
  getTool(id: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateTool(id: string, tool: Partial<InsertTool>): Promise<Tool>;
  
  // Subscription operations
  getUserSubscriptions(userId: string): Promise<(Subscription & { tool: Tool })[]>;
  getActiveSubscription(userId: string, toolId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<InsertSubscription>): Promise<Subscription>;
  
  // Keyword research operations
  createKeywordResearch(research: InsertKeywordResearch): Promise<KeywordResearch>;
  getUserKeywordResearches(userId: string, limit?: number): Promise<KeywordResearch[]>;
  
  // Usage tracking
  createUsageStats(usage: InsertUsageStats): Promise<UsageStats>;
  getUserUsageStats(userId: string, toolId?: string): Promise<{ searches: number; exports: number; apiCalls: number }>;
  
  // CMS operations
  getCmsContent(section: string): Promise<CmsContent | undefined>;
  updateCmsContent(section: string, content: any): Promise<CmsContent>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getUsersWithSubscriptions(): Promise<(User & { subscriptions: (Subscription & { tool: Tool })[] })[]>;
  getToolAnalytics(toolId: string): Promise<{ subscribers: number; revenue: number; usage: number }>;
  getPlatformAnalytics(): Promise<{ 
    mrr: number; 
    activeSubscribers: number; 
    churnRate: number; 
    totalSearches: number;
    revenueGrowth: number;
    subscriberGrowth: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Tool operations
  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.isActive, true));
  }

  async getTool(id: string): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool;
  }

  async createTool(tool: InsertTool): Promise<Tool> {
    const [newTool] = await db.insert(tools).values(tool).returning();
    return newTool;
  }

  async updateTool(id: string, tool: Partial<InsertTool>): Promise<Tool> {
    const [updatedTool] = await db
      .update(tools)
      .set({ ...tool, updatedAt: new Date() })
      .where(eq(tools.id, id))
      .returning();
    return updatedTool;
  }

  // Subscription operations
  async getUserSubscriptions(userId: string): Promise<(Subscription & { tools: Tool })[]> {
    const results = await db
      .select()
      .from(subscriptions)
      .innerJoin(tools, eq(subscriptions.toolId, tools.id))
      .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")));
    
    return results.map(result => ({
      ...result.subscriptions,
      tools: result.tools
    }));
  }

  async getActiveSubscription(userId: string, toolId: string): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.toolId, toolId),
        eq(subscriptions.status, "active")
      ));
    return subscription;
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }

  async updateSubscription(id: string, updates: Partial<InsertSubscription>): Promise<Subscription> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return updatedSubscription;
  }

  // Keyword research operations
  async createKeywordResearch(research: InsertKeywordResearch): Promise<KeywordResearch> {
    const [newResearch] = await db.insert(keywordResearches).values(research).returning();
    return newResearch;
  }

  async getUserKeywordResearches(userId: string, limit = 10): Promise<KeywordResearch[]> {
    return await db
      .select()
      .from(keywordResearches)
      .where(eq(keywordResearches.userId, userId))
      .orderBy(desc(keywordResearches.createdAt))
      .limit(limit);
  }

  // Usage tracking
  async createUsageStats(usage: InsertUsageStats): Promise<UsageStats> {
    const [newUsage] = await db.insert(usageStats).values(usage).returning();
    return newUsage;
  }

  async getUserUsageStats(userId: string, toolId?: string): Promise<{ searches: number; exports: number; apiCalls: number }> {
    const baseQuery = db
      .select({ actionType: usageStats.actionType })
      .from(usageStats)
      .where(eq(usageStats.userId, userId));

    let results;
    if (toolId) {
      results = await db
        .select({ actionType: usageStats.actionType })
        .from(usageStats)
        .where(and(eq(usageStats.userId, userId), eq(usageStats.toolId, toolId)));
    } else {
      results = await baseQuery;
    }

    return {
      searches: results.filter((r: any) => r.actionType === 'search').length,
      exports: results.filter((r: any) => r.actionType === 'export').length,
      apiCalls: results.filter((r: any) => r.actionType === 'api_call').length,
    };
  }

  // CMS operations
  async getCmsContent(section: string): Promise<CmsContent | undefined> {
    const [content] = await db.select().from(cmsContent).where(eq(cmsContent.section, section));
    return content;
  }

  async updateCmsContent(section: string, content: any): Promise<CmsContent> {
    const [updatedContent] = await db
      .insert(cmsContent)
      .values({ section, content })
      .onConflictDoUpdate({
        target: cmsContent.section,
        set: { content, updatedAt: new Date() }
      })
      .returning();
    return updatedContent;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersWithSubscriptions(): Promise<(User & { subscriptions: (Subscription & { tools: Tool })[] })[]> {
    const usersData = await db.select().from(users);
    const result = [];

    for (const user of usersData) {
      const userSubscriptions = await this.getUserSubscriptions(user.id);
      result.push({ ...user, subscriptions: userSubscriptions });
    }

    return result;
  }

  async getToolAnalytics(toolId: string): Promise<{ subscribers: number; revenue: number; usage: number }> {
    const [subscriberCount] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(and(eq(subscriptions.toolId, toolId), eq(subscriptions.status, "active")));

    const tool = await this.getTool(toolId);
    const revenue = subscriberCount.count * (parseFloat(tool?.price || "0"));

    const [usageCount] = await db
      .select({ count: count() })
      .from(usageStats)
      .where(eq(usageStats.toolId, toolId));

    return {
      subscribers: subscriberCount.count,
      revenue,
      usage: usageCount.count,
    };
  }

  async getPlatformAnalytics(): Promise<{ 
    mrr: number; 
    activeSubscribers: number; 
    churnRate: number; 
    totalSearches: number;
    revenueGrowth: number;
    subscriberGrowth: number;
  }> {
    // Get active subscriptions count
    const [activeSubsResult] = await db
      .select({ count: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, "active"));

    // Calculate MRR (simplified - assumes annual billing)
    const activeSubscriptions = await db
      .select()
      .from(subscriptions)
      .innerJoin(tools, eq(subscriptions.toolId, tools.id))
      .where(eq(subscriptions.status, "active"));

    const mrr = activeSubscriptions.reduce((total, sub) => {
      return total + (parseFloat(sub.tools.price) / 12); // Convert annual to monthly
    }, 0);

    // Get total searches
    const [searchesResult] = await db
      .select({ count: count() })
      .from(usageStats)
      .where(eq(usageStats.actionType, "search"));

    return {
      mrr: Math.round(mrr),
      activeSubscribers: activeSubsResult.count,
      churnRate: 3.2, // Mock value - would need historical data to calculate
      totalSearches: searchesResult.count,
      revenueGrowth: 12.5, // Mock value
      subscriberGrowth: 8.2, // Mock value
    };
  }
}

export const storage = new DatabaseStorage();
