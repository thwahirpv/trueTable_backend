import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Function to get analytics data for a specific restaurant
export const getAnalyticsData = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    const restaurant = await ctx.db.get(args.restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    // Fetch various analytics data
    const totalOrders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();

    const totalRevenue = totalOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const totalCustomers = await ctx.db
      .query("customers")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();

    const totalInventoryItems = await ctx.db
      .query("inventoryItems")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();

    return {
      restaurant,
      totalOrders: totalOrders.length,
      totalRevenue,
      totalCustomers: totalCustomers.length,
      totalInventoryItems: totalInventoryItems.length,
    };
  },
});

// Function to generate a report based on analytics data
export const generateAnalyticsReport = mutation({
  args: { restaurantId: v.id("restaurants"), reportType: v.string() },
  handler: async (ctx, args) => {
    const analyticsData = await ctx.runQuery("analytics:getAnalyticsData", {
      restaurantId: args.restaurantId,
    });

    // Logic to generate report based on reportType
    let report;
    if (args.reportType === "monthly") {
      report = `Monthly Report for ${analyticsData.restaurant.name}:\n` +
               `Total Orders: ${analyticsData.totalOrders}\n` +
               `Total Revenue: ₹${analyticsData.totalRevenue.toFixed(2)}\n` +
               `Total Customers: ${analyticsData.totalCustomers}\n` +
               `Total Inventory Items: ${analyticsData.totalInventoryItems}`;
    } else {
      throw new Error("Invalid report type");
    }

    // Here you could implement logic to save the report or send it via email, etc.

    return { success: true, report };
  },
});