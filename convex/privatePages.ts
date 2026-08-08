import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Professor-gated private pages (e.g. the HOS-190 Italy itinerary).
// Content lives ONLY in Convex — never in this public repo.
// Both endpoints verify the calling userId belongs to a user with isProf.

export const get = query({
  args: { userId: v.id("users"), slug: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.isProf) return null;
    const page = await ctx.db
      .query("privatePages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return page ? page.html : null;
  },
});

export const set = mutation({
  args: { userId: v.id("users"), slug: v.string(), html: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.isProf) throw new Error("Not authorized");
    const existing = await ctx.db
      .query("privatePages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { html: args.html, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("privatePages", { slug: args.slug, html: args.html, updatedAt: Date.now() });
    }
    return { ok: true };
  },
});
