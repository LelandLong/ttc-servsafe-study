import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ QUERIES ============

// Get active test (waiting or active) for student polling
export const getActiveTest = query({
  args: {},
  handler: async (ctx) => {
    // Check for active test first
    const active = await ctx.db
      .query("liveTests")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .first();

    if (active) return active;

    // Then check for waiting test
    const waiting = await ctx.db
      .query("liveTests")
      .withIndex("by_status", (q) => q.eq("status", "waiting"))
      .first();

    return waiting || null;
  },
});

// Get leaderboard for a specific test
export const getTestLeaderboard = query({
  args: { testId: v.string() },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .collect();

    // Get user info for each result
    const leaderboard = [];
    for (const result of results) {
      const user = await ctx.db.get(result.userId);
      if (user) {
        leaderboard.push({
          userId: user._id,
          displayName: user.displayName,
          gamerName: user.gamerName,
          score: result.score,
          totalAnswered: result.totalAnswered,
          accuracy: result.totalAnswered > 0 ? result.score / result.totalAnswered : 0,
          finishedAt: result.finishedAt,
          // Speed metric: last answer time (for tiebreaking)
          lastAnswerTime: result.answers.length > 0
            ? result.answers[result.answers.length - 1].answeredAt
            : null,
        });
      }
    }

    // Sort by score desc, then by last answer time asc (faster = higher rank)
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.lastAnswerTime && b.lastAnswerTime) return a.lastAnswerTime - b.lastAnswerTime;
      return 0;
    });

    return leaderboard;
  },
});

// Get test history (finished tests for professor review)
export const getTestHistory = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db
      .query("liveTests")
      .withIndex("by_status", (q) => q.eq("status", "finished"))
      .collect();

    // Get participant count for each test
    const results = [];
    for (const test of tests) {
      const testResults = await ctx.db
        .query("testResults")
        .withIndex("by_testId", (q) => q.eq("testId", test.testId))
        .collect();

      results.push({
        ...test,
        participantCount: testResults.length,
      });
    }

    // Sort by createdAt descending (most recent first)
    results.sort((a, b) => b.createdAt - a.createdAt);
    return results;
  },
});

// Get detailed test info with all results
export const getTestDetail = query({
  args: { testId: v.string() },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("liveTests")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .first();

    if (!test) throw new Error("Test not found");

    const results = await ctx.db
      .query("testResults")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .collect();

    const detailedResults = [];
    for (const result of results) {
      const user = await ctx.db.get(result.userId);
      if (user) {
        detailedResults.push({
          ...result,
          displayName: user.displayName,
          gamerName: user.gamerName,
        });
      }
    }

    return { test, results: detailedResults };
  },
});

// ============ MUTATIONS ============

// Create a new test
export const createTest = mutation({
  args: {
    name: v.string(),
    mode: v.string(),
    modeValue: v.optional(v.any()),
    questionIds: v.array(v.number()),
    timerMinutes: v.number(),
  },
  handler: async (ctx, args) => {
    // Generate unique test ID
    const testId = "test-" + Date.now() + "-" + Math.random().toString(36).substring(2, 8);

    await ctx.db.insert("liveTests", {
      testId,
      name: args.name,
      mode: args.mode,
      modeValue: args.modeValue,
      questionIds: args.questionIds,
      timerMinutes: args.timerMinutes,
      status: "waiting",
      createdAt: Date.now(),
    });

    return { testId };
  },
});

// Start a test (professor hits Start)
export const startTest = mutation({
  args: { testId: v.string() },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("liveTests")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .first();

    if (!test) throw new Error("Test not found");
    if (test.status !== "waiting") throw new Error("Test is not in waiting state");

    const now = Date.now();

    await ctx.db.patch(test._id, {
      status: "active",
      startedAt: now,
      endedAt: now + (test.timerMinutes * 60 * 1000),
    });

    return { startedAt: now };
  },
});

// End a test (timer expired or professor stopped early)
export const endTest = mutation({
  args: { testId: v.string() },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("liveTests")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .first();

    if (!test) throw new Error("Test not found");

    await ctx.db.patch(test._id, {
      status: "finished",
      endedAt: Date.now(),
    });

    return { success: true };
  },
});

// Submit an answer during a live test
export const submitAnswer = mutation({
  args: {
    testId: v.string(),
    userId: v.id("users"),
    questionId: v.number(),
    selectedAnswer: v.number(),
    correct: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Find existing result for this user in this test
    const existing = await ctx.db
      .query("testResults")
      .withIndex("by_testId_userId", (q) =>
        q.eq("testId", args.testId).eq("userId", args.userId)
      )
      .first();

    const answer = {
      questionId: args.questionId,
      selectedAnswer: args.selectedAnswer,
      correct: args.correct,
      answeredAt: now,
    };

    if (existing) {
      // Append answer to existing result
      const updatedAnswers = [...existing.answers, answer];
      await ctx.db.patch(existing._id, {
        answers: updatedAnswers,
        score: existing.score + (args.correct ? 1 : 0),
        totalAnswered: existing.totalAnswered + 1,
      });
    } else {
      // Create new result for this user
      await ctx.db.insert("testResults", {
        testId: args.testId,
        userId: args.userId,
        answers: [answer],
        score: args.correct ? 1 : 0,
        totalAnswered: 1,
      });
    }

    return { success: true };
  },
});

// Delete a test and all its results
export const deleteTest = mutation({
  args: { testId: v.string() },
  handler: async (ctx, args) => {
    // Delete all results for this test
    const results = await ctx.db
      .query("testResults")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .collect();

    for (const result of results) {
      await ctx.db.delete(result._id);
    }

    // Delete the test
    const test = await ctx.db
      .query("liveTests")
      .withIndex("by_testId", (q) => q.eq("testId", args.testId))
      .first();

    if (test) {
      await ctx.db.delete(test._id);
    }

    return { success: true };
  },
});
