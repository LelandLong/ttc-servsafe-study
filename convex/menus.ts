import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ============ MEAL PLANNING: menus + grocery state ============
// A menu is a named meal the user is planning, holding a set of recipe ids. The
// combined grocery list is computed client-side from the menu's recipes' ingredients;
// the server stores only per-item state (have / checked-off / personal note).

// Lightweight recipe shape the menu screens need (title, cover, servings, ingredients).
async function publicMenuRecipe(ctx: any, recipe: any) {
  const ids = recipe.imageIds || [];
  const urls = await Promise.all(ids.map((id: any) => ctx.storage.getUrl(id)));
  return {
    _id: recipe._id,
    title: recipe.title,
    servings: recipe.servings || "",
    ingredients: recipe.ingredients || [],
    imageUrl: urls.filter((u: any) => u)[0] || null,
    isGlobal: recipe.scope === "global",
  };
}

export const createMenu = mutation({
  args: { ownerId: v.id("users"), name: v.optional(v.string()), recipeId: v.optional(v.id("recipes")) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const menuId = await ctx.db.insert("menus", {
      ownerId: args.ownerId,
      name: (args.name && args.name.trim()) || "New menu",
      recipeIds: args.recipeId ? [args.recipeId] : [],
      createdAt: now,
      updatedAt: now,
    });
    return { menuId };
  },
});

// All the user's menus (newest first) with a recipe count + cover thumbnail.
export const getMyMenus = query({
  args: { ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const menus = await ctx.db
      .query("menus")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();
    menus.sort((a, b) => b.updatedAt - a.updatedAt);
    return await Promise.all(menus.map(async (m) => {
      let cover: string | null = null;
      for (const rid of m.recipeIds) {
        const r: any = await ctx.db.get(rid);
        if (r && r.imageIds && r.imageIds.length) {
          cover = await ctx.storage.getUrl(r.imageIds[0]);
          if (cover) break;
        }
      }
      return { ...m, recipeCount: m.recipeIds.length, cover };
    }));
  },
});

// One menu with its recipes resolved (for the menu-detail + grocery screens).
export const getMenu = query({
  args: { menuId: v.id("menus"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.ownerId !== args.ownerId) return null;
    const recipes: any[] = [];
    for (const rid of menu.recipeIds) {
      const r = await ctx.db.get(rid);
      if (r) recipes.push(await publicMenuRecipe(ctx, r));
    }
    return { ...menu, recipes };
  },
});

export const updateMenu = mutation({
  args: {
    menuId: v.id("menus"),
    ownerId: v.id("users"),
    name: v.optional(v.string()),
    servings: v.optional(v.number()),
    plannedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.ownerId !== args.ownerId) throw new Error("Menu not found");
    const { menuId, ownerId, ...rest } = args;
    const updates: Record<string, any> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(rest)) if (val !== undefined) updates[k] = val;
    if (typeof updates.name === "string") updates.name = updates.name.trim() || "Untitled menu";
    await ctx.db.patch(menuId, updates);
    return { ok: true };
  },
});

export const addRecipeToMenu = mutation({
  args: { menuId: v.id("menus"), ownerId: v.id("users"), recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.ownerId !== args.ownerId) throw new Error("Menu not found");
    if (menu.recipeIds.indexOf(args.recipeId) === -1) {
      await ctx.db.patch(args.menuId, { recipeIds: [...menu.recipeIds, args.recipeId], updatedAt: Date.now() });
    }
    return { ok: true };
  },
});

export const removeRecipeFromMenu = mutation({
  args: { menuId: v.id("menus"), ownerId: v.id("users"), recipeId: v.id("recipes") },
  handler: async (ctx, args) => {
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.ownerId !== args.ownerId) throw new Error("Menu not found");
    await ctx.db.patch(args.menuId, {
      recipeIds: menu.recipeIds.filter((r: any) => r !== args.recipeId),
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

export const deleteMenu = mutation({
  args: { menuId: v.id("menus"), ownerId: v.id("users") },
  handler: async (ctx, args) => {
    const menu = await ctx.db.get(args.menuId);
    if (!menu || menu.ownerId !== args.ownerId) throw new Error("Menu not found");
    const gs = await ctx.db
      .query("groceryItems")
      .withIndex("by_list", (q) => q.eq("listKey", "menu:" + args.menuId))
      .collect();
    for (const g of gs) await ctx.db.delete(g._id);
    await ctx.db.delete(args.menuId);
    return { ok: true };
  },
});

// ----- Grocery item state (have / checked-off / note), keyed by list + item -----
export const getGroceryState = query({
  args: { ownerId: v.id("users"), listKey: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("groceryItems")
      .withIndex("by_list", (q) => q.eq("listKey", args.listKey))
      .collect();
    return rows
      .filter((r) => r.ownerId === args.ownerId)
      .map((r) => ({ itemKey: r.itemKey, have: !!r.have, checkedOff: !!r.checkedOff, note: r.note || "" }));
  },
});

export const setGroceryItem = mutation({
  args: {
    ownerId: v.id("users"),
    listKey: v.string(),
    itemKey: v.string(),
    have: v.optional(v.boolean()),
    checkedOff: v.optional(v.boolean()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("groceryItems")
      .withIndex("by_list_item", (q) => q.eq("listKey", args.listKey).eq("itemKey", args.itemKey))
      .first();
    if (existing) {
      const patch: Record<string, any> = { updatedAt: Date.now() };
      if (args.have !== undefined) patch.have = args.have;
      if (args.checkedOff !== undefined) patch.checkedOff = args.checkedOff;
      if (args.note !== undefined) patch.note = args.note;
      await ctx.db.patch(existing._id, patch);
      return { ok: true };
    }
    await ctx.db.insert("groceryItems", {
      ownerId: args.ownerId,
      listKey: args.listKey,
      itemKey: args.itemKey,
      have: !!args.have,
      checkedOff: !!args.checkedOff,
      note: args.note || "",
      updatedAt: Date.now(),
    });
    return { ok: true };
  },
});

// Reset all in-store check-offs for a list (start a fresh shopping run).
export const clearGroceryChecks = mutation({
  args: { ownerId: v.id("users"), listKey: v.string() },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("groceryItems")
      .withIndex("by_list", (q) => q.eq("listKey", args.listKey))
      .collect();
    for (const r of rows) {
      if (r.ownerId === args.ownerId && r.checkedOff) {
        await ctx.db.patch(r._id, { checkedOff: false, updatedAt: Date.now() });
      }
    }
    return { ok: true };
  },
});
