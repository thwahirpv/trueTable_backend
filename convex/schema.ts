import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User Management - Multi-tenant support
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("owner"), v.literal("manager"), v.literal("staff")),
    restaurantId: v.id("restaurants"),
    clerkUserId: v.optional(v.string()),
    isActive: v.boolean(),
    permissions: v.array(v.string()),
    tier: v.union(v.literal("free"), v.literal("paid"), v.literal("enterprise")),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_restaurant", ["restaurantId"])
    .index("by_clerk_id", ["clerkUserId"]),

  // Restaurant Profiles
  restaurants: defineTable({
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    email: v.string(),
    ownerId: v.id("users"),
    tier: v.union(v.literal("free"), v.literal("paid"), v.literal("enterprise")),
    subscriptionStatus: v.string(),
    settings: v.object({
      timezone: v.string(),
      currency: v.string(),
      language: v.string(),
      whatsappNumber: v.optional(v.string()),
    }),
    limits: v.object({
      maxInventoryItems: v.number(),
      maxSuppliers: v.number(),
      maxEmployees: v.number(),
      maxCampaigns: v.number(),
    }),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_tier", ["tier"]),

  // Inventory Management (TRUSupply)
  inventoryItems: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    category: v.string(),
    unit: v.string(),
    currentQuantity: v.float64(),
    minimumThreshold: v.float64(),
    maximumThreshold: v.float64(),
    costPerUnit: v.float64(),
    supplierId: v.optional(v.id("suppliers")),
    lastRestocked: v.optional(v.number()),
    expiryDate: v.optional(v.number()),
    status: v.union(v.literal("in_stock"), v.literal("low_stock"), v.literal("out_of_stock")),
    aiPrediction: v.optional(v.object({
      predictedDemand: v.float64(),
      reorderDate: v.number(),
      confidence: v.float64(),
    })),
    lastUpdated: v.number(),
    isActive: v.boolean(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_category", ["restaurantId", "category"])
    .index("by_status", ["restaurantId", "status"]),

  // Supplier Management
  suppliers: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    contactPerson: v.string(),
    phone: v.string(),
    email: v.string(),
    address: v.string(),
    whatsappNumber: v.optional(v.string()),
    rating: v.float64(),
    isActive: v.boolean(),
    paymentTerms: v.string(),
    deliverySchedule: v.array(v.string()),
    categories: v.array(v.string()),
    performance: v.object({
      onTimeDelivery: v.float64(),
      qualityRating: v.float64(),
      responseTime: v.float64(),
    }),
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_rating", ["restaurantId", "rating"]),

  // Purchase Orders (AI-generated)
  purchaseOrders: defineTable({
    restaurantId: v.id("restaurants"),
    supplierId: v.id("suppliers"),
    orderNumber: v.string(),
    status: v.union(
      v.literal("draft"), 
      v.literal("ai_generated"),
      v.literal("sent"), 
      v.literal("confirmed"), 
      v.literal("delivered"), 
      v.literal("cancelled")
    ),
    totalAmount: v.float64(),
    items: v.array(v.object({
      itemId: v.id("inventoryItems"),
      quantity: v.float64(),
      unitPrice: v.float64(),
      totalPrice: v.float64(),
    })),
    aiGenerated: v.boolean(),
    aiReasoning: v.optional(v.string()),
    expectedDelivery: v.number(),
    actualDelivery: v.optional(v.number()),
    whatsappMessageId: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_supplier", ["supplierId"])
    .index("by_status", ["restaurantId", "status"]),

  // Staff Management (TRUStaff)
  jobPostings: defineTable({
    restaurantId: v.id("restaurants"),
    title: v.string(),
    description: v.string(),
    department: v.string(),
    requirements: v.array(v.string()),
    salary: v.object({
      min: v.float64(),
      max: v.float64(),
      type: v.union(v.literal("hourly"), v.literal("monthly"), v.literal("annual")),
    }),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
    applicationsCount: v.number(),
    aiGenerated: v.boolean(),
    postedPlatforms: v.array(v.string()),
    createdAt: v.number(),
    postedBy: v.id("users"),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_status", ["restaurantId", "status"]),

  // Job Applications (AI-scored)
  jobApplications: defineTable({
    jobPostingId: v.id("jobPostings"),
    restaurantId: v.id("restaurants"),
    applicantName: v.string(),
    applicantEmail: v.string(),
    applicantPhone: v.string(),
    resumeFileId: v.optional(v.id("_storage")),
    aiScore: v.optional(v.float64()),
    aiAnalysis: v.optional(v.object({
      experienceMatch: v.float64(),
      skillsMatch: v.float64(),
      locationFit: v.float64(),
      recommendations: v.array(v.string()),
    })),
    status: v.union(
      v.literal("applied"), 
      v.literal("ai_screened"),
      v.literal("shortlisted"),
      v.literal("interview_scheduled"),
      v.literal("interviewed"), 
      v.literal("hired"), 
      v.literal("rejected")
    ),
    notes: v.string(),
    appliedAt: v.number(),
  })
    .index("by_job", ["jobPostingId"])
    .index("by_restaurant", ["restaurantId"])
    .index("by_status", ["restaurantId", "status"]),

  // Marketing Campaigns (TRUMarketing)
  marketingCampaigns: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    type: v.union(v.literal("whatsapp"), v.literal("email"), v.literal("social")),
    status: v.union(v.literal("draft"), v.literal("ai_generated"), v.literal("scheduled"), v.literal("active"), v.literal("completed"), v.literal("paused")),
    targetAudience: v.object({
      criteria: v.string(),
      estimatedReach: v.number(),
      segments: v.array(v.string()),
    }),
    content: v.object({
      title: v.string(),
      message: v.string(),
      imageUrl: v.optional(v.string()),
      ctaText: v.optional(v.string()),
      ctaUrl: v.optional(v.string()),
    }),
    aiGenerated: v.boolean(),
    aiPrompt: v.optional(v.string()),
    schedule: v.object({
      startDate: v.number(),
      endDate: v.optional(v.number()),
      frequency: v.string(),
    }),
    metrics: v.object({
      sent: v.number(),
      delivered: v.number(),
      opened: v.number(),
      clicked: v.number(),
      conversions: v.number(),
      revenue: v.float64(),
    }),
    createdAt: v.number(),
    createdBy: v.id("users"),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_status", ["restaurantId", "status"])
    .index("by_type", ["restaurantId", "type"]),

  // Customer Management
  customers: defineTable({
    restaurantId: v.id("restaurants"),
    name: v.string(),
    phone: v.string(),
    email: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    preferences: v.array(v.string()),
    dietaryRestrictions: v.array(v.string()),
    totalOrders: v.number(),
    totalSpent: v.float64(),
    lastOrderDate: v.optional(v.number()),
    loyaltyPoints: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("vip")),
    aiSegment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_phone", ["phone"])
    .index("by_loyalty", ["restaurantId", "loyaltyPoints"]),

  // Orders Management (WhatsApp Integration)
  orders: defineTable({
    restaurantId: v.id("restaurants"),
    customerId: v.optional(v.id("customers")),
    orderNumber: v.string(),
    source: v.union(v.literal("whatsapp"), v.literal("website"), v.literal("phone"), v.literal("walk_in")),
    status: v.union(
      v.literal("received"), 
      v.literal("confirmed"), 
      v.literal("preparing"), 
      v.literal("ready"), 
      v.literal("out_for_delivery"),
      v.literal("delivered"), 
      v.literal("completed"),
      v.literal("cancelled")
    ),
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
    whatsappThreadId: v.optional(v.string()),
    estimatedDelivery: v.optional(v.number()),
    actualDelivery: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_customer", ["customerId"])
    .index("by_status", ["restaurantId", "status"])
    .index("by_source", ["restaurantId", "source"]),

  // Analytics & AI Insights
  aiInsights: defineTable({
    restaurantId: v.id("restaurants"),
    type: v.union(
      v.literal("demand_forecast"),
      v.literal("revenue_prediction"), 
      v.literal("staff_optimization"),
      v.literal("menu_recommendation"),
      v.literal("customer_behavior")
    ),
    data: v.any(),
    confidence: v.float64(),
    actionItems: v.array(v.string()),
    generatedAt: v.number(),
    validUntil: v.number(),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_type", ["restaurantId", "type"]),

  // System Events & Analytics
  analyticsEvents: defineTable({
    restaurantId: v.id("restaurants"),
    eventType: v.string(),
    eventData: v.any(),
    userId: v.optional(v.id("users")),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  })
    .index("by_restaurant", ["restaurantId"])
    .index("by_type", ["restaurantId", "eventType"])
    .index("by_timestamp", ["restaurantId", "timestamp"]),
});