import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Private pages (e.g. the HOS-190 Italy itinerary).
// Content lives ONLY in Convex — never in this public repo.
//
// READ and WRITE are gated SEPARATELY on purpose (2026-08-22).
// These pages are reference material: students read them, nobody fills anything
// in, and no UI anywhere writes them — `index.html` only calls list/get, and
// `admin.html` does not touch them at all. The sole writer in the codebase is
// `scripts/push-private-page.mjs`, run from a terminal.
// But a Convex mutation is a public HTTP endpoint whether or not a button
// exists for it, so the gate is the only thing standing in front of `set`.
// Since new accounts now default to privateAccess (see users.ts `register`),
// read access is handed out automatically — so write must NOT ride on it, or
// anyone who registers on the public app could overwrite the itinerary and the
// emergency-contact page.

// READ: students, family accounts, professors — anyone granted page access.
function canAccess(user: { isProf?: boolean; privateAccess?: boolean } | null) {
  return !!user && (user.isProf === true || user.privateAccess === true);
}

// WRITE: staff only. adminAccess is the curator (the push script runs as this
// account); isProf is the professor role. privateAccess deliberately does NOT
// grant write.
function canWrite(user: { isProf?: boolean; adminAccess?: boolean } | null) {
  return !!user && (user.isProf === true || user.adminAccess === true);
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
      // When the CONTENT was last revised. The client shows this ("info dated…")
      // alongside when THIS DEVICE last synced, so a student reading an offline
      // copy can tell how old it is. Additive on purpose: `get` still returns a
      // bare html string, so shells cached before this change keep working.
      updatedAt: p.updatedAt,
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
    if (!canWrite(user)) throw new Error("Not authorized");
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
