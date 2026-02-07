import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ QUERIES ============

// Get all questions
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("questions").collect();
    // Sort by questionId for consistent ordering
    return questions.sort((a, b) => a.questionId - b.questionId);
  },
});

// Get all categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    return categories.map(c => c.name).sort();
  },
});

// Get questions by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Get exam focus questions only
export const getExamFocus = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("questions").collect();
    return questions.filter(q => q.examFocus).sort((a, b) => a.questionId - b.questionId);
  },
});

// Get question count
export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("questions").collect();
    return questions.length;
  },
});

// ============ MUTATIONS ============

// Add a new question
export const addQuestion = mutation({
  args: {
    questionId: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    correct: v.number(),
    hint: v.string(),
    explanation: v.string(),
    category: v.string(),
    examFocus: v.boolean(),
    chapter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const newId = await ctx.db.insert("questions", args);

    // Update last modified timestamp
    await updateMetadata(ctx, "lastModified", new Date().toISOString());

    return newId;
  },
});

// Update an existing question
export const updateQuestion = mutation({
  args: {
    id: v.id("questions"),
    questionId: v.number(),
    question: v.string(),
    options: v.array(v.string()),
    correct: v.number(),
    hint: v.string(),
    explanation: v.string(),
    category: v.string(),
    examFocus: v.boolean(),
    chapter: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);

    // Update last modified timestamp
    await updateMetadata(ctx, "lastModified", new Date().toISOString());
  },
});

// Delete a question
export const deleteQuestion = mutation({
  args: { id: v.id("questions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);

    // Update last modified timestamp
    await updateMetadata(ctx, "lastModified", new Date().toISOString());
  },
});

// Add a new category
export const addCategory = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Check if category already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      throw new Error("Category already exists");
    }

    return await ctx.db.insert("categories", { name: args.name });
  },
});

// Delete a category (only if no questions use it)
export const deleteCategory = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    // Check if any questions use this category
    const questionsInCategory = await ctx.db
      .query("questions")
      .withIndex("by_category", (q) => q.eq("category", args.name))
      .first();

    if (questionsInCategory) {
      throw new Error("Cannot delete category that has questions");
    }

    const category = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (category) {
      await ctx.db.delete(category._id);
    }
  },
});

// Bulk import questions (replaces all existing)
export const bulkImport = mutation({
  args: {
    questions: v.array(v.object({
      questionId: v.number(),
      question: v.string(),
      options: v.array(v.string()),
      correct: v.number(),
      hint: v.string(),
      explanation: v.string(),
      category: v.string(),
      examFocus: v.boolean(),
      chapter: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    // Delete all existing questions
    const existing = await ctx.db.query("questions").collect();
    for (const q of existing) {
      await ctx.db.delete(q._id);
    }

    // Delete all existing categories
    const existingCats = await ctx.db.query("categories").collect();
    for (const c of existingCats) {
      await ctx.db.delete(c._id);
    }

    // Insert new questions
    const categorySet = new Set<string>();
    for (const q of args.questions) {
      await ctx.db.insert("questions", q);
      categorySet.add(q.category);
    }

    // Insert categories
    for (const cat of categorySet) {
      await ctx.db.insert("categories", { name: cat });
    }

    // Update last modified timestamp
    await updateMetadata(ctx, "lastModified", new Date().toISOString());

    return args.questions.length;
  },
});

// Reset to original questions (will be called with original data from frontend)
export const resetToOriginal = mutation({
  args: {
    questions: v.array(v.object({
      questionId: v.number(),
      question: v.string(),
      options: v.array(v.string()),
      correct: v.number(),
      hint: v.string(),
      explanation: v.string(),
      category: v.string(),
      examFocus: v.boolean(),
      chapter: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    // Same as bulkImport - replaces everything
    const existing = await ctx.db.query("questions").collect();
    for (const q of existing) {
      await ctx.db.delete(q._id);
    }

    const existingCats = await ctx.db.query("categories").collect();
    for (const c of existingCats) {
      await ctx.db.delete(c._id);
    }

    const categorySet = new Set<string>();
    for (const q of args.questions) {
      await ctx.db.insert("questions", q);
      categorySet.add(q.category);
    }

    for (const cat of categorySet) {
      await ctx.db.insert("categories", { name: cat });
    }

    await updateMetadata(ctx, "lastModified", new Date().toISOString());
    await updateMetadata(ctx, "resetToOriginal", new Date().toISOString());

    return args.questions.length;
  },
});

// Helper to update metadata
async function updateMetadata(ctx: any, key: string, value: string) {
  const existing = await ctx.db
    .query("metadata")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .first();

  if (existing) {
    await ctx.db.patch(existing._id, { value });
  } else {
    await ctx.db.insert("metadata", { key, value });
  }
}
