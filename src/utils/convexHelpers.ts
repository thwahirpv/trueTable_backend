import { Id } from "convex/_generated/dataModel";
import { query, mutation } from "../convex/_generated/server";

// Utility function to handle common database queries
export const getRestaurantById = async (ctx, restaurantId: Id<"restaurants">) => {
  return await ctx.db.get(restaurantId);
};

// Utility function to handle common error responses
export const handleError = (message: string) => {
  throw new Error(message);
};

// Utility function to format timestamps
export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

// Utility function to calculate total from an array of items
export const calculateTotal = (items: { totalPrice: number }[]) => {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
};