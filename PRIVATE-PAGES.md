# Private Pages (professor-gated)

**The problem:** this repo is PUBLIC and deploys to GitHub Pages — anything committed here is world-readable.
**The solution:** private content (the HOS-190 Italy itinerary, etc.) lives ONLY in Convex. The app queries
`privatePages:get` with the signed-in userId; the server returns content only if that user has `isProf`.
A 🇮🇹 HOS-190 button appears top-right for authorized users and opens the page in a full-screen viewer.

## Publishing / updating a page
1. Put the HTML file in `private/` (gitignored — never commit it).
2. Get your userId: in the app, DevTools → `localStorage.chefKitchenUser`.
3. `CK_USER_ID=<your-userId> node scripts/push-private-page.mjs hos190-italy private/itinerary.html`
4. Deploy Convex if schema changed: `npx convex deploy --yes`

## Security honesty
The gate is the server-side isProf check keyed on your Convex userId, which functions as a bearer token.
That comfortably beats "public URL" (the stated goal: keep casual eyes and crawlers out) but is not
bank-grade: anyone who obtains your userId could read the pages. Do not store secrets beyond itinerary-level.
