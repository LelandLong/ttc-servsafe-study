import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  privatePages: defineTable({
    slug: v.string(),
    html: v.string(),
    title: v.optional(v.string()),  // Button label on the home screen
    icon: v.optional(v.string()),   // Emoji shown on the button
    blurb: v.optional(v.string()),  // One-line subtitle on the button
    order: v.optional(v.number()),  // Display position on the home screen; unset sorts last, then by slug
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  questions: defineTable({
    questionId: v.number(), // Original ID from the question (1-342 CUL-104, 1001+ CUL-105)
    question: v.string(),
    options: v.array(v.string()),
    correct: v.number(),
    hint: v.string(),
    explanation: v.string(),
    category: v.string(),
    examFocus: v.boolean(),
    chapter: v.optional(v.number()), // Chapter 1-15 for CUL-104 chapter-based filtering
    course: v.optional(v.string()),  // "CUL-104" or "CUL-105"
    topic: v.optional(v.string()),   // Topic name for CUL-105 topic-based filtering
    type: v.optional(v.string()),    // "quiz" or "flashcard" (default: "quiz")
  }).index("by_questionId", ["questionId"])
    .index("by_category", ["category"])
    .index("by_chapter", ["chapter"])
    .index("by_course", ["course"]),

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
    privateAccess: v.optional(v.boolean()), // Can view/publish private pages (HOS-190 etc.) WITHOUT prof/admin rights
    adminAccess: v.optional(v.boolean()),   // Shows the Admin-page link in the student app (isProf also shows it)
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
    course: v.optional(v.string()), // "CUL-104" or "CUL-105"
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

  // ============ RECIPES (Phase R1 — per-user recipe library) ============
  // See RECIPES-PLAN.md. Each recipe is owned by one user (ownerId).
  // R9: a recipe may be "global" (shared with all users, curated by its ownerId)
  // or "user" (private). Editing a global forks a personal deep copy (forkedFrom).
  recipes: defineTable({
    ownerId: v.id("users"),              // who owns this copy (curator, for globals)
    scope: v.optional(v.string()),       // "global" | "user" (absent ⇒ "user")
    forkedFrom: v.optional(v.id("recipes")), // provenance when copied from a global
    title: v.string(),
    description: v.optional(v.string()),
    // Each ingredient is either a legacy plain string OR a structured
    // {qty, unit, item}. Union keeps older string-based recipes valid.
    ingredients: v.array(v.union(
      v.string(),
      v.object({
        qty: v.optional(v.string()),   // "2", "1/2", "2-3" — string handles fractions/ranges
        unit: v.optional(v.string()),  // canonical abbrev: tsp, Tbsp, cup, lb, g...
        item: v.string(),              // lowercase ingredient name/description
      })
    )),
    steps: v.array(v.string()),          // ordered instructions
    notes: v.optional(v.string()),       // recipe-level tips/variations/storage/serving (shared with everyone; distinct from per-user recipeNotes)
    imageIds: v.optional(v.array(v.id("_storage"))), // 1+ images; [0] is the cover
    sourceType: v.optional(v.string()),  // "manual" | "url" | "photo"
    sourceUrl: v.optional(v.string()),   // for url imports
    prepMinutes: v.optional(v.number()),
    cookMinutes: v.optional(v.number()),
    servings: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),      // mood, cuisine, "kid-friendly", "quick", etc.
    pickyFlags: v.optional(v.array(v.string())),// ingredients/people to avoid
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"])
    .index("by_scope", ["scope"]),

  // Per-user custom notes overlaid on any recipe (R9b). Private to userId;
  // never mutates the (possibly global) recipe. One row per (user, recipe).
  recipeNotes: defineTable({
    userId: v.id("users"),
    recipeId: v.id("recipes"),
    notes: v.string(),
    updatedAt: v.number(),
  }).index("by_user_recipe", ["userId", "recipeId"])
    .index("by_recipe", ["recipeId"]),

  // Diner ratings of finished dishes (Phase R2). One row per rating.
  recipeScores: defineTable({
    recipeId: v.id("recipes"),
    ownerId: v.id("users"),              // denormalized (recipe owner) for easy per-user queries
    score: v.number(),                   // 1..10
    dinerName: v.optional(v.string()),   // who rated it (free text; not necessarily a user)
    notes: v.optional(v.string()),
    cookedOn: v.optional(v.number()),    // when the dish was made
    cookEventId: v.optional(v.string()), // groups ratings entered for one cooked-meal event
    createdAt: v.number(),
  }).index("by_recipe", ["recipeId"])
    .index("by_owner", ["ownerId"]),

  // Cook log (Phase R10): one row each time a user actually cooks a recipe for a
  // meal. Per-user (ownerId = who cooked it); works on global recipes too.
  // menuId + cookEventId tie the dishes of a single menu "I cooked this" into one
  // editable meal event (Phase R11-ish).
  recipeCookLog: defineTable({
    recipeId: v.id("recipes"),
    ownerId: v.id("users"),
    cookedOn: v.number(),                // epoch millis of the meal date
    dinerCount: v.optional(v.number()),  // how many people were served
    notes: v.optional(v.string()),
    menuId: v.optional(v.id("menus")),   // the menu this meal was cooked from
    cookEventId: v.optional(v.string()), // one value per "I cooked this" press (groups the dishes)
    createdAt: v.number(),
  }).index("by_recipe", ["recipeId"])
    .index("by_owner", ["ownerId"])
    .index("by_menu", ["menuId"]),

  // Global catalog of ingredient names for type-ahead (everyone shares it —
  // onion/garlic/etc are not user-specific). Stored lowercase, deduped.
  ingredientCatalog: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  // ============ MEAL PLANNING (menus, grocery, shopping trips) ============
  // A menu = a named meal/occasion the user is planning, holding a set of recipes.
  menus: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    recipeIds: v.array(v.id("recipes")),
    servings: v.optional(v.number()),       // headcount target; scales recipes for the grocery list
    plannedDate: v.optional(v.string()),    // optional yyyy-mm-dd
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  // Per-(list, item) grocery state: have-it, checked-off in store, and a personal note
  // ("1 jar"). listKey is "menu:<menuId>" for one menu or "trip:<tripId>" for a combined run.
  groceryItems: defineTable({
    ownerId: v.id("users"),
    listKey: v.string(),
    itemKey: v.string(),                    // normalized ingredient name (the aggregation key)
    have: v.optional(v.boolean()),
    checkedOff: v.optional(v.boolean()),
    note: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_list", ["listKey"])
    .index("by_list_item", ["listKey", "itemKey"]),

  // A shopping trip combines several menus into one grocery run (Phase 3).
  shoppingTrips: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    menuIds: v.array(v.id("menus")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),
});
