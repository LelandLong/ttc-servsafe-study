import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ============ QUERIES ============

// Get a user's synced progress and badges
export const getProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Get all students with summary stats (for professor dashboard)
export const getAllStudents = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const results = [];

    for (const user of users) {
      const progress = await ctx.db
        .query("userProgress")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      results.push({
        userId: user._id,
        gamerName: user.gamerName,
        displayName: user.displayName,
        firstName: user.firstName,
        totalAnswered: progress?.progress?.totalAnswered || 0,
        totalCorrect: progress?.progress?.totalCorrect || 0,
        badgeCount: progress?.badges?.length || 0,
        lastActiveAt: user.lastActiveAt,
        createdAt: user.createdAt,
      });
    }

    // Sort by lastActiveAt descending (most recent first)
    results.sort((a, b) => b.lastActiveAt - a.lastActiveAt);
    return results;
  },
});

// Get detailed info for a single student (professor detail view)
export const getStudentDetail = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const progress = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    const archives = await ctx.db
      .query("progressArchives")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Sort archives by archivedAt descending
    archives.sort((a, b) => b.archivedAt - a.archivedAt);

    return {
      user,
      progress: progress?.progress || null,
      badges: progress?.badges || [],
      lastSyncedAt: progress?.lastSyncedAt || null,
      archives,
    };
  },
});

// Get anonymized class-wide statistics
export const getClassStats = query({
  args: {},
  handler: async (ctx) => {
    const allProgress = await ctx.db.query("userProgress").collect();

    // Filter to students who have actually answered questions
    const active = allProgress.filter(
      (p) => p.progress && p.progress.totalAnswered > 0
    );

    if (active.length === 0) {
      return {
        studentCount: 0,
        avgAccuracy: 0,
        avgQuestionsAnswered: 0,
        avgBadgeCount: 0,
        categoryAverages: {},
        chapterAverages: {},
      };
    }

    let totalAccuracy = 0;
    let totalQuestions = 0;
    let totalBadges = 0;
    const categoryTotals: Record<string, { totalAccuracy: number; count: number }> = {};
    const chapterTotals: Record<string, { totalAccuracy: number; count: number }> = {};

    for (const p of active) {
      const prog = p.progress;
      const accuracy = prog.totalAnswered > 0 ? prog.totalCorrect / prog.totalAnswered : 0;
      totalAccuracy += accuracy;
      totalQuestions += prog.totalAnswered;
      totalBadges += (p.badges?.length || 0);

      // Aggregate category stats
      if (prog.categoryStats) {
        for (const [cat, stats] of Object.entries(prog.categoryStats)) {
          const s = stats as { correct: number; total: number };
          if (s.total > 0) {
            if (!categoryTotals[cat]) categoryTotals[cat] = { totalAccuracy: 0, count: 0 };
            categoryTotals[cat].totalAccuracy += s.correct / s.total;
            categoryTotals[cat].count += 1;
          }
        }
      }

      // Aggregate chapter stats
      if (prog.chapterStats) {
        for (const [ch, stats] of Object.entries(prog.chapterStats)) {
          const s = stats as { correct: number; answered: number };
          if (s.answered > 0) {
            if (!chapterTotals[ch]) chapterTotals[ch] = { totalAccuracy: 0, count: 0 };
            chapterTotals[ch].totalAccuracy += s.correct / s.answered;
            chapterTotals[ch].count += 1;
          }
        }
      }
    }

    // Compute category averages
    const categoryAverages: Record<string, { avgAccuracy: number; studentsAttempted: number }> = {};
    for (const [cat, totals] of Object.entries(categoryTotals)) {
      categoryAverages[cat] = {
        avgAccuracy: totals.totalAccuracy / totals.count,
        studentsAttempted: totals.count,
      };
    }

    // Compute chapter averages
    const chapterAverages: Record<string, { avgAccuracy: number; studentsAttempted: number }> = {};
    for (const [ch, totals] of Object.entries(chapterTotals)) {
      chapterAverages[ch] = {
        avgAccuracy: totals.totalAccuracy / totals.count,
        studentsAttempted: totals.count,
      };
    }

    return {
      studentCount: active.length,
      avgAccuracy: totalAccuracy / active.length,
      avgQuestionsAnswered: totalQuestions / active.length,
      avgBadgeCount: totalBadges / active.length,
      categoryAverages,
      chapterAverages,
    };
  },
});

// Get all progress archives for a student
export const getStudentArchives = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const archives = await ctx.db
      .query("progressArchives")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    archives.sort((a, b) => b.archivedAt - a.archivedAt);
    return archives;
  },
});

// ============ MUTATIONS ============

// Register a new user account
export const register = mutation({
  args: {
    gamerName: v.string(),
    firstName: v.string(),
  },
  handler: async (ctx, args) => {
    const gamerNameLower = args.gamerName.trim().toLowerCase();
    const firstNameLower = args.firstName.trim().toLowerCase();

    // Validate lengths
    if (gamerNameLower.length < 2 || gamerNameLower.length > 20) {
      throw new Error("Gamer name must be 2-20 characters");
    }
    if (firstNameLower.length < 1 || firstNameLower.length > 30) {
      throw new Error("First name must be 1-30 characters");
    }

    // Check uniqueness
    const existing = await ctx.db
      .query("users")
      .withIndex("by_gamerName", (q) => q.eq("gamerName", gamerNameLower))
      .first();

    if (existing) {
      throw new Error("Gamer name is already taken");
    }

    const now = Date.now();

    // Create user
    const userId = await ctx.db.insert("users", {
      gamerName: gamerNameLower,
      firstName: firstNameLower,
      displayName: args.gamerName.trim(), // Preserve original casing
      createdAt: now,
      lastActiveAt: now,
    });

    // Create empty progress
    await ctx.db.insert("userProgress", {
      userId,
      progress: {
        totalAnswered: 0,
        totalCorrect: 0,
        categoryStats: {},
        chapterStats: {},
        questionHistory: {},
        hintsUsed: 0,
        correctWithoutHint: 0,
        currentNoHintStreak: 0,
        bestNoHintStreak: 0,
        currentStreak: 0,
        bestStreak: 0,
        examFocusCorrect: 0,
        studiedEarly: false,
        studiedLate: false,
        studiedWeekend: false,
      },
      badges: [],
      lastSyncedAt: now,
    });

    return { userId, displayName: args.gamerName.trim() };
  },
});

// Login / reconnect to existing account
export const login = mutation({
  args: {
    gamerName: v.string(),
    firstName: v.string(),
  },
  handler: async (ctx, args) => {
    const gamerNameLower = args.gamerName.trim().toLowerCase();
    const firstNameLower = args.firstName.trim().toLowerCase();

    const user = await ctx.db
      .query("users")
      .withIndex("by_gamerName", (q) => q.eq("gamerName", gamerNameLower))
      .first();

    if (!user) {
      throw new Error("No account found with that gamer name");
    }

    if (user.firstName !== firstNameLower) {
      throw new Error("First name doesn't match");
    }

    // Update last active
    await ctx.db.patch(user._id, { lastActiveAt: Date.now() });

    return { userId: user._id, displayName: user.displayName };
  },
});

// Sync progress to cloud
export const syncProgress = mutation({
  args: {
    userId: v.id("users"),
    progress: v.any(),
    badges: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Update last active on user
    await ctx.db.patch(args.userId, { lastActiveAt: now });

    // Find existing progress
    const existing = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        progress: args.progress,
        badges: args.badges,
        lastSyncedAt: now,
      });
    } else {
      await ctx.db.insert("userProgress", {
        userId: args.userId,
        progress: args.progress,
        badges: args.badges,
        lastSyncedAt: now,
      });
    }

    return { success: true };
  },
});

// Reset progress (archives current data first)
export const resetProgress = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Get current progress
    const current = await ctx.db
      .query("userProgress")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (current && current.progress && current.progress.totalAnswered > 0) {
      // Count existing archives to determine reset number
      const archives = await ctx.db
        .query("progressArchives")
        .withIndex("by_userId", (q) => q.eq("userId", args.userId))
        .collect();

      // Archive current progress
      await ctx.db.insert("progressArchives", {
        userId: args.userId,
        progress: current.progress,
        badges: current.badges,
        archivedAt: now,
        resetNumber: archives.length + 1,
      });
    }

    // Clear current progress
    if (current) {
      await ctx.db.patch(current._id, {
        progress: {
          totalAnswered: 0,
          totalCorrect: 0,
          categoryStats: {},
          chapterStats: {},
          questionHistory: {},
          hintsUsed: 0,
          correctWithoutHint: 0,
          currentNoHintStreak: 0,
          bestNoHintStreak: 0,
          currentStreak: 0,
          bestStreak: 0,
          examFocusCorrect: 0,
          studiedEarly: false,
          studiedLate: false,
          studiedWeekend: false,
        },
        badges: [],
        lastSyncedAt: now,
      });
    }

    return { success: true };
  },
});

// Check if a gamer name is available
export const checkGamerName = query({
  args: { gamerName: v.string() },
  handler: async (ctx, args) => {
    const gamerNameLower = args.gamerName.trim().toLowerCase();

    if (gamerNameLower.length < 2) {
      return { available: false, reason: "Too short" };
    }

    const existing = await ctx.db
      .query("users")
      .withIndex("by_gamerName", (q) => q.eq("gamerName", gamerNameLower))
      .first();

    return { available: !existing };
  },
});
