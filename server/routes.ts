import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertToolSchema, insertSubscriptionSchema, insertKeywordResearchSchema, insertUsageStatsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Tools routes
  app.get('/api/tools', async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools);
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  app.post('/api/tools', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const toolData = insertToolSchema.parse(req.body);
      const tool = await storage.createTool(toolData);
      res.json(tool);
    } catch (error) {
      console.error("Error creating tool:", error);
      res.status(500).json({ message: "Failed to create tool" });
    }
  });

  // Subscription routes
  app.get('/api/subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const subscriptions = await storage.getUserSubscriptions(userId);
      res.json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  app.post('/api/subscriptions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { toolId } = req.body;
      
      // Check if user already has active subscription
      const existingSubscription = await storage.getActiveSubscription(userId, toolId);
      if (existingSubscription) {
        return res.status(400).json({ message: "Already subscribed to this tool" });
      }

      // Create subscription
      const subscriptionData = {
        userId,
        toolId,
        status: 'active' as const,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      };
      
      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Usage stats routes
  app.get('/api/stats/usage', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserUsageStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching usage stats:", error);
      res.status(500).json({ message: "Failed to fetch usage stats" });
    }
  });

  // Keyword research routes
  app.post('/api/keyword-research', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { seedKeyword, platforms } = req.body;

      if (!seedKeyword || !platforms || !Array.isArray(platforms)) {
        return res.status(400).json({ message: "seedKeyword and platforms are required" });
      }

      // Mock keyword research results
      const mockKeywords = [
        { keyword: `${seedKeyword} wireless`, volume: 45000, competition: 'Medium' },
        { keyword: `${seedKeyword} bluetooth`, volume: 32100, competition: 'High' },
        { keyword: `${seedKeyword} gaming`, volume: 28900, competition: 'Low' },
        { keyword: `${seedKeyword} waterproof`, volume: 15600, competition: 'Medium' },
        { keyword: `${seedKeyword} professional`, volume: 12300, competition: 'High' },
      ];

      const results = {
        amazon: platforms.includes('amazon') ? mockKeywords : [],
        flipkart: platforms.includes('flipkart') ? mockKeywords.map(k => ({ 
          ...k, 
          volume: Math.round(k.volume * 0.6) 
        })) : []
      };

      res.json(results);
    } catch (error) {
      console.error("Error performing keyword research:", error);
      res.status(500).json({ message: "Failed to perform keyword research" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Mock analytics data for now
      const analytics = {
        mrr: 12500,
        revenueGrowth: 15.2,
        activeSubscribers: 248,
        subscriberGrowth: 23,
        churnRate: 2.1,
        totalSearches: 15420
      };
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}