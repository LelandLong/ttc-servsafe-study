# Chef's Kitchen — Recipes Feature Plan

**Status:** Phase R1 (foundation) shipped & verified — R2–R7 planned
**Created:** June 11, 2026
**Owner:** Leland Long

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

**Phase R2 — Scores (free)**
- `recipeScores` table + functions
- Log diner scores (1–10) on a recipe; show avg + count
- *Outcome: capture what people actually like.*

**Phase R3 — URL import (AI)**
- `npx convex env set ANTHROPIC_API_KEY` on this deployment
- `resolveApiKey(user)` seam (global now; per-user-ready)
- Convex action: fetch URL → JSON-LD parse → fields; Claude fallback for non-JSON-LD pages
- Review-before-save UI
- *Outcome: replaces the bookmark folder.*

**Phase R4 — Photo import (AI)**
- Convex action: image → Claude vision → structured fields
- Camera + photo-roll capture; review-before-save
- *Outcome: snap a handwritten/printed card → clean recipe.*

**Phase R5 — Sharing (free)**
- `recipeShares` inbox; send by gamer name; accept = deep copy (incl. images)

**Phase R6 — Meal planning (free)**
- Filter/browse by mood, ingredients on hand, picky-eater flags, time, score
- "What should I cook?" surfacing

**Phase R7 — Per-user API keys (later)**
- Flip `resolveApiKey` to prefer a per-user key; store owner's under gamer name `rerun`
- UI for a user to enter their own key

---

## 7. Open questions / decisions deferred
- Ingredient model: start as plain strings (R1); consider structured `{qty, unit, item}` later for
  scaling recipes up/down and ingredient-based search.
- Whether shared recipes should retain a "from {gamerName}" attribution line.
- Image limits per recipe / per user (Convex storage quota awareness).
- Cost guardrails if classroom-wide AI import usage grows (rate limit per user; or revisit "AI for me only").

---

## 8. Decisions locked (June 11, 2026)
- AI features **on from the start**, using a **global** Anthropic key (set on this Convex deployment),
  with the **per-user-key seam built in now** for an easy future switch. Owner's personal key → gamer name `rerun`.
- Recipes available to **all users, optional**.
- Recipes appears as a **4th course card**, routing to a separate Recipes screen.
