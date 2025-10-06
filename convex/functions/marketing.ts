import { action } from "../_generated/server";
import { v } from "convex/values";

export const generateCampaignContent = action({
  args: {
    restaurantId: v.id("restaurants"),
    campaignType: v.string(),
    occasion: v.optional(v.string()),
    targetAudience: v.string(),
  },
  handler: async (ctx, args) => {
    const restaurant = await ctx.runQuery("restaurants:get", {
      id: args.restaurantId,
    });
    
    const prompt = `Create a ${args.campaignType} campaign for ${restaurant.name}, 
                   targeting ${args.targetAudience}${args.occasion ? ` for ${args.occasion}` : ''}`;
    
    const aiContent = await generateMarketingContent(prompt);
    
    return {
      title: aiContent.title,
      message: aiContent.message,
      ctaText: aiContent.cta,
      aiGenerated: true,
      aiPrompt: prompt,
    };
  },
});