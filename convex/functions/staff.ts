import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Staff Management Functions

// Get all job postings for a specific restaurant
export const getJobPostings = query({
  args: { restaurantId: v.id("restaurants") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobPostings")
      .withIndex("by_restaurant", (q) => q.eq("restaurantId", args.restaurantId))
      .collect();
  },
});

// Create a new job posting
export const createJobPosting = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const jobPostingId = await ctx.db.insert("jobPostings", {
      restaurantId: args.restaurantId,
      title: args.title,
      description: args.description,
      department: args.department,
      requirements: args.requirements,
      salary: args.salary,
      status: "active",
      applicationsCount: 0,
      aiGenerated: false,
      postedPlatforms: [],
      createdAt: Date.now(),
      postedBy: ctx.userId,
    });
    return jobPostingId;
  },
});

// Update a job posting
export const updateJobPosting = mutation({
  args: {
    jobPostingId: v.id("jobPostings"),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      department: v.optional(v.string()),
      requirements: v.optional(v.array(v.string())),
      salary: v.optional(v.object({
        min: v.optional(v.float64()),
        max: v.optional(v.float64()),
        type: v.optional(v.union(v.literal("hourly"), v.literal("monthly"), v.literal("annual"))),
      })),
      status: v.optional(v.union(v.literal("active"), v.literal("paused"), v.literal("closed"))),
    }),
  },
  handler: async (ctx, args) => {
    const jobPosting = await ctx.db.get(args.jobPostingId);
    if (!jobPosting) throw new Error("Job posting not found");

    await ctx.db.update(args.jobPostingId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

// Get applications for a specific job posting
export const getJobApplications = query({
  args: { jobPostingId: v.id("jobPostings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobApplications")
      .withIndex("by_job", (q) => q.eq("jobPostingId", args.jobPostingId))
      .collect();
  },
});

// Create a new job application
export const createJobApplication = mutation({
  args: {
    jobPostingId: v.id("jobPostings"),
    restaurantId: v.id("restaurants"),
    applicantName: v.string(),
    applicantEmail: v.string(),
    applicantPhone: v.string(),
    resumeFileId: v.optional(v.id("_storage")),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const applicationId = await ctx.db.insert("jobApplications", {
      jobPostingId: args.jobPostingId,
      restaurantId: args.restaurantId,
      applicantName: args.applicantName,
      applicantEmail: args.applicantEmail,
      applicantPhone: args.applicantPhone,
      resumeFileId: args.resumeFileId,
      aiScore: null,
      aiAnalysis: null,
      status: "applied",
      notes: args.notes,
      appliedAt: Date.now(),
    });

    // Update the applications count for the job posting
    await ctx.db.update(args.jobPostingId, {
      applicationsCount: ctx.db.increment(1),
    });

    return applicationId;
  },
});