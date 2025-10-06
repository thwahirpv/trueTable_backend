import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Create a new order
export const createOrder = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    customerId: v.optional(v.id("customers")),
    items: v.array(v.object({
      name: v.string(),
      quantity: v.number(),
      price: v.float64(),
      notes: v.optional(v.string()),
      category: v.optional(v.string()),
    })),
    totalAmount: v.float64(),
    discountApplied: v.optional(v.float64()),
    paymentStatus: v.union(v.literal("pending"), v.literal("paid"), v.literal("refunded")),
    paymentMethod: v.optional(v.string()),
    customerInfo: v.object({
      name: v.string(),
      phone: v.string(),
      address: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      restaurantId: args.restaurantId,
      customerId: args.customerId,
      items: args.items,
      totalAmount: args.totalAmount,
      discountApplied: args.discountApplied,
      paymentStatus: args.paymentStatus,
      paymentMethod: args.paymentMethod,
      customerInfo: args.customerInfo,
      createdAt: Date.now(),
    });
    return orderId;
  },
});

// Get orders for a specific restaurant
export const getOrdersByRestaurant = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();
    return orders;
  },
});

// Get a specific order by ID
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    return order;
  },
});

// Update an existing order
export const updateOrder = mutation({
  args: {
    orderId: v.id("orders"),
    updates: v.object({
      status: v.optional(v.string()),
      items: v.optional(v.array(v.object({
        name: v.string(),
        quantity: v.number(),
        price: v.float64(),
        notes: v.optional(v.string()),
        category: v.optional(v.string()),
      }))),
      totalAmount: v.optional(v.float64()),
      paymentStatus: v.optional(v.union(v.literal("pending"), v.literal("paid"), v.literal("refunded"))),
    }),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.update(args.orderId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
    return true;
  },
});