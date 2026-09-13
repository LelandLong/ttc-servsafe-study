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

Current pages, in display order: `hos190-italy` (Italy Itinerary) · `hos190-map` (Route Map) · `hos190-florence` (Florence) · `hos190-trip-info` (Trip Essentials) · `hos190-video-hub` (Video Hub) · `hos190-photos` (Photo Gallery).

> Ordering is an explicit `order` field, set with `privatePages:setOrder` — **not** alphabetical by slug, and
> changing it does **not** re-publish the page, so repositioning never bumps a page's "info last revised" stamp.
> A page pushed without an order can float to the top; set it in the same session you push.

## Trip media pages (Video Hub, Photo Gallery)

Both live **only** in Convex, behind the login, like every Class Page. Sources are gitignored:
`private/video-hub.html` (its entries in `private/video-hub.json`) and `private/photos.html`.
Media sits on the drive under `/Volumes/Andromeda/Screenflow/Italy/`; originals are never modified.

| Media | Steps (all in `scripts/`) |
|---|---|
| Photos | `convert-stills` → `sort-stills` (Leland) → `upload-stills` → `build-gallery-data` |
| Video | `transcode-videos` → upload in YouTube Studio (Leland) → `link-videos` → `describe-videos` (Leland) → `build-hub-data` |
| Audio | `upload-audio` → `transcribe-audio` → `trim-audio` → context reconciliation (Claude, below) → `build-transcripts` → `build-hub-data` |

Then publish with `push-private-page.mjs`.

**Context-reconciled transcripts (2026-09-12).** The recordings are too quiet for any single machine
transcription (the guide is ~5 dB above the room). So each tour is transcribed three ways on the
*published* audio — Whisper large-v3-turbo, large-v3, and turbo on pause-split clips — and Claude reads the
three side by side and writes `_transcripts/<name>.ctx.json`, choosing what makes sense on the tour ("opera
art" → "opera house"). `{braces}` mark a best guess from context and render in italics; `[unclear]` stays
where no reading made sense. `build-transcripts` uses the `.ctx.json` whenever it exists. Leland's call:
live transcripts may be improved this way without a preview.

**Page upkeep.** Both pages open with a *Recently added* block of **text lines** (date + count; a tap jumps
to those items) — thumbnails there read as extra players and confused students. The Photo Gallery shows
each section as one row with an explicit "Showing the newest 3 of 112" and a Show-all button, and carries
`VIDEOS_SOON` — the days whose videos are not in the Video Hub yet. **Remove a day from that list when its
videos go up**; an empty list hides the line.

**Vertical videos (Shorts, and any portrait clip).** `link-videos` sets `"vertical": true` automatically when the
file is taller than wide *as displayed* (iPhone portrait .MOVs are stored landscape with a rotation tag —
`isVertical()` in `scripts/lib/media.mjs` accounts for it). For a hand-added entry (a Short), set it yourself. The
hub then plays it in a 9:16 player sized to the screen instead of the 16:9 slot (first use: *Class picture
time with Blake*, 2026-09-12). Vertical *photos* need nothing: the viewer already fits any shape whole.
Shorts open **without autoplay**: in iOS Safari (tested in the Simulator, real Mobile Safari) the Shorts
player stays black indefinitely after iOS blocks autoplay-with-sound, while the normal player falls back to its
poster. With autoplay off, students see the thumbnail and tap play once. Both players show a "Loading the
video…" note until the frame has drawn: YouTube paints black for several seconds on a phone.

> 🛑 **Never commit a rendered copy of these pages.** A public "design preview" of each lived in
> `design/` until 2026-09-11. Its guard stripped Convex media URLs but not YouTube ids, so **six unlisted
> video ids were public for about 16 hours**. It was removed rather than patched again. Leland's call on the
> exposure (2026-09-11): leave it. The trip is covered by signed disclosures for images, video and audio, so
> nothing was re-uploaded or set Private. The pages carry
> media URLs, video ids and transcripts of other people's speech, and none of that belongs in this
> public repo.
>
> No footer on these two pages (Leland, 2026-09-11). The source is the recordings themselves, and the
> app's banner already shows when a page was last revised.

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

## Who can write (added 08-22)

Reading and writing are gated **separately**. Read = `isProf || privateAccess` (and new accounts now
get `privateAccess` automatically, so students see the pages without a manual grant). **Write =
the curator account only**, identified by the `CURATOR_USER_ID` Convex environment variable:

```bash
npx convex env set CURATOR_USER_ID <userId> --prod   # the account push-private-page.mjs runs as
```

It **fails closed** — if the variable is unset, nobody can write, including the push script.

⚠️ **Do not "simplify" this back to a users-table flag.** `users:setAdminAccess`, `setPrivateAccess`
and `toggleProf` check only that the target exists, never who is calling (they back admin.html's
checkboxes, and that page has no sign-in), and `users:getAllStudents` is open so every userId is
enumerable. Any flag-based write gate is self-grantable in one extra API call. An environment
variable is not reachable from a client.

## Security honesty
The gate is the server-side flag check keyed on your Convex userId, which functions as a bearer token.
That comfortably beats "public URL" (the stated goal: keep casual eyes and crawlers out) but is not
bank-grade: anyone who obtains an authorized userId could read the pages, and the admin page itself remains
an ungated static URL (the Admin button is a convenience link, not a lock). Do not store secrets beyond
itinerary-level.
