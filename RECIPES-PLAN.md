# Chef's Kitchen — Recipes Feature Plan

**Status:** R1 + R2 + R3 + R8 + R9 + R10 shipped & verified; class filters shipped — R4–R7, R11 planned
**Created:** June 11, 2026
**Owner:** Leland Long

> **Content seed (06-15-2026-1):** 282 recipes imported from CUL-105 + CUL-112 course
> materials into the `rerun` library, tagged by course + category + `class-material`
> (textbook recipes also `on-cooking`). See CHANGELOG. Added the owner-scoped
> `bulkCreateRecipes` mutation for batch imports.

This document captures the design and phased roadmap for the **Recipes** feature set — the
evolution of Chef's Kitchen from a pure study tool into a study tool **and** a working kitchen
companion. It complements (does not replace) [plan.md](./plan.md).

---

## 1. Vision

Replace the user's scattered recipe collection — a browser bookmark folder of "recipes to try
someday" URLs and a pile of iPhone Notes — with one in-app library that is:

- **Cleaner:** no ads, no SEO life-stories, no clutter — just title, ingredients, steps, images.
- **Searchable & browsable:** decide what to cook next by mood, available ingredients, and picky-eater constraints.
- **Accountable:** capture diner scores (1–10) on finished dishes, so "what actually goes over well" becomes data.
- **Shareable:** send recipes to other users by gamer name, in-app.
- **Easy to fill:** add recipes by typing, by pasting a URL, or by snapping a photo.

### Users & placement
- **Audience:** all users, but **optional** — Recipes sits alongside the study courses; study-only users ignore it.
- **Placement:** a **4th card in the course selector** (next to CUL-104 / CUL-105 / CUL-112). Selecting it
  routes to a dedicated **Recipes screen**, NOT the quiz HomeScreen. (See §5 for why this stays separate.)

---

## 2. Architecture — why this is feasible on our stack

Chef's Kitchen is a no-build static site (GitHub Pages) + Convex Cloud. The **linchpin that makes
Recipes possible without adding a server** is **Convex actions** — server-side functions that can
`fetch()` external URLs and call third-party APIs. This single capability solves the three things that
would otherwise block us:

| Problem | Why the browser can't do it | Convex action solves it |
|---|---|---|
| **CORS** — fetching `allrecipes.com` etc. | Browsers block cross-origin reads of arbitrary sites | Actions run server-side, no CORS restriction. No third-party proxy needed. |
| **Secret API key** — AI import needs a key | Anything in client JS is public on a static site | Key lives as a Convex env var, read by the action only |
| **Image storage** | — | Convex built-in file storage (signed upload URLs, ~20MB/file) |

**Security rule (non-negotiable):** the Anthropic API key is set with
`npx convex env set ANTHROPIC_API_KEY <key>` on THIS project's deployment (`cautious-monitor-526`).
It is read server-side via `process.env.ANTHROPIC_API_KEY` inside actions. It must NEVER appear in
committed code, `version.js`, or any client-served file. (Convex env vars do not cross deployments, so
the scheduler repo's key does not automatically apply here — it's a one-time set on this project.)

### AI key strategy (global now, per-user later — build the seam now)
- Build a single indirection, e.g. `resolveApiKey(user)`, that today returns the global env key.
- Reserve a per-user override: an optional encrypted key stored on the user record, used if present.
- Owner's personal key will live under gamer name **`rerun`** when per-user mode is switched on.
- Switching "global → per-user" should be a **one-line change** in `resolveApiKey`, nothing else.

---

## 3. Data model (new Convex tables)

All recipe data is **per-user owned** (scoped by `ownerId` → `users._id`). The existing user system
(gamerName, etc.) is reused as-is.

```
recipes
  ownerId        : id("users")              // who owns this copy
  title          : string
  description    : optional string
  ingredients    : array<string>            // one line each (or {qty, unit, item} objects later)
  steps          : array<string>            // ordered instructions
  imageIds       : array<id("_storage")>    // 1+ images; [0] is the cover
  sourceType     : "manual" | "url" | "photo"
  sourceUrl      : optional string          // for url imports
  prepMinutes    : optional number
  cookMinutes    : optional number
  servings       : optional string
  tags           : array<string>            // mood, cuisine, "kid-friendly", "quick", etc.
  pickyFlags     : array<string>            // e.g. ingredients to avoid / who won't eat what
  createdAt      : number
  updatedAt      : number
  index: by_owner [ownerId]

recipeScores                                 // diner ratings of finished dishes
  recipeId       : id("recipes")
  ownerId        : id("users")              // denormalized for easy per-user queries
  score          : number                    // 1..10
  dinerName      : optional string           // who rated it (free text; not necessarily a user)
  notes          : optional string
  cookedOn       : optional number           // when the dish was made
  createdAt      : number
  index: by_recipe [recipeId], by_owner [ownerId]

recipeShares                                 // in-app "send a copy" inbox
  fromUserId     : id("users")
  toGamerName    : string                    // lowercase, matches users.gamerName
  recipeSnapshot : any                        // full recipe payload (incl. copied image ids)
  status         : "pending" | "accepted" | "declined"
  createdAt      : number
  index: by_recipient [toGamerName, status]
```

Notes:
- **Sharing = deep copy.** Because each user owns their own library, accepting a share copies the
  recipe (and re-stores its images under the recipient) into a new `recipes` row they own. No shared
  mutable state; matches the existing ownership model.
- Images are Convex `_storage` ids, served via signed URLs.

---

## 4. Feature-by-feature notes

### 4a. Manual recipes + images + CRUD + browse  *(free; no AI)*
Foundation. Per-user create/edit/delete; 1+ images via Convex signed upload URLs (camera or photo
roll both arrive as file uploads from `<input type="file" accept="image/*" capture="environment">`).
This alone replaces the iPhone Notes pile.

### 4b. URL import  *(AI-assisted; replaces the bookmark folder)*
- A Convex **action** fetches the page server-side (no CORS issue).
- **Primary parse:** extract the embedded `<script type="application/ld+json">` `schema.org/Recipe`
  block — the same structured data Google reads. Maps cleanly to title / ingredients / steps / image /
  times. **Ads and life-stories are automatically excluded** because they aren't in the structured block.
  ~85–90% of major recipe sites publish this.
- **Fallback (~10% of sites):** if no JSON-LD, send the page's main text to the Claude API and have it
  return the same structured fields. Costs a few cents; only triggers when needed.

### 4c. Photo import  *(AI; camera or photo roll)*
- 2026 reality: **LLM vision (Claude) beats traditional OCR** for recipe cards — it reads the whole
  recipe in context (handwriting, multi-column, "1½ c flour") instead of guessing characters.
- Flow: upload image → Convex action sends it to the Claude API → returns structured fields → user
  reviews/edits before saving. Always show a review step (guards against AI mistakes).

### 4d. Diner scores (1–10)  *(free; the real differentiator)*
Cheap to build, high long-term value. After cooking, log scores from the people who ate it. Over time
this powers "what's a crowd-pleaser" and feeds meal planning. Surface average score + count on each
recipe card.

### 4e. In-app sharing by gamer name  *(free)*
Recipient is identified by gamer name only (already unique in `users`). Send → lands in their
`recipeShares` inbox → they accept → deep-copy into their library. Simple, no external channel.

### 4f. Meal planning / "what do I cook?"  *(free; the payoff)*
Mostly UI over good tags + score data. Filter your library by mood, available ingredients,
picky-eater flags, prep/cook time, and past scores. Gets better as the foundation fills with data.

---

## 5. Why Recipes stays separate from the quiz engine

The `COURSES` object assumes a quiz/topic/flashcard structure (quizGroups, examFocus, categories).
Recipes has none of that. So:
- Render a **Recipes card** in the existing course-selector grid (it already maps over a list).
- But route its selection to a **dedicated `RecipesScreen`**, not the study `HomeScreen`.
- This keeps the (now stable) quiz machinery untouched and avoids shoehorning recipe data into a
  shape it doesn't fit. The card is the only place the two worlds meet.

---

## 6. Phased roadmap

**Phase R1 — Foundation (free)** ✅ DONE (06-11-2026-2)
- Convex `recipes` table + per-user CRUD functions
- Image upload/storage/serve (signed URLs)
- Recipes card in selector → `RecipesScreen` (list + detail + add/edit form)
- Manual recipe entry with 1+ images
- Browse/search by title + tags
- *Outcome: replaces iPhone Notes.*

**Phase R2 — Scores (free)** ✅ DONE (06-11-2026-3)
- `recipeScores` table + functions
- Log diner scores (1–10) on a recipe; show avg + count
- *Outcome: capture what people actually like.*

**Phase R3 — URL import (AI)** ✅ DONE (06-15-2026-9)
- `ANTHROPIC_API_KEY` already set on this deployment (env var, server-side only)
- `resolveApiKey()` seam (global now; per-user-ready for R7)
- Convex action `importRecipeFromUrl`: fetch URL → JSON-LD `schema.org/Recipe` parse → fields; Claude API fallback for non-JSON-LD pages
- 🔗 Import button → review-before-save (pre-fills the editor; saved with `sourceType: "url"` + `sourceUrl`)
- *Outcome: replaces the bookmark folder.* Note: some sites (e.g. seriouseats, simplyrecipes) block server-side fetches with 403/Cloudflare — those won't import.

**Phase R4 — Photo import (AI)**
- Convex action: image → Claude vision → structured fields
- Camera + photo-roll capture; review-before-save
- *Outcome: snap a handwritten/printed card → clean recipe.*

**Phase R5 — Sharing (free)**
- `recipeShares` inbox; send by gamer name; accept = deep copy (incl. images)

**Phase R6 — Meal planning (free)**
- Filter/browse by mood, ingredients on hand, picky-eater flags, time, score
- "What should I cook?" surfacing

**Phase R6b — Diner-centric view ("cook for a person") (free)** — REQUESTED
- Pick a diner (from the per-user diner list) → see all dishes that diner has rated,
  sorted highest rating at top, lowest at bottom.
- Use case: plan a birthday/featured-guest menu around dishes a specific person loves,
  and avoid ones they rated low.
- Data is already captured (recipeScores has dinerName + score + recipeId). Likely a new
  query `getDinerRatings(ownerId, dinerName)` joining scores→recipes, returning
  [{recipe, score, notes}] sorted desc. Mostly UI on existing data.

**Phase R7 — Per-user API keys (later)**
- Flip `resolveApiKey` to prefer a per-user key; store owner's under gamer name `rerun`
- UI for a user to enter their own key

**Phase R8 — Serving-size scaling (instant ingredient conversion)** *(free)* ✅ DONE (06-15-2026-6)
- At the top of the recipe detail, next to **servings**, add a **−/+ stepper** (and/or a target-servings
  input) to rescale the dish. All structured `{qty, unit, item}` ingredient quantities recompute
  **instantly** using the conversion-factor method taught in class: `CF = targetYield / baseYield`,
  then each `qty × CF`.
- **View-time only** — never mutates the stored recipe; a reset returns to the base servings.
- Parsing: handle fractions (`1/2`), decimals (`1.5`), and ranges (`2-3`); render results as friendly
  fractions (e.g. `0.75 cup` → `¾ cup`). Base yield comes from the recipe's `servings` field —
  portion-style yields (`1 portion`, `6 servings`) scale cleanly; volume yields (`1 pint`, `1 quart`)
  are a v2 nicety.
- ✅ Unit rollup shipped (06-15-2026-8): scaled quantities convert to the most sensible unit via
  standard kitchen formulas (3 tsp → 1 Tbsp, 4 Tbsp → ¼ cup, 4 cups → 1 qt, 16 oz → 1 lb, metric too),
  only when the result lands on a clean fraction. Nice tie-in: this *is* the CUL-105/112
  conversion-factor lesson made interactive.

**Phase R9 — Global recipes + per-user layer** *(free; architectural)* ✅ DONE (06-15-2026-3)
The 282 imported class recipes should be visible to **every** student (the app is already shared with
the whole class), while each user keeps their own private library — merged into one list (the class
filters already distinguish them). **Editing a shared recipe must never change it for anyone else.**
- **R9a — Global (shared) recipes.** Introduce a recipe *scope*: a `scope: "global" | "user"` field
  (global rows have no personal `ownerId`, or are owned by a curator/`rerun` and flagged global).
  `getMyRecipes` returns **the user's own recipes + all global recipes, merged**. Only an admin/curator
  can create or edit global recipes. **Migrate the 282 class-material imports from `rerun` to global**
  as the first global set (the `course` / `class-material` / `on-cooking` tags travel with the row, so
  the new class filters keep working unchanged).
- **R9b — Per-user custom notes (overlay).** Any user can attach **their own notes** to any recipe
  (global or personal) via a lightweight per-user annotation, overlaid at display time. Never touches
  the global row — notes stay private and per-user.
- **R9c — Copy-on-write edits.** When a user hits **Edit** on a *global* recipe, do **not** mutate the
  shared row — fork a **personal deep copy** they own (ingredients, steps, images) and edit that; the
  global stays intact for everyone. Surface clearly as "Save as my copy." (Custom notes = the
  lightweight overlay in R9b; structural edits = a fork.)
- Data sketch:
  ```
  recipes.scope     : "global" | "user"        // or ownerId null ⇒ global
  recipes.forkedFrom: optional id("recipes")   // provenance when a global is copied to a user
  recipeNotes       : { userId, recipeId, notes, updatedAt }   index by_user_recipe [userId, recipeId]
  ```

**Phase R10 — Cook log (meal events: date · diner count · notes)** *(free)* ✅ DONE (06-15-2026-7)
Capture each time a recipe is actually **put on a menu / cooked for a meal**, separate from the 1–10
diner scores (which already exist and attach to the meal).
- Below the diner ratings on a recipe, add **"Log a meal"**: a **date**, a **diner count**, and a
  **notes** field; the existing per-diner 1–10 ratings can be entered for that same meal.
- Data sketch: `recipeCookLog : { recipeId, ownerId, cookedOn, dinerCount, notes, createdAt }`
  (index `by_owner`, `by_recipe`). Optionally relate diner scores to an event via `recipeScores.eventId`.

**Phase R11 — Meal-planning history & analytics** *(free)* — REQUESTED (06-15)
Builds on R10 (and the R6 meal-planning vision).
- A **history list view across all recipes**, sorted by **date**, with **search** — what was cooked
  when, for how many, with notes and that meal's ratings.
- **Running totals / rollups**: meals per week/month, total diners served, most-cooked dishes,
  best-scoring dishes over time — turning the cook log into a planning + retrospective tool.
- Surfacing ideas: "haven't made X in a while," crowd-pleasers to re-run, menu planning around a date.

---

## 7. Open questions / decisions deferred
- Ingredient model: start as plain strings (R1); consider structured `{qty, unit, item}` later for
  scaling recipes up/down and ingredient-based search.
- Whether shared recipes should retain a "from {gamerName}" attribution line.
- Image limits per recipe / per user (Convex storage quota awareness).
- Cost guardrails if classroom-wide AI import usage grows (rate limit per user; or revisit "AI for me only").
- **R8 scaling:** how to render scaled fractions cleanly; how to parse non-portion yields
  (pint/quart/gallon) for the stepper; whether to auto-roll units as quantities grow.
- **R9 global recipes:** scope representation (`scope` field vs `ownerId: null`); who may curate/edit
  globals (admin only — likely the professor + `rerun`); confirm the `class-material`/`on-cooking`/course
  tags still drive the existing filters after migration (they should — tags live on the row).
- **R9 overlay vs fork:** notes are a clean per-user overlay; do we also allow per-user *field-level*
  overrides without a full fork? Recommend v1 = notes overlay + full deep-copy fork on structural edit.
- **R10 cook log vs scores:** one cook event → many diner scores; thread `eventId` now, or keep them
  independent and join by date? (Lean independent first; add `eventId` when R11 needs tight grouping.)

---

## 8. Decisions locked (June 11, 2026)
- AI features **on from the start**, using a **global** Anthropic key (set on this Convex deployment),
  with the **per-user-key seam built in now** for an easy future switch. Owner's personal key → gamer name `rerun`.
- Recipes available to **all users, optional**.
- Recipes appears as a **4th course card**, routing to a separate Recipes screen.
