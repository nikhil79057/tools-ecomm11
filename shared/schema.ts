import { sql, relations } from 'drizzle-orm';
import {
  index,
  json,
  mysqlTable,
  timestamp,
  varchar,
  text,
  int,
  boolean,
  decimal,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  role: varchar("role", { length: 50 }).default("seller"), // 'seller' | 'admin'
  status: varchar("status", { length: 50 }).default("active"), // 'active' | 'suspended'
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  isTrialActive: boolean("is_trial_active").default(true),
  hasCompletedTrial: boolean("has_completed_trial").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Tools table
export const tools = mysqlTable("tools", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  trialDays: int("trial_days").default(7),
  category: varchar("category", { length: 100 }).default("keyword-research"), // 'keyword-research', 'competitor-analysis', 'listing-optimizer'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// User subscriptions
export const subscriptions = mysqlTable("subscriptions", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  toolId: varchar("tool_id", { length: 255 }).references(() => tools.id).notNull(),
  status: varchar("status", { length: 50 }).default("active"), // 'active' | 'cancelled' | 'expired'
  subscriptionType: varchar("subscription_type", { length: 50 }).default("trial"), // 'trial' | 'paid'
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  razorpaySubscriptionId: varchar("razorpay_subscription_id", { length: 255 }),
  razorpayOrderId: varchar("razorpay_order_id", { length: 255 }),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Keyword research history
export const keywordResearches = mysqlTable("keyword_researches", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  seedKeyword: varchar("seed_keyword", { length: 255 }).notNull(),
  platforms: json("platforms").notNull(), // Array of platforms ['amazon', 'flipkart']
  results: json("results").notNull(), // Store the keyword research results
  createdAt: timestamp("created_at").defaultNow(),
});

// Usage tracking
export const usageStats = mysqlTable("usage_stats", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  toolId: varchar("tool_id", { length: 255 }).references(() => tools.id).notNull(),
  actionType: varchar("action_type", { length: 50 }).notNull(), // 'search', 'export', 'api_call'
  createdAt: timestamp("created_at").defaultNow(),
});

// CMS content for landing page
export const cmsContent = mysqlTable("cms_content", {
  id: varchar("id", { length: 255 }).primaryKey().default(sql`(UUID())`),
  section: varchar("section", { length: 100 }).notNull().unique(), // 'hero', 'features', 'pricing'
  content: json("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// Define relations
export const userRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
  keywordResearches: many(keywordResearches),
  usageStats: many(usageStats),
}));

export const toolRelations = relations(tools, ({ many }) => ({
  subscriptions: many(subscriptions),
  usageStats: many(usageStats),
}));

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [subscriptions.toolId],
    references: [tools.id],
  }),
}));

export const keywordResearchRelations = relations(keywordResearches, ({ one }) => ({
  user: one(users, {
    fields: [keywordResearches.userId],
    references: [users.id],
  }),
}));

export const usageStatsRelations = relations(usageStats, ({ one }) => ({
  user: one(users, {
    fields: [usageStats.userId],
    references: [users.id],
  }),
  tool: one(tools, {
    fields: [usageStats.toolId],
    references: [tools.id],
  }),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertTool = typeof tools.$inferInsert;
export type Tool = typeof tools.$inferSelect;

export type InsertSubscription = typeof subscriptions.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;

export type InsertKeywordResearch = typeof keywordResearches.$inferInsert;
export type KeywordResearch = typeof keywordResearches.$inferSelect;

export type InsertUsageStats = typeof usageStats.$inferInsert;
export type UsageStats = typeof usageStats.$inferSelect;

export type InsertCmsContent = typeof cmsContent.$inferInsert;
export type CmsContent = typeof cmsContent.$inferSelect;

// Zod schemas
export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKeywordResearchSchema = createInsertSchema(keywordResearches).omit({
  id: true,
  createdAt: true,
});

export const insertUsageStatsSchema = createInsertSchema(usageStats).omit({
  id: true,
  createdAt: true,
});

export const insertCmsContentSchema = createInsertSchema(cmsContent).omit({
  id: true,
  updatedAt: true,
});