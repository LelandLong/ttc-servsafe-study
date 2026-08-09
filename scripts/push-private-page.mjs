// Upload a private page into Convex (gated by isProf/privateAccess).
// Usage: node scripts/push-private-page.mjs <slug> <file.html> [title] [icon] [blurb]
// Requires: CK_USER_ID env var = your Convex userId (from the app: localStorage.chefKitchenUser)
const CONVEX_URL = "https://cautious-monitor-526.convex.cloud";
import { readFileSync } from "fs";
const [slug, file, title, icon, blurb] = process.argv.slice(2);
const userId = process.env.CK_USER_ID;
if (!slug || !file || !userId) {
  console.error("Usage: CK_USER_ID=<id> node scripts/push-private-page.mjs <slug> <file.html> [title] [icon] [blurb]");
  process.exit(1);
}
const html = readFileSync(file, "utf8");
const args = { userId, slug, html };
if (title) args.title = title;
if (icon) args.icon = icon;
if (blurb) args.blurb = blurb;
const res = await fetch(CONVEX_URL + "/api/mutation", {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ path: "privatePages:set", args, format: "json" }),
});
console.log(await res.json());
