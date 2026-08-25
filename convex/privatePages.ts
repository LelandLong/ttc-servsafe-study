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

// WRITE: the curator account only, identified by a Convex environment variable.
//
// ⚠️ It deliberately does NOT key on any users-table flag. EVERY flag on that
// table is settable by an unauthenticated public mutation — `users:setAdminAccess`,
// `users:setPrivateAccess` and `users:toggleProf` check that the TARGET exists
// but never who is calling, because they back the admin dashboard's checkboxes
// and `admin.html` has no sign-in. `users:getAllStudents` is likewise open, so
// every userId is enumerable. A flag-based write gate is therefore self-grantable
// in one extra API call: register → setAdminAccess(self) → set.
// An environment variable is not reachable from any client.
//
// Fails CLOSED: if CURATOR_USER_ID is unset, nobody can write (including the
// push script) rather than everybody. Set it with:
//   npx convex env set CURATOR_USER_ID <userId> --prod
function isCurator(user: { _id: unknown } | null) {
  const curator = process.env.CURATOR_USER_ID;
  return !!curator && !!user && String(user._id) === curator;
}

// List the pages the caller may see — metadata only, no html (kept light for the home screen)
export const list = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!canAccess(user)) return [];
    const pages = await ctx.db.query("privatePages").collect();
    // Explicit display order first (unset sorts last), then alphabetical by slug
    // as a stable tiebreak. Alphabetical alone put Florence above the itinerary.
    pages.sort((a, b) => {
      const ao = a.order ?? 999;
      const bo = b.order ?? 999;
      if (ao !== bo) return ao - bo;
      return a.slug.localeCompare(b.slug);
    });
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

// Reposition a page on the home screen WITHOUT touching its html or updatedAt —
// re-pushing content just to reorder would bump every page's "info last revised"
// stamp and tell students the content changed when it did not.
export const setOrder = mutation({
  args: {
    userId: v.id("users"),
    slug: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!isCurator(user)) throw new Error("Not authorized");
    const page = await ctx.db
      .query("privatePages")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!page) throw new Error("No such page");
    await ctx.db.patch(page._id, { order: args.order });
    return { slug: args.slug, order: args.order };
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
    if (!isCurator(user)) throw new Error("Not authorized");
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
