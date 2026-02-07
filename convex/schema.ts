import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    questionId: v.number(), // Original ID from the question (1-163, etc.)
    question: v.string(),
    options: v.array(v.string()),
    correct: v.number(),
    hint: v.string(),
    explanation: v.string(),
    category: v.string(),
    examFocus: v.boolean(),
    chapter: v.optional(v.number()), // Chapter 1-15 for chapter-based filtering
  }).index("by_questionId", ["questionId"])
    .index("by_category", ["category"])
    .index("by_chapter", ["chapter"]),

  categories: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  // Store metadata like last updated timestamp
  metadata: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
