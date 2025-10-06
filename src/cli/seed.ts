import { action } from "convex/_generated/server";
import { v } from "convex/values";

export const seedDatabase = action({
  handler: async (ctx) => {
    // Seed initial restaurant data
    const restaurantId = await ctx.runMutation("restaurants:create", {
      name: "Test Restaurant",
      address: "123 Test St",
      phone: "123-456-7890",
      email: "test@restaurant.com",
      ownerId: "owner-id", // Replace with actual owner ID
      tier: "free",
      subscriptionStatus: "active",
      settings: {
        timezone: "UTC",
        currency: "USD",
        language: "en",
      },
      limits: {
        maxInventoryItems: 100,
        maxSuppliers: 5,
        maxEmployees: 10,
        maxCampaigns: 5,
      },
      isActive: true,
      createdAt: Date.now(),
    });

    // Seed initial inventory items
    await ctx.runMutation("inventory:create", {
      restaurantId,
      name: "Test Item",
      category: "Food",
      unit: "kg",
      currentQuantity: 50,
      minimumThreshold: 10,
      maximumThreshold: 100,
      costPerUnit: 5.0,
      status: "in_stock",
      lastUpdated: Date.now(),
      isActive: true,
    });

    // Seed initial staff data
    await ctx.runMutation("staff:create", {
      restaurantId,
      name: "Test Staff",
      role: "manager",
      email: "staff@restaurant.com",
      phone: "987-654-3210",
      isActive: true,
      createdAt: Date.now(),
    });

    // Seed initial marketing campaigns
    await ctx.runMutation("marketing:create", {
      restaurantId,
      name: "Test Campaign",
      type: "email",
      status: "active",
      content: {
        title: "Welcome to Test Restaurant!",
        message: "Enjoy a 10% discount on your first order.",
      },
      createdAt: Date.now(),
      createdBy: "owner-id", // Replace with actual owner ID
    });

    return { success: true };
  },
});