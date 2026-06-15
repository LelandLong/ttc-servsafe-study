import { mutation, query } from "./_generated/server";
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
  imageIds: v.optional(v.array(v.id("_storage"))),
  sourceType: v.optional(v.string()), // "manual" | "url" | "photo"
  sourceUrl: v.optional(v.string()),
  prepMinutes: v.optional(v.number()),
  cookMinutes: v.optional(v.number()),
  servings: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  pickyFlags: v.optional(v.array(v.string())),
};

// Decorate a recipe with resolved image URLs plus its rating summary
// (avgScore + scoreCount) so list/detail views need no extra round-trips.
async function decorateRecipe(ctx: any, recipe: any) {
  const ids = recipe.imageIds || [];
  const imageUrls = await Promise.all(
    ids.map((id: any) => ctx.storage.getUrl(id))
  );

  const scores = await ctx.db
    .query("recipeScores")
    .withIndex("by_recipe", (q: any) => q.eq("recipeId", recipe._id))
    .collect();
  const scoreCount = scores.length;
  const avgScore = scoreCount > 0
    ? Math.round((scores.reduce((sum: number, s: any) => sum + s.score, 0) / scoreCount) * 10) / 10
    : null;

  return {
    ...recipe,
    imageUrls: imageUrls.filter((u: any) => u !== null),
    avgScore,
    scoreCount,
  };
}

// List all recipes owned by a user (newest first), each with resolved image URLs.
export const getMyRecipes = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipes = await ctx.db
      .query("recipes")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    recipes.sort((a, b) => b.updatedAt - a.updatedAt);

    return await Promise.all(recipes.map((r) => decorateRecipe(ctx, r)));
  },
});

// Get a single recipe (with image URLs). Returns null if missing or not owned.
export const getRecipe = query({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || recipe.ownerId !== args.ownerId) return null;
    return await decorateRecipe(ctx, recipe);
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
    if (recipe.ownerId !== args.ownerId) {
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

// List all scores for a recipe the user owns (newest first).
export const getScores = query({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || recipe.ownerId !== args.ownerId) return [];
    const scores = await ctx.db
      .query("recipeScores")
      .withIndex("by_recipe", (q) => q.eq("recipeId", args.recipeId))
      .collect();
    scores.sort((a, b) => b.createdAt - a.createdAt);
    return scores;
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
