import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// ============ RECIPES — Phase R1 CRUD (per-user library) ============
// See RECIPES-PLAN.md. All operations are scoped to an owner (the user id the
// client passes in), matching the existing explicit-userId pattern used in
// users.ts / tests.ts (there is no server-side auth context in this app).

// Ingredient validator: legacy string OR structured {qty, unit, item}.
const ingredientValidator = v.union(
  v.string(),
  v.object({
    qty: v.optional(v.string()),
    unit: v.optional(v.string()),
    item: v.string(),
  })
);

// Normalize a structured ingredient: lowercase the item, canonicalize the unit.
function normalizeIngredient(ing: any) {
  if (typeof ing === "string") return ing; // leave legacy strings as-is
  const item = (ing.item || "").trim().toLowerCase();
  const qty = ing.qty != null ? String(ing.qty).trim() : undefined;
  const unit = canonicalUnit(ing.unit);
  return { qty: qty || undefined, unit: unit || undefined, item };
}

// Canonical measurement abbreviations. Maps many spellings to one form.
// Case matters where it disambiguates: tsp (teaspoon) vs Tbsp (tablespoon).
const UNIT_MAP: Record<string, string> = {
  "tsp": "tsp", "teaspoon": "tsp", "teaspoons": "tsp", "t": "tsp",
  "tbsp": "Tbsp", "tablespoon": "Tbsp", "tablespoons": "Tbsp", "tbl": "Tbsp", "tbs": "Tbsp", "T": "Tbsp",
  "cup": "cup", "cups": "cup", "c": "cup",
  "oz": "oz", "ounce": "oz", "ounces": "oz",
  "fl oz": "fl oz", "fluid ounce": "fl oz", "fluid ounces": "fl oz",
  "lb": "lb", "lbs": "lb", "pound": "lb", "pounds": "lb",
  "g": "g", "gram": "g", "grams": "g",
  "kg": "kg", "kilogram": "kg", "kilograms": "kg",
  "ml": "ml", "milliliter": "ml", "milliliters": "ml",
  "l": "l", "liter": "l", "liters": "l",
  "pt": "pt", "pint": "pt", "pints": "pt",
  "qt": "qt", "quart": "qt", "quarts": "qt",
  "gal": "gal", "gallon": "gal", "gallons": "gal",
  "pinch": "pinch", "dash": "dash", "clove": "clove", "cloves": "clove",
  "can": "can", "cans": "can", "stick": "stick", "sticks": "stick",
  "slice": "slice", "slices": "slice", "piece": "piece", "pieces": "piece",
  "each": "each", "to taste": "to taste",
};

function canonicalUnit(u: any): string {
  if (u == null) return "";
  const raw = String(u).trim();
  if (!raw) return "";
  // Preserve explicit casing match first (so "T" -> Tbsp, "t" -> tsp).
  if (UNIT_MAP[raw] !== undefined) return UNIT_MAP[raw];
  const lower = raw.toLowerCase();
  if (UNIT_MAP[lower] !== undefined) return UNIT_MAP[lower];
  return lower; // unknown unit: keep lowercase as-is
}

// Add any structured ingredient items to the global catalog (deduped, lowercase).
async function syncIngredientCatalog(ctx: any, ingredients: any[]) {
  for (const ing of ingredients) {
    if (typeof ing === "string") continue;
    const name = (ing.item || "").trim().toLowerCase();
    if (!name) continue;
    const existing = await ctx.db
      .query("ingredientCatalog")
      .withIndex("by_name", (q: any) => q.eq("name", name))
      .first();
    if (!existing) await ctx.db.insert("ingredientCatalog", { name });
  }
}

// Shared field validators for create/update.
const recipeFields = {
  title: v.string(),
  description: v.optional(v.string()),
  ingredients: v.array(ingredientValidator),
  steps: v.array(v.string()),
  notes: v.optional(v.string()),       // tips, variations, storage, serving suggestions (recipe-level, shared)
  imageIds: v.optional(v.array(v.id("_storage"))),
  sourceType: v.optional(v.string()), // "manual" | "url" | "photo"
  sourceUrl: v.optional(v.string()),
  prepMinutes: v.optional(v.number()),
  cookMinutes: v.optional(v.number()),
  servings: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  pickyFlags: v.optional(v.array(v.string())),
  scope: v.optional(v.string()),       // "global" | "user" (R9)
  forkedFrom: v.optional(v.id("recipes")), // set when copied from a global (R9c)
};

// A recipe is visible to a viewer if they own it OR it is global.
function isVisibleTo(recipe: any, viewerId: string) {
  return recipe.ownerId === viewerId || recipe.scope === "global";
}

// Decorate a recipe with resolved image URLs, the VIEWER'S rating summary
// (avgScore + scoreCount), and the viewer's private note (R9b). Scores and notes
// are per-viewer so a shared/global recipe shows each user only their own data.
async function decorateRecipe(ctx: any, recipe: any, viewerId: string) {
  const ids = recipe.imageIds || [];
  const imageUrls = await Promise.all(
    ids.map((id: any) => ctx.storage.getUrl(id))
  );

  const allScores = await ctx.db
    .query("recipeScores")
    .withIndex("by_recipe", (q: any) => q.eq("recipeId", recipe._id))
    .collect();
  const scores = allScores.filter((s: any) => s.ownerId === viewerId);
  const scoreCount = scores.length;
  const avgScore = scoreCount > 0
    ? Math.round((scores.reduce((sum: number, s: any) => sum + s.score, 0) / scoreCount) * 10) / 10
    : null;

  const noteRow = await ctx.db
    .query("recipeNotes")
    .withIndex("by_user_recipe", (q: any) => q.eq("userId", viewerId).eq("recipeId", recipe._id))
    .first();

  return {
    ...recipe,
    imageUrls: imageUrls.filter((u: any) => u !== null),
    avgScore,
    scoreCount,
    isGlobal: recipe.scope === "global",
    canEdit: recipe.ownerId === viewerId,  // editing a global you don't own ⇒ fork instead
    myNote: noteRow ? noteRow.notes : "",
  };
}

// List the recipes visible to a user — their own PLUS all global recipes,
// merged (newest first). If the user forked a global into their own library,
// the global original is hidden for them (their fork shows instead).
export const getMyRecipes = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const personal = await ctx.db
      .query("recipes")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    const globals = await ctx.db
      .query("recipes")
      .withIndex("by_scope", (q) => q.eq("scope", "global"))
      .collect();

    const forked = new Set(
      personal.filter((p: any) => p.forkedFrom).map((p: any) => p.forkedFrom)
    );
    const seen = new Set(personal.map((p: any) => p._id));

    let merged = personal.slice();
    for (const g of globals) {
      if (!seen.has(g._id)) merged.push(g);
    }
    // Hide any global the user has forked — their personal copy stands in for it,
    // even if they happen to own the global (the curator's own globals).
    merged = merged.filter((r) => !forked.has(r._id));

    merged.sort((a, b) => b.updatedAt - a.updatedAt);
    return await Promise.all(merged.map((r) => decorateRecipe(ctx, r, args.ownerId)));
  },
});

// Get a single recipe (with image URLs). Visible if owned by the viewer or global.
export const getRecipe = query({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || !isVisibleTo(recipe, args.ownerId)) return null;
    return await decorateRecipe(ctx, recipe, args.ownerId);
  },
});

// Create a recipe owned by the given user. Returns the new recipe id.
export const createRecipe = mutation({
  args: {
    ownerId: v.id("users"),
    ...recipeFields,
  },
  handler: async (ctx, args) => {
    const { ownerId, ...fields } = args;

    if (!fields.title || fields.title.trim().length === 0) {
      throw new Error("Recipe title is required");
    }

    const normIngredients = (fields.ingredients || []).map(normalizeIngredient);

    const now = Date.now();
    const recipeId = await ctx.db.insert("recipes", {
      ownerId,
      ...fields,
      ingredients: normIngredients,
      title: fields.title.trim(),
      sourceType: fields.sourceType || "manual",
      createdAt: now,
      updatedAt: now,
    });

    await syncIngredientCatalog(ctx, normIngredients);
    return { recipeId };
  },
});

// Bulk-create many recipes for one owner in a single call (used for importing
// class-material recipe packets). Same normalization + catalog sync as createRecipe.
export const bulkCreateRecipes = mutation({
  args: {
    ownerId: v.id("users"),
    recipes: v.array(v.object(recipeFields)),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.ownerId);
    if (!user) throw new Error("Unknown owner");

    const now = Date.now();
    let count = 0;
    for (const r of args.recipes) {
      if (!r.title || r.title.trim().length === 0) continue;
      const normIngredients = (r.ingredients || []).map(normalizeIngredient);
      await ctx.db.insert("recipes", {
        ownerId: args.ownerId,
        ...r,
        ingredients: normIngredients,
        title: r.title.trim(),
        sourceType: r.sourceType || "manual",
        createdAt: now,
        updatedAt: now,
      });
      await syncIngredientCatalog(ctx, normIngredients);
      count++;
    }
    return { count };
  },
});

// Update a recipe the user owns. Only provided fields are changed.
export const updateRecipe = mutation({
  args: {
    recipeId: v.id("recipes"),
    ownerId: v.id("users"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    ingredients: v.optional(v.array(ingredientValidator)),
    steps: v.optional(v.array(v.string())),
    imageIds: v.optional(v.array(v.id("_storage"))),
    sourceType: v.optional(v.string()),
    sourceUrl: v.optional(v.string()),
    prepMinutes: v.optional(v.number()),
    cookMinutes: v.optional(v.number()),
    servings: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    pickyFlags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");
    // Global recipes are edited ONLY from the admin screen (no account, not even
    // the curator, edits a global from the student app — they fork instead).
    if (recipe.scope === "global") {
      throw new Error("Global recipes can only be edited from the admin screen.");
    }
    if (recipe.ownerId !== args.ownerId) {
      throw new Error("Not authorized to edit this recipe");
    }

    const { recipeId, ownerId, ...rawUpdates } = args;
    // Drop undefined keys so we only patch provided fields.
    const updates: Record<string, any> = {};
    for (const [k, val] of Object.entries(rawUpdates)) {
      if (val !== undefined) updates[k] = val;
    }
    if (typeof updates.title === "string") updates.title = updates.title.trim();
    if (Array.isArray(updates.ingredients)) {
      updates.ingredients = updates.ingredients.map(normalizeIngredient);
    }
    updates.updatedAt = Date.now();

    await ctx.db.patch(recipeId, updates);
    if (Array.isArray(updates.ingredients)) {
      await syncIngredientCatalog(ctx, updates.ingredients);
    }
    return { ok: true };
  },
});

// Delete a recipe the user owns, including its stored images.
export const deleteRecipe = mutation({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");
    if (recipe.scope === "global") {
      throw new Error("Global recipes can only be deleted from the admin screen.");
    }
    if (recipe.ownerId !== args.ownerId) {
      throw new Error("Not authorized to delete this recipe");
    }

    // Clean up associated images so they don't orphan in storage.
    for (const id of recipe.imageIds || []) {
      try {
        await ctx.storage.delete(id);
      } catch (e) {
        // Ignore if already gone.
      }
    }

    // Clean up associated diner scores so they don't orphan.
    const scores = await ctx.db
      .query("recipeScores")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    for (const s of scores) {
      await ctx.db.delete(s._id);
    }

    // Clean up any per-user notes attached to this recipe.
    const notes = await ctx.db
      .query("recipeNotes")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    for (const n of notes) {
      await ctx.db.delete(n._id);
    }

    // Clean up cook-log entries.
    const logs = await ctx.db
      .query("recipeCookLog")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    for (const l of logs) {
      await ctx.db.delete(l._id);
    }

    await ctx.db.delete(args.recipeId);
    return { ok: true };
  },
});

// Generate a short-lived upload URL the client POSTs an image to.
// Returns the storage id, which the client then stores in a recipe's imageIds.
export const generateUploadUrl = mutation({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    // ownerId required so only known users can request upload slots.
    const user = await ctx.db.get(args.ownerId);
    if (!user) throw new Error("Unknown user");
    return await ctx.storage.generateUploadUrl();
  },
});

// Set a recipe's cover image(s) directly. Used for batch image backfills (e.g. attaching
// the CUL-112 "On Cooking" textbook photos to the existing global recipe rows). Unlike
// updateRecipe, this is allowed on global recipes — it only touches imageIds, nothing else.
export const setRecipeImages = mutation({
  args: { recipeId: v.id("recipes"), imageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");
    await ctx.db.patch(args.recipeId, { imageIds: args.imageIds, updatedAt: Date.now() });
    return { recipeId: args.recipeId };
  },
});

// ============ DINER SCORES (Phase R2) ============

// Add a 1-10 rating to a recipe the user owns.
export const addScore = mutation({
  args: {
    recipeId: v.id("recipes"),
    ownerId: v.id("users"),
    score: v.number(),
    dinerName: v.optional(v.string()),
    notes: v.optional(v.string()),
    cookedOn: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");
    if (!isVisibleTo(recipe, args.ownerId)) {
      throw new Error("Not authorized to rate this recipe");
    }
    const score = Math.round(args.score);
    if (score < 1 || score > 10) {
      throw new Error("Score must be between 1 and 10");
    }

    const scoreId = await ctx.db.insert("recipeScores", {
      recipeId: args.recipeId,
      ownerId: args.ownerId,
      score,
      dinerName: args.dinerName && args.dinerName.trim() ? args.dinerName.trim() : undefined,
      notes: args.notes && args.notes.trim() ? args.notes.trim() : undefined,
      cookedOn: args.cookedOn,
      createdAt: Date.now(),
    });
    return { scoreId };
  },
});

// List the VIEWER'S own scores for a recipe (newest first). Works on global
// recipes too — each user only sees the ratings they entered.
export const getScores = query({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || !isVisibleTo(recipe, args.ownerId)) return [];
    const scores = await ctx.db
      .query("recipeScores")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    const mine = scores.filter((s) => s.ownerId === args.ownerId);
    mine.sort((a, b) => b.createdAt - a.createdAt);
    return mine;
  },
});

// Delete a single score the user owns.
export const deleteScore = mutation({
  args: { scoreId: v.id("recipeScores"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const score = await ctx.db.get(args.scoreId);
    if (!score) throw new Error("Score not found");
    if (score.ownerId !== args.ownerId) {
      throw new Error("Not authorized to delete this rating");
    }
    await ctx.db.delete(args.scoreId);
    return { ok: true };
  },
});

// ============ COOK LOG (Phase R10) ============

// Log a meal: record that the viewer cooked this recipe on a date, for N diners.
// Works on global recipes too (per-user — ownerId is who cooked it).
export const addCookLog = mutation({
  args: {
    recipeId: v.id("recipes"),
    ownerId: v.id("users"),
    cookedOn: v.number(),
    dinerCount: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || !isVisibleTo(recipe, args.ownerId)) {
      throw new Error("Not authorized to log this recipe");
    }
    const logId = await ctx.db.insert("recipeCookLog", {
      recipeId: args.recipeId,
      ownerId: args.ownerId,
      cookedOn: args.cookedOn,
      dinerCount: args.dinerCount != null && args.dinerCount > 0 ? Math.round(args.dinerCount) : undefined,
      notes: args.notes && args.notes.trim() ? args.notes.trim() : undefined,
      createdAt: Date.now(),
    });
    return { logId };
  },
});

// List the viewer's cook-log entries for a recipe (most recent meal first).
export const getCookLog = query({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || !isVisibleTo(recipe, args.ownerId)) return [];
    const rows = await ctx.db
      .query("recipeCookLog")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    const mine = rows.filter((r) => r.ownerId === args.ownerId);
    mine.sort((a, b) => b.cookedOn - a.cookedOn);
    return mine;
  },
});

// Delete one of the viewer's own cook-log entries.
export const deleteCookLog = mutation({
  args: { logId: v.id("recipeCookLog"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.logId);
    if (!row) throw new Error("Log entry not found");
    if (row.ownerId !== args.ownerId) throw new Error("Not authorized to delete this entry");
    await ctx.db.delete(args.logId);
    return { ok: true };
  },
});

// ============ TYPE-AHEAD SUGGESTIONS ============

// Distinct diner names this user has used before (for rating type-ahead). Per-user.
export const getMyDinerNames = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const scores = await ctx.db
      .query("recipeScores")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
    const names: string[] = [];
    const seen: Record<string, boolean> = {};
    for (const s of scores) {
      const n = (s.dinerName || "").trim();
      if (n && !seen[n.toLowerCase()]) { seen[n.toLowerCase()] = true; names.push(n); }
    }
    names.sort((a, b) => a.localeCompare(b));
    return names;
  },
});

// Global ingredient-name catalog (for ingredient type-ahead). Shared by all users.
export const getIngredientCatalog = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("ingredientCatalog").collect();
    return all.map((c) => c.name).sort((a, b) => a.localeCompare(b));
  },
});

// ============ PER-USER NOTES (R9b) ============

// Upsert the viewer's private note for a recipe (global or their own). Passing an
// empty/blank string clears it. Never touches the recipe itself.
export const setRecipeNote = mutation({
  args: {
    userId: v.id("users"),
    recipeId: v.id("recipes"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || !isVisibleTo(recipe, args.userId)) {
      throw new Error("Recipe not found");
    }
    const existing = await ctx.db
      .query("recipeNotes")
      .withIndex("by_user_recipe", (q) => q.eq("userId", args.userId).eq("recipeId", args.recipeId))
      .first();

    const text = args.notes.trim();
    if (!text) {
      if (existing) await ctx.db.delete(existing._id);
      return { ok: true, cleared: true };
    }
    if (existing) {
      await ctx.db.patch(existing._id, { notes: text, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("recipeNotes", {
        userId: args.userId,
        recipeId: args.recipeId,
        notes: text,
        updatedAt: Date.now(),
      });
    }
    return { ok: true };
  },
});

// ============ MIGRATION (R9a) ============

// One-shot: promote a curator's class-material recipes to global scope so all
// users see them. Idempotent — already-global rows are skipped. Run via:
//   npx convex run recipes:globalizeClassMaterial '{"curatorId":"<id>"}' --prod
export const globalizeClassMaterial = mutation({
  args: { curatorId: v.id("users") },
  handler: async (ctx, args) => {
    const owned = await ctx.db
      .query("recipes")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.curatorId))
      .collect();
    let updated = 0;
    for (const r of owned) {
      const tags = r.tags || [];
      if (tags.indexOf("class-material") !== -1 && r.scope !== "global") {
        await ctx.db.patch(r._id, { scope: "global" });
        updated++;
      }
    }
    return { updated, totalOwned: owned.length };
  },
});

// ============ ADMIN: GLOBAL RECIPE MANAGEMENT (admin.html only) ============
// These are the ONLY way to create/edit/delete global recipes. They follow the
// app's existing no-server-auth pattern (admin.html is the professor's tool).

// List every global recipe (with cover image URLs) for the admin manager.
export const adminListGlobalRecipes = query({
  args: {},
  handler: async (ctx) => {
    const globals = await ctx.db
      .query("recipes")
      .withIndex("by_scope", (q) => q.eq("scope", "global"))
      .collect();
    globals.sort((a, b) => a.title.localeCompare(b.title));
    return await Promise.all(
      globals.map(async (r) => {
        const ids = r.imageIds || [];
        const imageUrls = (await Promise.all(ids.map((id: any) => ctx.storage.getUrl(id))))
          .filter((u: any) => u !== null);
        return { ...r, imageUrls };
      })
    );
  },
});

// Create (no recipeId) or update (with recipeId) a global recipe. New globals are
// owned by the curator account (gamerName "rerun") so there is a known owner.
export const adminSaveGlobalRecipe = mutation({
  args: {
    recipeId: v.optional(v.id("recipes")),
    ...recipeFields,
  },
  handler: async (ctx, args) => {
    const { recipeId, ...fields } = args;
    if (!fields.title || fields.title.trim().length === 0) {
      throw new Error("Recipe title is required");
    }
    const normIngredients = (fields.ingredients || []).map(normalizeIngredient);

    if (recipeId) {
      const existing = await ctx.db.get(recipeId);
      if (!existing) throw new Error("Recipe not found");
      await ctx.db.patch(recipeId, {
        ...fields,
        ingredients: normIngredients,
        title: fields.title.trim(),
        scope: "global",
        updatedAt: Date.now(),
      });
      await syncIngredientCatalog(ctx, normIngredients);
      return { recipeId };
    }

    const curator = await ctx.db
      .query("users")
      .withIndex("by_gamerName", (q) => q.eq("gamerName", "rerun"))
      .first();
    if (!curator) throw new Error("Curator account 'rerun' not found");

    const now = Date.now();
    const newId = await ctx.db.insert("recipes", {
      ownerId: curator._id,
      ...fields,
      ingredients: normIngredients,
      title: fields.title.trim(),
      scope: "global",
      sourceType: fields.sourceType || "manual",
      createdAt: now,
      updatedAt: now,
    });
    await syncIngredientCatalog(ctx, normIngredients);
    return { recipeId: newId };
  },
});

// Delete a global recipe and its associated images / scores / notes.
export const adminDeleteGlobalRecipe = mutation({
  args: { recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe) throw new Error("Recipe not found");

    for (const id of recipe.imageIds || []) {
      try { await ctx.storage.delete(id); } catch (e) { /* already gone */ }
    }
    const scores = await ctx.db
      .query("recipeScores")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    for (const s of scores) await ctx.db.delete(s._id);
    const notes = await ctx.db
      .query("recipeNotes")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    for (const n of notes) await ctx.db.delete(n._id);
    const logs = await ctx.db
      .query("recipeCookLog")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    for (const l of logs) await ctx.db.delete(l._id);

    await ctx.db.delete(args.recipeId);
    return { ok: true };
  },
});

// ============ R3: URL IMPORT (AI-assisted, server-side) ============
// A Convex action fetches the page server-side (bypassing CORS) and parses it.
// Primary path: schema.org/Recipe JSON-LD (no API key needed). Fallback: send the
// page text to the Claude API. The action returns structured fields for the client
// to review and save — it does NOT save anything itself.

// resolveApiKey seam (R3/R7): global env key now; per-user override reserved.
function resolveApiKey(): string | null {
  return process.env.ANTHROPIC_API_KEY || null;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&deg;/gi, "°")
    .replace(/&frac12;/gi, "½")
    .replace(/&frac14;/gi, "¼")
    .replace(/&frac34;/gi, "¾");
}
function stripHtml(s: any): string {
  if (s == null) return "";
  return decodeEntities(String(s).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}
// ISO-8601 duration ("PT1H30M") -> minutes, or null.
function durationToMinutes(iso: any): number | null {
  if (!iso || typeof iso !== "string") return null;
  const m = iso.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?/);
  if (!m) return null;
  const total = parseInt(m[1] || "0", 10) * 1440 + parseInt(m[2] || "0", 10) * 60 + parseInt(m[3] || "0", 10);
  return total > 0 ? total : null;
}
function firstImageUrl(image: any): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (Array.isArray(image)) { for (const x of image) { const u = firstImageUrl(x); if (u) return u; } return null; }
  if (typeof image === "object") return image.url || null;
  return null;
}
function flattenSteps(instr: any): string[] {
  const out: string[] = [];
  function walk(node: any) {
    if (node == null) return;
    if (typeof node === "string") {
      String(node).split(/\r?\n+/).forEach((line) => { const t = stripHtml(line); if (t) out.push(t); });
      return;
    }
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (typeof node === "object") {
      if (node["@type"] === "HowToSection" || node.itemListElement) { walk(node.itemListElement); return; }
      const text = node.text || node.name;
      if (text) { const t = stripHtml(text); if (t) out.push(t); }
    }
  }
  walk(instr);
  return out;
}
function yieldToString(y: any): string {
  if (y == null) return "";
  if (Array.isArray(y)) y = y[0];
  if (typeof y === "number") return String(y);
  return stripHtml(y);
}
function tagsFrom(r: any): string[] {
  const tags: string[] = [];
  function add(v: any) {
    if (!v) return;
    if (Array.isArray(v)) { v.forEach(add); return; }
    String(v).split(",").forEach((p) => { const t = stripHtml(p).toLowerCase(); if (t && tags.indexOf(t) === -1) tags.push(t); });
  }
  add(r.recipeCuisine); add(r.recipeCategory); add(r.keywords);
  return tags.slice(0, 8);
}
// Find a schema.org Recipe node anywhere in parsed JSON-LD (handles @graph + arrays).
function findRecipeNode(parsed: any): any {
  const stack = [parsed];
  while (stack.length) {
    const node = stack.pop();
    if (node == null) continue;
    if (Array.isArray(node)) { node.forEach((x) => stack.push(x)); continue; }
    if (typeof node === "object") {
      const t = node["@type"];
      if (t === "Recipe" || (Array.isArray(t) && t.indexOf("Recipe") !== -1)) return node;
      if (node["@graph"]) stack.push(node["@graph"]);
    }
  }
  return null;
}
function mapRecipe(r: any, url: string) {
  const ingredients = (r.recipeIngredient || r.ingredients || [])
    .map((x: any) => stripHtml(x)).filter((x: string) => x);
  return {
    title: stripHtml(r.name) || "Imported recipe",
    description: stripHtml(r.description) || "",
    ingredients,
    steps: flattenSteps(r.recipeInstructions),
    servings: yieldToString(r.recipeYield),
    prepMinutes: durationToMinutes(r.prepTime),
    cookMinutes: durationToMinutes(r.cookTime),
    tags: tagsFrom(r),
    notes: "",                 // filled by the tips-only AI pass (JSON-LD has no tips field)
    imageUrl: firstImageUrl(r.image),
    sourceType: "url",
    sourceUrl: url,
  };
}

const AI_PROMPT = `You extract a single recipe from the provided content — the text of a web page, or a photo of a recipe card / cookbook page (which may be handwritten or printed). Return ONLY a JSON object (no markdown, no commentary) with exactly these keys:
{"title": string, "description": string, "ingredients": string[], "steps": string[], "servings": string, "prepMinutes": number|null, "cookMinutes": number|null, "tags": string[], "notes": string}
- ingredients: one string per ingredient line, e.g. "2 cups flour".
- steps: one string per instruction step, in order, with no leading numbers.
- notes: ALL the useful extra recipe information that isn't an ingredient or a numbered step — tips, "X tips for…" sections, variations, substitutions, storage/make-ahead/reheating instructions, serving suggestions, equipment, and chef's notes. Preserve it as readable text; keep sub-headings and use "- " bullets or blank lines between items. Do NOT invent any; "" if there genuinely is none.
- Exclude ads, navigation, comments, related-recipe links, newsletter prompts, and life-story preambles (but DO keep real cooking tips/variations in notes).
- Unknown text fields -> "", unknown minute fields -> null, unknown arrays -> [].
Return the JSON object only.`;

// Appended when more than one photo is supplied: the images are consecutive pages
// of ONE recipe (a book/cookbook recipe spanning pages), so they must be merged.
const MULTIPAGE_PROMPT = `IMPORTANT: The images above are CONSECUTIVE PAGES of a SINGLE recipe, in order. Combine them into ONE recipe — do not produce separate recipes. An ingredient list or step sequence that is cut off at the bottom of one page CONTINUES at the top of the next page; stitch them into one continuous list. Ignore anything repeated across pages that isn't recipe content (page numbers, running headers/footers, the book title). If a page shows only a finished-dish photo with no text, just use it for context.`;

function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ").trim();
}

// Model used for AI recipe extraction (URL fallback + photo import). Haiku 4.5 is
// the most cost-effective model and is plenty capable for this structured
// extraction (text + vision) — ~80% cheaper than Opus. Bump to "claude-sonnet-4-6"
// for a middle ground, or "claude-opus-4-8" for max capability.
const IMPORT_MODEL = "claude-haiku-4-5";

// Call the Claude Messages API and return the model's text. `content` is either a
// string (URL text) or a content-block array (image + prompt for photo import).
async function callClaude(apiKey: string, content: any, maxTokens?: number): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({ model: IMPORT_MODEL, max_tokens: maxTokens || 2000, messages: [{ role: "user", content }] }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error("AI request failed (" + res.status + "): " + t.slice(0, 160));
  }
  const data: any = await res.json();
  const block = (data.content || []).find((b: any) => b.type === "text");
  return block ? block.text : "";
}

// Parse the model's JSON reply into a recipe payload (shared by URL + photo import).
function recipeFromAiText(raw: string, sourceType: string, sourceUrl: string | null) {
  const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI returned no JSON");
  const obj = JSON.parse(raw.slice(start, end + 1));
  return {
    title: obj.title || "Imported recipe",
    description: obj.description || "",
    ingredients: Array.isArray(obj.ingredients) ? obj.ingredients : [],
    steps: Array.isArray(obj.steps) ? obj.steps : [],
    servings: obj.servings || "",
    prepMinutes: typeof obj.prepMinutes === "number" ? obj.prepMinutes : null,
    cookMinutes: typeof obj.cookMinutes === "number" ? obj.cookMinutes : null,
    tags: Array.isArray(obj.tags) ? obj.tags : [],
    notes: typeof obj.notes === "string" ? obj.notes : "",
    imageUrl: null,
    sourceType,
    sourceUrl,
  };
}

async function aiExtract(text: string, url: string, apiKey: string) {
  const raw = await callClaude(apiKey, AI_PROMPT + "\n\nPAGE CONTENT:\n" + text.slice(0, 16000));
  return recipeFromAiText(raw, "url", url);
}

// Tips-only AI pass for JSON-LD imports: the structured data gives us the core recipe
// for free, but tips/variations/storage live in the article body. This pulls JUST those.
const TIPS_PROMPT = `From the recipe web page text below, extract ONLY the supplementary tips and notes — any "tips" sections, variations, substitutions, storage / make-ahead / reheating, serving suggestions, equipment, and chef's notes. Do NOT include the ingredient list or the numbered cooking steps. Exclude ads, navigation, comments, related-recipe links, and newsletter prompts. Return ONLY a JSON object: {"notes": string} — readable text with "- " bullets / kept sub-headings; use "" if there genuinely are no such extras.`;

async function tipsOnlyExtract(text: string, apiKey: string): Promise<string> {
  const raw = await callClaude(apiKey, TIPS_PROMPT + "\n\nPAGE CONTENT:\n" + text.slice(0, 16000), 1000);
  const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return "";
  try {
    const obj = JSON.parse(raw.slice(start, end + 1));
    return typeof obj.notes === "string" ? obj.notes : "";
  } catch (e) { return ""; }
}

const BROWSER_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";
// Sites with bot protection (e.g. masterclass.com, many publishers) 403/429 a generic
// scraper but still serve the FULL page to Googlebot for SEO. So we identify as Googlebot
// on the retry. Future-proofs URL import against the whole class of "blocks scrapers" sites.
const GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function fetchWithUA(url: string, ua: string): Promise<Response> {
  return fetch(url, {
    headers: {
      "User-Agent": ua,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
}

// Fetch a page's HTML, retrying as Googlebot if the normal request is blocked.
// Returns { html } on success or { error } describing the failure.
async function fetchPageHtml(url: string): Promise<{ html?: string; error?: string }> {
  try {
    let res = await fetchWithUA(url, BROWSER_UA);
    if (!res.ok && (res.status === 403 || res.status === 429 || res.status === 451 || res.status === 503)) {
      res = await fetchWithUA(url, GOOGLEBOT_UA);
    }
    if (!res.ok) return { error: "Could not fetch the page (HTTP " + res.status + ")." };
    return { html: await res.text() };
  } catch (e: any) {
    return { error: "Could not reach that URL." };
  }
}

// Pull a usable cover-image URL from the page's social meta tags (og:image /
// twitter:image), resolving protocol-relative + root-relative forms. Skips broken
// placeholder values (some sites SSR a stub like content="h" for non-JS clients).
function ogImage(html: string, baseUrl: string): string | null {
  const metas = html.match(/<meta[^>]+>/gi) || [];
  for (const tag of metas) {
    if (!/(property|name)=["'](og:image(:secure_url)?|twitter:image(:src)?)["']/i.test(tag)) continue;
    const m = tag.match(/content=["']([^"']+)["']/i);
    if (!m) continue;
    let u = decodeEntities(m[1]).trim();
    if (u.length < 8) continue;
    if (/^\/\//.test(u)) u = "https:" + u;
    else if (/^\//.test(u)) { try { u = new URL(u, baseUrl).href; } catch (e) { continue; } }
    if (/^https?:\/\//i.test(u)) return u;
  }
  return null;
}

// Fetch a remote image server-side (Googlebot retry for blocked CDNs) and store it in
// Convex storage. Server-side avoids browser CORS entirely. Returns null on any failure
// (caller keeps the recipe without a cover — the user can paste/upload one).
async function fetchAndStoreImage(ctx: any, imageUrl: string): Promise<{ storageId: any; url: string } | null> {
  try {
    const doFetch = (ua: string) => fetch(imageUrl, {
      headers: { "User-Agent": ua, "Accept": "image/avif,image/webp,image/*,*/*;q=0.8" },
    });
    let res = await doFetch(BROWSER_UA);
    if (!res.ok && (res.status === 403 || res.status === 429 || res.status === 451 || res.status === 503)) {
      res = await doFetch(GOOGLEBOT_UA);
    }
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct && ct.indexOf("image/") !== 0) return null;
    const blob = await res.blob();
    if (!blob || blob.size < 200 || blob.size > 8_000_000) return null; // skip tracking pixels / oversized
    const storageId = await ctx.storage.store(blob);
    const url = await ctx.storage.getUrl(storageId);
    if (!url) return null;
    return { storageId, url };
  } catch (e) {
    return null;
  }
}

// Best-effort: give an imported recipe a cover image from the page (JSON-LD image or
// og:image), downloaded + stored server-side. Sets imageStorageId + a stored preview url.
async function attachCoverImage(ctx: any, recipe: any, html: string): Promise<void> {
  let imgUrl: string | null = null;
  const fromRecipe = (recipe.imageUrl || "").trim();
  if (/^\/\//.test(fromRecipe)) imgUrl = "https:" + fromRecipe;
  else if (/^https?:\/\//i.test(fromRecipe)) imgUrl = fromRecipe;
  if (!imgUrl) imgUrl = ogImage(html, recipe.sourceUrl || "");
  if (!imgUrl) return;
  const stored = await fetchAndStoreImage(ctx, imgUrl);
  if (stored) { recipe.imageStorageId = stored.storageId; recipe.imageUrl = stored.url; }
}

export const importRecipeFromUrl = action({
  args: { url: v.string() },
  handler: async (ctx, args) => {
    const url = (args.url || "").trim();
    if (!/^https?:\/\//i.test(url)) {
      return { ok: false, error: "Please enter a full URL starting with http:// or https://" };
    }
    const fetched = await fetchPageHtml(url);
    if (fetched.error || !fetched.html) return { ok: false, error: fetched.error || "Could not reach that URL." };
    const html: string = fetched.html;

    // Primary: schema.org/Recipe JSON-LD.
    const blocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of blocks) {
      const json = block.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
      let parsed: any;
      try { parsed = JSON.parse(json); } catch (e) { continue; }
      const node = findRecipeNode(parsed);
      if (node) {
        const recipe = mapRecipe(node, url);
        if (recipe.ingredients.length || recipe.steps.length) {
          // JSON-LD gives the core recipe for free but no tips. Do a quick tips-only
          // AI pass on the article body so these imports get tips/variations/storage
          // too. Best-effort: if it fails or the key is missing, keep the free recipe.
          const apiKey = resolveApiKey();
          if (apiKey) {
            try { recipe.notes = await tipsOnlyExtract(htmlToText(html), apiKey); } catch (e) { /* keep core recipe */ }
          }
          await attachCoverImage(ctx, recipe, html);
          return { ok: true, method: "json-ld", recipe };
        }
      }
    }

    // Fallback: AI extraction (requires the key on this deployment).
    const apiKey = resolveApiKey();
    if (!apiKey) {
      return { ok: false, error: "No structured recipe data found on that page, and AI import isn't enabled yet (ANTHROPIC_API_KEY not set on this deployment)." };
    }
    try {
      const recipe = await aiExtract(htmlToText(html), url, apiKey);
      await attachCoverImage(ctx, recipe, html);
      return { ok: true, method: "ai", recipe };
    } catch (e: any) {
      return { ok: false, error: "AI import failed: " + (e.message || "unknown error") };
    }
  },
});

// ============ R4: PHOTO IMPORT (Claude vision) ============
// The client downscales a photo (recipe card / cookbook page) and sends the
// base64 here; Claude vision extracts the same structured fields as URL import,
// returned for review-before-save. Requires the deployment ANTHROPIC_API_KEY.
export const importRecipeFromPhoto = action({
  // Accepts a single photo (imageBase64) OR multiple page photos (imagesBase64).
  // Multiple pages of one book recipe are sent together and merged into one recipe.
  args: {
    imageBase64: v.optional(v.string()),
    imagesBase64: v.optional(v.array(v.string())),
    mediaType: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const apiKey = resolveApiKey();
    if (!apiKey) {
      return { ok: false, error: "AI photo import isn't enabled yet (ANTHROPIC_API_KEY not set on this deployment)." };
    }
    const pages = (args.imagesBase64 && args.imagesBase64.length)
      ? args.imagesBase64
      : (args.imageBase64 ? [args.imageBase64] : []);
    if (pages.length === 0) return { ok: false, error: "No image was provided." };
    const mediaType = args.mediaType || "image/jpeg";
    const multi = pages.length > 1;
    try {
      const content: any[] = pages.map((data) => ({
        type: "image", source: { type: "base64", media_type: mediaType, data },
      }));
      content.push({ type: "text", text: multi ? AI_PROMPT + "\n\n" + MULTIPAGE_PROMPT : AI_PROMPT });
      // Multi-page recipes produce longer output (more steps) — give them more room.
      const raw = await callClaude(apiKey, content, multi ? 4000 : 2000);
      const recipe = recipeFromAiText(raw, "photo", null);
      return { ok: true, method: "ai-vision", recipe, pages: pages.length };
    } catch (e: any) {
      return { ok: false, error: "Photo import failed: " + (e.message || "unknown error") };
    }
  },
});

// ============ NOTES IMPORT (text parse, R3/R4 sibling) ============
// Parse arbitrary note text into a recipe via Claude. Also CLASSIFIES — returns
// isRecipe:false for non-recipes (shopping lists, quotes, addresses) so the
// caller can skip them. Used to bulk-import macOS Notes recipes.
const NOTE_PROMPT = `Decide whether the following note is a cooking recipe, then respond with ONLY a JSON object (no markdown):
{"isRecipe": true|false, "title": string, "description": string, "ingredients": string[], "steps": string[], "servings": string, "prepMinutes": number|null, "cookMinutes": number|null, "tags": string[], "notes": string}
- If it is NOT a recipe (shopping list, address, phone number, quote, reminder, story), set "isRecipe": false and leave the other fields empty.
- title: the dish name (clean it up; don't include emoji). ingredients: one string per line e.g. "2 cups flour". steps: ordered, no leading numbers.
- notes: any extra info that isn't an ingredient or step — tips, variations, substitutions, storage/serving suggestions. Preserve as readable text; "" if none.
- Unknown text fields -> "", unknown minutes -> null, unknown arrays -> [].
Return the JSON object only.`;

export const importRecipeFromText = action({
  args: { text: v.string() },
  handler: async (_ctx, args) => {
    const apiKey = resolveApiKey();
    if (!apiKey) return { ok: false, error: "ANTHROPIC_API_KEY not set" };
    const text = (args.text || "").trim();
    if (!text) return { ok: false, error: "Empty note" };
    try {
      const raw = await callClaude(apiKey, NOTE_PROMPT + "\n\nNOTE:\n" + text.slice(0, 14000));
      const start = raw.indexOf("{"), end = raw.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("no JSON");
      const obj = JSON.parse(raw.slice(start, end + 1));
      if (!obj.isRecipe) return { ok: true, isRecipe: false };
      return {
        ok: true,
        isRecipe: true,
        recipe: {
          title: obj.title || "Untitled recipe",
          description: obj.description || "",
          ingredients: Array.isArray(obj.ingredients) ? obj.ingredients : [],
          steps: Array.isArray(obj.steps) ? obj.steps : [],
          servings: obj.servings || "",
          prepMinutes: typeof obj.prepMinutes === "number" ? obj.prepMinutes : null,
          cookMinutes: typeof obj.cookMinutes === "number" ? obj.cookMinutes : null,
          tags: Array.isArray(obj.tags) ? obj.tags : [],
          notes: typeof obj.notes === "string" ? obj.notes : "",
        },
      };
    } catch (e: any) {
      return { ok: false, error: "Parse failed: " + (e.message || "unknown") };
    }
  },
});
