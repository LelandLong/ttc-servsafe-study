# Private Pages (access-gated)

**The problem:** this repo is PUBLIC and deploys to GitHub Pages — anything committed here is world-readable.
**The solution:** private content (the HOS-190 Italy itinerary, trip essentials, etc.) lives ONLY in Convex.
The app calls `privatePages:list` with the signed-in userId; for authorized users the server returns each
page's button metadata (title/icon/blurb), which render as mode-cards in a "🔓 Class Pages" section on the
home screen. Tapping one fetches `privatePages:get` and opens it in a full-screen viewer. Unauthorized users
get an empty list and see nothing.

## Access flags (all set from the admin page, student detail modal)

- `isProf` — professor account: admin tools, excluded from class stats. Sees private pages and the Admin button.
- `privateAccess` — "🇮🇹 Class Pages access" checkbox: sees/publishes private pages ONLY. No admin rights,
  still counted in class stats. Use for students/family who should see HOS-190 material.
- `adminAccess` — "🛠️ Admin link" checkbox: shows the Admin-page button (top-left of the launch screen)
  without marking the account a professor.

CLI alternative (authenticated Convex CLI — not callable from the public API):

```bash
npx convex run users:grantPrivateAccess '{"gamerName":"rerun","grant":true}' --prod
```

## Publishing / updating a page
1. Put the HTML file in `private/` (gitignored — never commit it).
2. Get your userId: in the app, DevTools → `localStorage.chefKitchenUser`.
3. `CK_USER_ID=<your-userId> node scripts/push-private-page.mjs <slug> private/<file>.html "<Title>" "<emoji>" "<blurb>"`
4. Deploy Convex if schema changed: `npx convex deploy --yes`

Current pages: `hos190-italy` (Italy Itinerary) · `hos190-map` (Route Map) · `hos190-trip-info` (Trip Essentials).

## Offline behaviour (added 08-11)
The app shell works offline via `sw.js` (see CHANGELOG 08-11-2026-1). Private pages are additionally
**prefetched into localStorage on every successful load** — no tap needed — and served from that cache
when the network is gone, so Trip Essentials' emergency numbers work in airplane mode. The cache is
per-user, refreshed on every online visit, cleared on sign-out and on access revocation. Requirement:
one online visit after each content push for devices to pick up new page bodies.

**Freshness stamps (added 08-19) — the reader can always tell how old the page is.** A cached page used
to be indistinguishable from a live one, which is a real hazard for time-sensitive trip info (hotel,
phone number) read abroad with no signal. Now every page carries a banner in the overlay chrome:
up-to-date (green) when it came from the network, **OFFLINE COPY + the date this device saved it**
(amber) when served from cache — both showing when the CONTENT was last revised, from `privatePages:list`'s
`updatedAt`. The home card shows "Info as of &lt;date&gt;" before opening. Two dates, because only the pair
answers "am I looking at current information?"

⚠️ **`privatePages:get` deliberately still returns a bare HTML string.** Changing its shape would break
every app shell already cached on a student's device — freshness metadata rides on `list` instead, which
is additive and safe. Keep it that way.

📌 **Content convention (Leland, 08-19):** each page's footer names the exact source file(s) its data came
from plus the update date, so "which revision is this?" is answered by the page. Update it on every push.

**Gotcha:** pages render inside a `srcdoc` iframe, where `#anchor` hrefs resolve against the PARENT app URL
and navigate away. Any page using in-page anchors needs the small click-intercept script (see the existing
pages) that calls `scrollIntoView` instead.

## Security honesty
The gate is the server-side flag check keyed on your Convex userId, which functions as a bearer token.
That comfortably beats "public URL" (the stated goal: keep casual eyes and crawlers out) but is not
bank-grade: anyone who obtains an authorized userId could read the pages, and the admin page itself remains
an ungated static URL (the Admin button is a convenience link, not a lock). Do not store secrets beyond
itinerary-level.
