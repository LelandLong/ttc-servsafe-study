import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  questions: defineTable({
    questionId: v.number(), // Original ID from the question (1-93, etc.)
    question: v.string(),
    options: v.array(v.string()),
    correct: v.number(),
    hint: v.string(),
    explanation: v.string(),
    category: v.string(),
    examFocus: v.boolean(),
  }).index("by_questionId", ["questionId"])
    .index("by_category", ["category"]),

  categories: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  // Store metadata like last updated timestamp
  metadata: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
});
