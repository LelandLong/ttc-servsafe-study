import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Staff gate for the professor dashboard (admin.html).
//
// "Staff" = a professor account (isProf) OR the curator account (adminAccess).
// This deliberately matches the predicate index.html already uses to decide
// whether to show the Admin link, so the same accounts that see the link are
// the ones the server accepts. Note the curator account (rerun) has
// isProf: false / adminAccess: true — gating on isProf alone would lock the
// owner out of his own dashboard.
//
// WHY THIS EXISTS: admin.html is a public URL on GitHub Pages with no sign-in,
// and every mutation behind it used to verify only that the TARGET row existed,
// never who was calling. Anyone who opened the page — or called the HTTP API
// directly, which needs no page at all — could delete questions, wipe a course's
// question bank via resetToOriginal, reset a student's progress, or grant
// themselves professor rights. The client-side login added alongside this is a
// convenience; THIS function is the actual control.
export async function requireStaff(
  ctx: QueryCtx | MutationCtx,
  actorUserId: Id<"users">
) {
  const actor = await ctx.db.get(actorUserId);
  if (!actor || !(actor.isProf === true || actor.adminAccess === true)) {
    throw new Error("Not authorized: a professor or admin account is required");
  }
  return actor;
}
