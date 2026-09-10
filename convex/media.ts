import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Trip media (HOS-190 photo gallery) stored in Convex file storage.
//
// WRITE IS CURATOR-ONLY, by the same rule and the same mechanism as privatePages:
// the curator is identified by the CURATOR_USER_ID environment variable, which is
// not reachable from any client, and it FAILS CLOSED when unset.
//
// ⚠️ Deliberately NOT reusing recipes:generateUploadUrl. That one accepts any
// ownerId and only checks the user EXISTS — so any registered account can request
// an upload slot and write arbitrary files into this deployment's storage. That is
// a pre-existing weakness in the recipes path, tracked separately; it is not one
// this gallery should inherit.
//
//   npx convex env set CURATOR_USER_ID <userId> --prod
function isCurator(user: { _id: unknown } | null) {
  const curator = process.env.CURATOR_USER_ID;
  return !!curator && !!user && String(user._id) === curator;
}

// Hand out a short-lived upload URL. Curator only.
export const generateUploadUrl = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!isCurator(user)) throw new Error("Not authorized to upload media");
    return await ctx.storage.generateUploadUrl();
  },
});

// Resolve stored files to servable URLs, in one call rather than one per file.
// Curator only: these URLs are the gallery's contents before it is published.
export const urlsFor = query({
  args: { userId: v.id("users"), storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!isCurator(user)) return [];
    return await Promise.all(
      args.storageIds.map(async (id) => ({ storageId: id, url: await ctx.storage.getUrl(id) }))
    );
  },
});

// Remove a stored file. Curator only. Used when a photo is replaced or withdrawn.
export const remove = mutation({
  args: { userId: v.id("users"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!isCurator(user)) throw new Error("Not authorized");
    await ctx.storage.delete(args.storageId);
    return { ok: true };
  },
});
