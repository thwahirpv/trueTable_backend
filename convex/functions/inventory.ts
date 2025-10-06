import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";

export const getInventoryWithAI = query({
  args: { 
    restaurantId: v.id("restaurants"),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("inventoryItems")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId));
      
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    const items = await query.collect();
    
    // Get AI predictions for each item
    const itemsWithPredictions = items.map(item => ({
      ...item,
      needsReorder: item.currentQuantity <= item.minimumThreshold,
      daysUntilEmpty: item.aiPrediction 
        ? Math.floor((item.currentQuantity / item.aiPrediction.predictedDemand) * 7)
        : null,
    }));
    
    return itemsWithPredictions;
  },
});

export const generatePurchaseOrder = action({
  args: {
    restaurantId: v.id("restaurants"),
    supplierId: v.id("suppliers"),
    autoGenerate: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get low stock items for this supplier
    const lowStockItems = await ctx.runQuery("inventory:getLowStockForSupplier", {
      restaurantId: args.restaurantId,
      supplierId: args.supplierId,
    });
    
    if (lowStockItems.length === 0) {
      return { success: false, message: "No items need reordering" };
    }
    
    // AI logic to determine optimal quantities
    let orderItems = [];
    let aiReasoning = "AI-generated purchase order based on:\n";
    
    for (const item of lowStockItems) {
      const optimalQuantity = item.maximumThreshold - item.currentQuantity;
      const aiPrediction = item.aiPrediction?.predictedDemand || 0;
      
      // Adjust quantity based on AI prediction
      const adjustedQuantity = Math.max(
        optimalQuantity, 
        aiPrediction * 14 // 2 weeks of predicted demand
      );
      
      orderItems.push({
        itemId: item._id,
        quantity: adjustedQuantity,
        unitPrice: item.costPerUnit,
        totalPrice: adjustedQuantity * item.costPerUnit,
      });
      
      aiReasoning += `- ${item.name}: ${adjustedQuantity}${item.unit} (current: ${item.currentQuantity}, predicted demand: ${aiPrediction}/week)\n`;
    }
    
    const totalAmount = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const orderNumber = `PO-${Date.now()}`;
    
    // Create the purchase order
    const orderId = await ctx.runMutation("inventory:createPurchaseOrder", {
      restaurantId: args.restaurantId,
      supplierId: args.supplierId,
      orderNumber,
      items: orderItems,
      totalAmount,
      aiGenerated: args.autoGenerate,
      aiReasoning: args.autoGenerate ? aiReasoning : undefined,
      expectedDelivery: Date.now() + (3 * 24 * 60 * 60 * 1000), // 3 days
    });
    
    return { 
      success: true, 
      orderId, 
      orderNumber,
      totalAmount,
      aiReasoning: args.autoGenerate ? aiReasoning : undefined,
    };
  },
});