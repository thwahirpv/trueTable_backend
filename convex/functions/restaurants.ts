import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDashboardMetrics = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    const restaurant = await ctx.db.get(args.restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");
    
    // Get current day metrics
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).getTime();
    
    const todaysOrders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .filter((q) => q.gte(q.field("createdAt"), startOfDay))
      .collect();
    
    const lowStockItems = await ctx.db
      .query("inventoryItems")
      .withIndex("by_status", (q) => 
        q.eq("restaurantId", args.restaurantId).eq("status", "low_stock")
      )
      .collect();
    
    const activeCampaigns = await ctx.db
      .query("marketingCampaigns")
      .withIndex("by_status", (q) => 
        q.eq("restaurantId", args.restaurantId).eq("status", "active")
      )
      .collect();
    
    const pendingApplications = await ctx.db
      .query("jobApplications")
      .withIndex("by_status", (q) => 
        q.eq("restaurantId", args.restaurantId).eq("status", "applied")
      )
      .collect();

    return {
      restaurant,
      metrics: {
        todaysOrders: todaysOrders.length,
        todaysRevenue: todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0),
        lowStockAlerts: lowStockItems.length,
        activeCampaigns: activeCampaigns.length,
        pendingApplications: pendingApplications.length,
        averageOrderValue: todaysOrders.length > 0 
          ? todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0) / todaysOrders.length 
          : 0,
      },
      recentOrders: todaysOrders.slice(-5),
      lowStockItems: lowStockItems.slice(0, 5),
    };
  },
});