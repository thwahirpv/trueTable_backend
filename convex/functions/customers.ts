import { query, mutation } from "../_generated/server";
import { v } from "convex/values";

// Retrieve customer data by restaurant ID
export const getCustomersByRestaurant = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("customers")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();
  },
});

// Create a new customer
export const createCustomer = mutation({
  args: {
    restaurantId: v.id("restaurants"),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    preferences: v.array(v.string()),
    dietaryRestrictions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const customerId = await ctx.db.insert("customers", {
      restaurantId: args.restaurantId,
      name: args.name,
      phone: args.phone,
      email: args.email,
      whatsappNumber: args.whatsappNumber,
      preferences: args.preferences,
      dietaryRestrictions: args.dietaryRestrictions,
      createdAt: Date.now(),
      status: "active",
    });
    return customerId;
  },
});

// Update an existing customer
export const updateCustomer = mutation({
  args: {
    customerId: v.id("customers"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
    dietaryRestrictions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const updates: any = {};
    if (args.name) updates.name = args.name;
    if (args.phone) updates.phone = args.phone;
    if (args.email) updates.email = args.email;
    if (args.whatsappNumber) updates.whatsappNumber = args.whatsappNumber;
    if (args.preferences) updates.preferences = args.preferences;
    if (args.dietaryRestrictions) updates.dietaryRestrictions = args.dietaryRestrictions;

    await ctx.db.update(args.customerId, updates);
  },
});

// Delete a customer
export const deleteCustomer = mutation({
  args: { customerId: v.id("customers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.customerId);
  },
});