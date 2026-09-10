import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./staffAuth";

// View tracking for the Italy media pages.
//
// SHAPE: a view is an EVENT, not a state. Append-only means an offline device can
// replay its queue verbatim on reconnect with nothing to merge and no conflicts.
// Each row carries BOTH `at` (when it happened on the device) and `syncedAt`
// (when it arrived) - the gap between them is the offline period, which is
// information worth keeping rather than flattening.
//
// COST: writes arrive in BATCHES, one mutation per flush. This deployment is
// already tight on Database I/O; a gallery of 226 thumbnails must never become
// 226 mutations.

const MAX_BATCH = 200;

// Anyone who can READ the pages may record their own views. Deliberately not
// curator-gated: students are the point of the exercise.
export const record = mutation({
  args: {
    userId: v.id("users"),
    events: v.array(v.object({
      slug: v.string(),
      kind: v.string(),
      itemId: v.optional(v.string()),
      label: v.optional(v.string()),
      at: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("Unknown user");
    // Same test the pages themselves use - no access, no tracking.
    const allowed = (user as any).isProf === true || (user as any).privateAccess === true;
    if (!allowed) return { written: 0 };

    const now = Date.now();
    // Cap the batch so a broken or hostile client cannot write unbounded rows in
    // one call. The client flushes in chunks, so a legitimate queue is never lost.
    const batch = args.events.slice(0, MAX_BATCH);
    for (const e of batch) {
      await ctx.db.insert("mediaViews", {
        userId: args.userId,
        gamerName: (user as any).gamerName || "",
        slug: e.slug,
        kind: e.kind,
        itemId: e.itemId,
        label: e.label,
        at: e.at,
        syncedAt: now,
      });
    }
    return { written: batch.length, dropped: Math.max(0, args.events.length - batch.length) };
  },
});

// Staff-only reporting. Returns per-person and per-item rollups rather than raw
// rows, so the caller does not page through thousands of events to answer
// "who is using this, and what are they looking at".
export const summary = query({
  args: { actorUserId: v.id("users"), slug: v.optional(v.string()), sinceDays: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorUserId);
    const cutoff = args.sinceDays ? Date.now() - args.sinceDays * 86400000 : 0;

    let rows = args.slug
      ? await ctx.db.query("mediaViews").withIndex("by_slug", (q) => q.eq("slug", args.slug!)).collect()
      : await ctx.db.query("mediaViews").collect();
    if (cutoff) rows = rows.filter((r) => r.at >= cutoff);

    const byPerson: Record<string, { gamerName: string; views: number; pageOpens: number; items: number; last: number }> = {};
    const byItem: Record<string, { label: string; slug: string; views: number; viewers: Set<string> }> = {};

    for (const r of rows) {
      const p = (byPerson[r.userId] = byPerson[r.userId] || {
        gamerName: r.gamerName, views: 0, pageOpens: 0, items: 0, last: 0,
      });
      p.views++;
      if (r.kind === "page") p.pageOpens++; else p.items++;
      if (r.at > p.last) p.last = r.at;

      if (r.itemId) {
        const key = r.slug + "/" + r.itemId;
        const it = (byItem[key] = byItem[key] || { label: r.label || r.itemId, slug: r.slug, views: 0, viewers: new Set() });
        it.views++;
        it.viewers.add(String(r.userId));
      }
    }

    return {
      totalEvents: rows.length,
      people: Object.entries(byPerson)
        .map(([userId, p]) => ({ userId, ...p }))
        .sort((a, b) => b.views - a.views),
      topItems: Object.values(byItem)
        .map((i) => ({ label: i.label, slug: i.slug, views: i.views, viewers: i.viewers.size }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 50),
    };
  },
});

// Maintenance: delete view events recorded before a cutoff. Staff only.
// Exists because test rows and a real report share one table - and because
// "clear the last N minutes" is the safe shape: it cannot be aimed at a person,
// and it cannot wipe the table by accident the way a bare purge could.
export const purgeBefore = mutation({
  args: { actorUserId: v.id("users"), beforeMs: v.number() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorUserId);
    const rows = await ctx.db.query("mediaViews").collect();
    let deleted = 0;
    for (const r of rows) {
      if (r.syncedAt < args.beforeMs) { await ctx.db.delete(r._id); deleted++; }
    }
    return { deleted, remaining: rows.length - deleted };
  },
});
