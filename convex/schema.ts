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

  // ============ USER SYSTEM ============

  users: defineTable({
    gamerName: v.string(),      // Stored LOWERCASE for uniqueness
    firstName: v.string(),      // Stored LOWERCASE for matching
    displayName: v.string(),    // Original casing of gamerName for display
    isProf: v.optional(v.boolean()), // Professor account — excluded from class stats/leaderboards
    createdAt: v.number(),      // Epoch millis
    lastActiveAt: v.number(),   // Updated on each sync/login
  }).index("by_gamerName", ["gamerName"]),

  userProgress: defineTable({
    userId: v.id("users"),
    progress: v.any(),          // Full progress object (dynamic keys for categoryStats/chapterStats)
    badges: v.array(v.string()), // Array of earned badge IDs
    lastSyncedAt: v.number(),
  }).index("by_userId", ["userId"]),

  progressArchives: defineTable({
    userId: v.id("users"),
    progress: v.any(),          // Snapshot of progress at time of reset
    badges: v.array(v.string()), // Snapshot of badges at time of reset
    archivedAt: v.number(),     // When the reset occurred
    resetNumber: v.number(),    // 1st reset, 2nd reset, etc.
  }).index("by_userId", ["userId"]),

  // ============ LIVE TEST SYSTEM ============

  liveTests: defineTable({
    testId: v.string(),         // Unique test identifier
    name: v.string(),           // Test name (e.g., "Quiz 1 - Chapters 1-4")
    mode: v.string(),           // Study mode key (examFocus, chapter, quizGroup, etc.)
    modeValue: v.optional(v.any()), // Mode parameter (chapter number, quiz group, etc.)
    questionIds: v.array(v.number()), // Specific question IDs for this test
    timerMinutes: v.number(),   // Duration in minutes
    status: v.string(),         // "waiting" | "active" | "finished"
    createdAt: v.number(),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
  }).index("by_status", ["status"])
    .index("by_testId", ["testId"]),

  testResults: defineTable({
    testId: v.string(),
    userId: v.id("users"),
    answers: v.array(v.object({
      questionId: v.number(),
      selectedAnswer: v.number(),
      correct: v.boolean(),
      answeredAt: v.number(),
    })),
    score: v.number(),          // Running correct count
    totalAnswered: v.number(),  // Running total answered
    finishedAt: v.optional(v.number()),
  }).index("by_testId", ["testId"])
    .index("by_testId_userId", ["testId", "userId"]),
});
