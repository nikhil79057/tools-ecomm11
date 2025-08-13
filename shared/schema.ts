import { sql, relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("seller"), // 'seller' | 'admin'
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  isTrialActive: boolean("is_trial_active").default(true),
  hasCompletedTrial: boolean("has_completed_trial").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tools table
export const tools = pgTable("tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  trialDays: integer("trial_days").default(7),
  category: varchar("category").default("keyword-research"), // 'keyword-research', 'competitor-analysis', 'listing-optimizer'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  toolId: varchar("tool_id").references(() => tools.id).notNull(),
  status: varchar("status").default("active"), // 'active' | 'cancelled' | 'expired'
  subscriptionType: varchar("subscription_type").default("trial"), // 'trial' | 'paid'
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  razorpaySubscriptionId: varchar("razorpay_subscription_id"),
  razorpayOrderId: varchar("razorpay_order_id"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Keyword research history
export const keywordResearches = pgTable("keyword_researches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  seedKeyword: varchar("seed_keyword").notNull(),
  platforms: jsonb("platforms").notNull(), // Array of platforms ['amazon', 'flipkart']
  results: jsonb("results").notNull(), // Store the keyword research results
  createdAt: timestamp("created_at").defaultNow(),
});

// Usage tracking
export const usageStats = pgTable("usage_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  toolId: varchar("tool_id").references(() => tools.id).notNull(),
  actionType: varchar("action_type").notNull(), // 'search', 'export', 'api_call'
  createdAt: timestamp("created_at").defaultNow(),
});

// CMS content for landing page
export const cmsContent = pgTable("cms_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  section: varchar("section").notNull(), // 'hero', 'features', 'pricing'
  content: jsonb("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
