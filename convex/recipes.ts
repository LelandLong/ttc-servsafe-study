import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ============ RECIPES — Phase R1 CRUD (per-user library) ============
// See RECIPES-PLAN.md. All operations are scoped to an owner (the user id the
// client passes in), matching the existing explicit-userId pattern used in
// users.ts / tests.ts (there is no server-side auth context in this app).

// Shared field validators for create/update.
const recipeFields = {
  title: v.string(),
  description: v.optional(v.string()),
  ingredients: v.array(v.string()),
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

// Resolve signed URLs for a recipe's stored images so the client can render them.
async function withImageUrls(ctx: any, recipe: any) {
  const ids = recipe.imageIds || [];
  const imageUrls = await Promise.all(
    ids.map((id: any) => ctx.storage.getUrl(id))
  );
  return { ...recipe, imageUrls: imageUrls.filter((u: any) => u !== null) };
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

    return await Promise.all(recipes.map((r) => withImageUrls(ctx, r)));
  },
});

// Get a single recipe (with image URLs). Returns null if missing or not owned.
export const getRecipe = query({
  args: { recipeId: v.id("recipes"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const recipe = await ctx.db.get(args.recipeId);
    if (!recipe || recipe.ownerId !== args.ownerId) return null;
    return await withImageUrls(ctx, recipe);
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

    const now = Date.now();
    const recipeId = await ctx.db.insert("recipes", {
      ownerId,
      ...fields,
      title: fields.title.trim(),
      sourceType: fields.sourceType || "manual",
      createdAt: now,
      updatedAt: now,
    });

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
    ingredients: v.optional(v.array(v.string())),
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
    updates.updatedAt = Date.now();

    await ctx.db.patch(recipeId, updates);
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
