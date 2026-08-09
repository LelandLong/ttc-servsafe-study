import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Private pages (e.g. the HOS-190 Italy itinerary).
// Content lives ONLY in Convex — never in this public repo.
// All endpoints verify the calling userId belongs to a user with isProf
// OR privateAccess (page access without professor/admin rights).

function canAccess(user: { isProf?: boolean; privateAccess?: boolean } | null) {
  return !!user && (user.isProf === true || user.privateAccess === true);
}

// List the pages the caller may see — metadata only, no html (kept light for the home screen)
export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!canAccess(user)) return [];
    const pages = await ctx.db.query("privatePages").collect();
    pages.sort((a, b) => a.slug.localeCompare(b.slug));
    return pages.map((p) => ({
      slug: p.slug,
      title: p.title || p.slug,
      icon: p.icon || "🔒",
      blurb: p.blurb || "",
    }));
  },
});

export const get = query({
  args: { userId: v.id("users"), slug: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!canAccess(user)) return null;
    const page = await ctx.db
      .query("privatePages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    return page ? page.html : null;
  },
});

export const set = mutation({
  args: {
    userId: v.id("users"),
    slug: v.string(),
    html: v.string(),
    title: v.optional(v.string()),
    icon: v.optional(v.string()),
    blurb: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!canAccess(user)) throw new Error("Not authorized");
    const existing = await ctx.db
      .query("privatePages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    const fields = {
      html: args.html,
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.icon !== undefined ? { icon: args.icon } : {}),
      ...(args.blurb !== undefined ? { blurb: args.blurb } : {}),
      updatedAt: Date.now(),
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
    } else {
      await ctx.db.insert("privatePages", { slug: args.slug, ...fields });
    }
    return { ok: true };
  },
});
