import { action } from "../_generated/server";
import { v } from "convex/values";

export const forecastDemand = action({
  args: {
    restaurantId: v.id("restaurants"),
    itemId: v.id("inventoryItems"),
    historicalDays: v.number(),
  },
  handler: async (ctx, args) => {
    const historicalOrders = await ctx.runQuery("orders:getHistoricalForItem", {
      restaurantId: args.restaurantId,
      itemId: args.itemId,
      days: args.historicalDays,
    });
    
    const forecast = await predictDemand(historicalOrders);
    
    await ctx.runMutation("inventory:updateAIPrediction", {
      itemId: args.itemId,
      prediction: forecast,
    });
    
    return forecast;
  },
});