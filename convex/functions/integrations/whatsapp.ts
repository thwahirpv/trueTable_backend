import { action } from "../_generated/server";
import { v } from "convex/values";

export const processWhatsAppOrder = action({
  args: {
    restaurantId: v.id("restaurants"),
    fromNumber: v.string(),
    message: v.string(),
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const parsedOrder = await parseOrderMessage(args.message);
    
    if (parsedOrder.isOrder) {
      const orderId = await ctx.runMutation("orders:create", {
        restaurantId: args.restaurantId,
        source: "whatsapp",
        customerInfo: {
          name: parsedOrder.customerName || "WhatsApp Customer",
          phone: args.fromNumber,
        },
        items: parsedOrder.items,
        totalAmount: parsedOrder.total,
        whatsappThreadId: args.threadId,
      });
      
      await sendWhatsAppMessage(args.fromNumber, 
        `Order confirmed! Order #${orderId}. Total: ₹${parsedOrder.total}. Expected delivery: 30-45 mins.`
      );
      
      return { success: true, orderId };
    }
    
    return { success: false, message: "Message not recognized as order" };
  },
});