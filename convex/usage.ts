import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireStaff } from "./staffAuth";

// Who has been using the app over a window - backs admin.html's Usage tab.
// Staff only: it returns real first names, so it sits behind requireStaff like
// users:getAllStudents.
//
// Three signals, because no single one sees everyone:
//   - users.createdAt       new accounts (e.g. students arriving by a QR code)
//   - users.lastActiveAt    anyone who signed in or synced progress
//   - mediaViews (by `at`)  page opens and photo/video/audio/transcript plays on
//                           the Italy media pages, by DEVICE time - an event
//                           queued offline still lands in the window it happened in
// Visitors who never create an account leave no trace here (GitHub Pages keeps
// no logs we can read) - the tab says so.
const PLAYED = new Set(["video", "audio", "transcript"]);
const MAX_PLAYED = 30;

export const report = query({
  args: { actorUserId: v.id("users"), sinceMs: v.number() },
  handler: async (ctx, args) => {
    await requireStaff(ctx, args.actorUserId);
    const since = args.sinceMs;

    const users = await ctx.db.query("users").collect();
    const byId = new Map(users.map((u) => [String(u._id), u]));
    const who = (u: any) => ({
      userId: String(u._id),
      name: u.displayName || u.gamerName,
      firstName: u.firstName,
      staff: u.isProf === true || u.adminAccess === true,
    });

    const newAccounts = users
      .filter((u) => u.createdAt >= since)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((u) => ({ ...who(u), at: u.createdAt }));
    const active = users
      .filter((u) => u.lastActiveAt >= since)
      .sort((a, b) => b.lastActiveAt - a.lastActiveAt)
      .map((u) => ({ ...who(u), at: u.lastActiveAt }));

    // The by_at index keeps this a range read, not a table scan, as the table grows.
    const views = await ctx.db
      .query("mediaViews")
      .withIndex("by_at", (q) => q.gte("at", since))
      .collect();

    const people: Record<string, any> = {};
    for (const r of views) {
      const key = String(r.userId);
      const u = byId.get(key);
      const p = (people[key] = people[key] || {
        ...(u ? who(u) : { userId: key, name: r.gamerName, firstName: "", staff: false }),
        total: 0, page: 0, photo: 0, video: 0, audio: 0, transcript: 0,
        first: r.at, last: r.at, played: [] as { kind: string; label: string; at: number }[],
      });
      p.total++;
      if (p[r.kind] !== undefined) p[r.kind]++;
      if (r.at < p.first) p.first = r.at;
      if (r.at > p.last) p.last = r.at;
      if (PLAYED.has(r.kind) && p.played.length < MAX_PLAYED) {
        p.played.push({ kind: r.kind, label: r.label || r.itemId || "", at: r.at });
      }
    }
    const mediaPeople = Object.values(people).sort((a: any, b: any) => b.last - a.last);
    for (const p of mediaPeople as any[]) p.played.sort((a: any, b: any) => a.at - b.at);

    return {
      now: Date.now(),
      since,
      totalAccounts: users.length,
      newAccounts,
      active,
      media: { events: views.length, people: mediaPeople },
    };
  },
});
