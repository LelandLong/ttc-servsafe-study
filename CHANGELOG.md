# Changelog

All notable changes to the Chef's Kitchen Study Aid project (multi-course culinary PWA for Trident Technical College).

Format: `MM-DD-YYYY-BUILD`

---

## [06-15-2026-11] - June 15, 2026

### Fixed
- **Recipes — serving scaler: elegant conversions when scaling *down*.** Scaling by an awkward factor (e.g. 6 servings → 5 = ×⅚) used to produce useless amounts like `3 1/3 Tbsp`, `5/8 cup`, and `6 2/3 Tbsp`. The scaler now renders awkward results as **compound measures the way recipes are actually written**: `2 fl oz × ⅚ → 3 Tbsp + 1 tsp`, `5/8 cup → 1/2 cup + 2 Tbsp`, `6 2/3 Tbsp → 6 Tbsp + 2 tsp`. It only uses standard measuring fractions (¼/⅓/½/⅔/¾ cup, whole Tbsp, ¼-tsp increments; lb in ¼ increments or `X lb + Y oz`) — never thirds-of-a-tablespoon or eighths-of-a-cup. Scaling *up* still rolls up cleanly (3 tsp → 1 Tbsp, 4 Tbsp → ¼ cup, 16 oz → 1 lb). Verified with 24 conversion unit tests + in-app down-scaling on a real recipe; zero console errors. (Conversions match the CUL-112 measurements reference.)

---

## [06-15-2026-10] - June 15, 2026

### Added
- **Recipes — Phase R4: import from a photo (Claude vision).** The import panel now has a **📷 Scan a recipe photo** option (camera or photo roll). Snap a recipe card or cookbook page — handwritten or printed — and Claude vision reads it into the editor (title, ingredients, steps, servings, times, tags) for **review before saving** (`sourceType: "photo"`).
  - Client downscales the photo to ≤1568px JPEG before upload (keeps the request small and vision cost low), then calls the new Convex action `importRecipeFromPhoto` (base64 image → Claude vision → structured fields). Shared `callClaude` / `recipeFromAiText` helpers back both URL and photo import. Key stays server-side only.
  - Verified end-to-end: a synthetic recipe card extracted title, all 6 ingredients, 4 steps, and servings exactly; full in-app scan → review → save flow passed with zero console errors. Deployed to prod + dev.

---

## [06-15-2026-9] - June 15, 2026

### Added
- **Recipes — Phase R3: import from a URL (AI-assisted).** A **🔗 Import** button on the recipe list opens a URL box; paste a recipe link and the app pulls the title, ingredients, steps, servings, prep/cook times, and tags into the editor for **review before saving** (saved as a normal personal recipe with `sourceType: "url"` + `sourceUrl`).
  - Server-side **Convex action** `importRecipeFromUrl` fetches the page (bypassing browser CORS). **Primary path:** parse the embedded `schema.org/Recipe` **JSON-LD** (handles `@graph` and arrays; ISO-8601 durations → minutes; HowToStep/HowToSection instructions) — no AI needed, covers most major recipe sites. **Fallback:** if no JSON-LD, send the page text to the Claude API for structured extraction. `resolveApiKey()` seam reads the key from the deployment env (global now; per-user-ready for R7).
  - The Anthropic key lives only as a Convex **env var**, read server-side in the action — it never appears in committed code or anything served to the browser. Verified with two live sites: budgetbytes (JSON-LD) and loveandlemons (AI fallback), plus the full in-app import → review → save flow. Deployed to prod + dev.

---

## [06-15-2026-8] - June 15, 2026

### Changed
- **Recipes — serving scaler now rolls up to sensible units.** When you scale a recipe, quantities convert using standard kitchen formulas instead of staying in the original unit: `3 tsp → 1 Tbsp`, `4 Tbsp → ¼ cup`, `2 cups → 1 pint`, `4 cups → 1 quart`, `16 oz → 1 lb` (and metric `1000 g → 1 kg`, `1000 ml → 1 l`). The largest unit that lands on a clean kitchen fraction wins; values that don't convert cleanly stay in the smaller unit (so 5 Tbsp shows as `5 Tbsp`, never a distorted `1/3 cup`). Count units (clove, each, pinch, slice…) and "to taste"/"as needed" are scaled but not unit-converted. Ranges scale both ends. Verified: 14/14 conversion unit cases + browser check on a real recipe.

### Fixed
- **Recipes header — version no longer hidden behind the account avatar.** On the recipes screen the version number sat directly under the fixed 52px account avatar in the top-right. Added right padding to the header row so the version and avatar sit **side-by-side** (verified: version right edge 310px vs avatar left 322px at iPhone width — no overlap).

---

## [06-15-2026-7] - June 15, 2026

### Added
- **Recipes — Phase R10: cook log.** A **🍴 Meals Cooked** section on each recipe lets you log every time you actually make the dish: **date cooked**, **diner count**, and **notes** — separate from the 1–10 diner ratings. Entries list newest-first with a running count in the header, and each can be deleted. Per-user (each person logs their own meals; works on shared/global recipes too). This is the data foundation for the planned R11 meal-planning history/analytics.
  - Backend: new `recipeCookLog` table (`by_recipe`, `by_owner`) + `addCookLog` / `getCookLog` / `deleteCookLog` (owner-scoped, visible-recipe check). Deleting a recipe (or an admin global delete) cleans up its cook-log entries. Deployed to prod + dev.
  - Verified with Playwright: logging a meal on a global recipe shows the entry (date • diners • notes) with count, and delete returns to empty; zero console errors.

---

## [06-15-2026-6] - June 15, 2026

### Added
- **Recipes — Phase R8: serving-size scaling.** The recipe detail screen now has a **−/+ stepper** next to the servings line. Stepping the target serving count instantly rescales every structured ingredient quantity via the conversion-factor method (`CF = target ÷ base`) — the in-class lesson, live. View-only (never changes the stored recipe); a **reset** link restores the base.
  - Handles fractions (`1/2`), decimals (`1.5`), mixed numbers (`2 1/2`), and ranges (`2-3`); results render as friendly fractions (`0.75 → ¾`, `1.5 → 1 ½`). "To taste"/"as needed" and unparseable compound quantities (e.g. `2 lb. 8`) pass through unchanged. The Ingredients header shows the active factor (e.g. "scaled ×2").
  - Base serving count is parsed from the recipe's `servings` text (`2 portions` → 2, `Makes 12 … servings` → 12); recipes with no number in servings simply show the text with no stepper. Frontend-only (no Convex change).
  - Verified: 16/16 scaling unit cases; Playwright (Saffron Risotto, 2 portions → ×2) rescaled all quantities correctly and reset restored the originals; zero console errors.

---

## [06-15-2026-5] - June 15, 2026

### Added
- **Admin — Global Recipes tab.** `admin.html` gains a 4th tab (**🍳 Recipes**) to manage the shared recipe library: searchable/course-filterable list of all global recipes, **Add Global Recipe**, **Edit**, and **Delete** (with a "removes it for ALL users" confirm). Backed by new admin-only Convex functions `adminListGlobalRecipes`, `adminSaveGlobalRecipe` (create/update; new globals are owned by the `rerun` curator), and `adminDeleteGlobalRecipe` (cleans up images/scores/notes).

### Changed
- **Globals are edited ONLY from the admin screen.** Editing a shared recipe in the student app now **always forks a personal copy** — for *every* account, including the curator (`rerun`). The student-app **updateRecipe**/**deleteRecipe** mutations now hard-reject any global ("Global recipes can only be edited/deleted from the admin screen."), so no account can alter a shared recipe from the student app. The "(you curate this)" hint and curator in-place editing were removed from the recipe detail screen.
- **getMyRecipes** hides a forked global even when the viewer owns the global (the curator's own globals), so a forked copy never shows alongside its original.

### Verified
- Playwright (prod): as `rerun`, a global shows "🌐 Shared recipe", **Customize (save my copy)**, no Delete; editing forks (⭐ Mine appears). Admin Recipes tab: 282 → add → 283 → delete → 282. Backend rejects `updateRecipe`/`deleteRecipe` on a global. Zero console errors; test data cleaned up.

---

## [06-15-2026-4] - June 15, 2026

### Changed
- **Recipes — no Delete on shared recipes.** The **Delete** button is now hidden on every global/shared recipe, for **all** users including the curator (`rerun`) — deleting a global would remove it for the whole class, so it shouldn't be a one-tap action on the recipe screen. Delete remains on personal recipes and forked copies. Global cleanup is now a deliberate admin action (e.g. `npx convex run recipes:deleteRecipe … --prod`). Verified: curator and student both see Edit/Customize but no Delete on a global; zero console errors.

---

## [06-15-2026-3] - June 15, 2026

### Added
- **Recipes — Phase R9: global recipes + per-user layer.** The 282 imported class recipes are now **shared with every user** (the app is already class-wide), while each user keeps their own private library — merged into one list. Editing a shared recipe never changes it for anyone else.
  - **R9a — Global recipes.** New recipe `scope` (`global` | `user`) + `by_scope` index. `getMyRecipes` returns the user's own recipes **plus all global recipes**, merged (newest first), de-duplicated for the curator. The 282 class-material recipes were migrated from `rerun` to global scope (`globalizeClassMaterial` one-shot mutation). Only the curator can edit a global in place. A **🌐 Shared recipe** badge marks them in detail.
  - **R9b — Per-user custom notes.** New `recipeNotes` table (`by_user_recipe`, `by_recipe`) + `setRecipeNote` upsert. A **📝 My Notes** section on every recipe lets a user attach private notes (e.g. "doubled the garlic") that are theirs alone and never touch the shared recipe. Diner ratings are likewise now **per-viewer** on shared recipes (each user sees only their own).
  - **R9c — Copy-on-write edits.** Editing a global recipe you don't own forks a **personal deep copy** (`forkedFrom`) — the button reads **"Customize (save my copy)"**, and the original stays intact for everyone. The forked copy replaces the global in your own list; **Delete** is hidden on shared recipes you don't own.
  - Backend deployed to prod + dev. Verified with Playwright (iPhone viewport): a student sees all 282 globals, adds a private note, and forks a recipe — while `rerun` is unaffected (no leaked note, no fork, still curator-editable). Zero console errors; test data cleaned up.

---

## [06-15-2026-2] - June 15, 2026

### Added
- **Recipes — class filters.** Filter chips above the search bar on the My Recipes list, generated from the data:
  - One chip **per class** (`CUL-105`, `CUL-112`) showing only the **in-class lab recipes** (the recipe booklet/packet) — e.g. tapping `CUL-112` shows the ~33 booklet dishes, **not** the 228 *On Cooking* reference recipes. This makes it quick to pull up just the dishes covered in a given class.
  - A **📚 Reference** chip for the *On Cooking* textbook recipes (tagged `on-cooking`), and a **⭐ Mine** chip for your own non-class recipes (each appears only when such recipes exist).
  - Multiple chips combine as a union (OR); each chip shows its live count; "Clear" resets. Filters compose with the search box. No re-tagging was needed — in-class recipes carry a course tag without `on-cooking`, reference recipes carry `on-cooking`.
  - Frontend-only (no Convex change). Verified with Playwright at iPhone viewport: chips `CUL-105 (21)`, `CUL-112 (33)`, `Reference (228)`; CUL-112 → 33 booklet dishes, CUL-105 → 21, no filter → 282, zero console errors.

---

## [06-15-2026-1] - June 15, 2026

### Added
- **Recipes — class-material import.** Seeded **282 recipes** from the CUL-105 and CUL-112 course materials into the Recipes library, owned by gamer name **`rerun`**. Every imported recipe is tagged with its course (`CUL-105` / `CUL-112`), a category (Sauces, Soups, Beef, Poultry, Fish & Shellfish, etc.), and a shared **`class-material`** tag so they're distinguishable from hand-entered recipes; the 228 *On Cooking* textbook recipes carry an additional `on-cooking` tag.
  - **CUL-105 (21):** the *Recipe packet CUL 105.docx* lab recipes (stocks, mother sauces, emulsions, starches, vegetables) — scaled duplicates collapsed, lecture/measurement material excluded.
  - **CUL-112 (261):** the *CUL 112 recipe booklet* lab dishes (33) plus the full *On Cooking* textbook recipe appendix — Beef (20), Veal (12), Pork (16), Poultry (38), Lamb (14), Game (9), Fish & Shellfish (48), Soups (30), Stocks & Sauces (41).
  - Sources parsed into structured `{qty, unit, item}` ingredients + ordered steps + servings; US measurements kept (textbook metric dropped). Ingredients normalized and fed into the global ingredient catalog on import.
  - Backend: new owner-scoped **`bulkCreateRecipes`** mutation in `convex/recipes.ts` (same normalization + catalog sync as `createRecipe`). Deployed to prod + dev.

---

## [06-11-2026-4] - June 11, 2026

### Added
- **Recipes — structured ingredients.** Ingredients are now three fields per row — quantity, unit, and ingredient name — instead of free-text lines.
  - **Unit autocomplete** from a canonical list with normalization for consistency (e.g. POUNDS→`lb`, tbsp→`Tbsp`, teaspoon→`tsp`, cloves→`clove`). Case is meaningful where it disambiguates: `tsp` vs `Tbsp`.
  - **Ingredient-name autocomplete** from a **global** catalog (everyone shares onion/garlic/etc.), so repeated ingredients stay consistent over time. Ingredient names are forced lowercase.
  - Legacy free-text ingredients from earlier recipes still display and are best-effort parsed into the three fields when editing (backward compatible).
- **Diner name type-ahead.** When rating a dish, the "who rated it" field suggests diners you've entered before (per-user) via a filtering dropdown — type "mer" → "Mermaid" narrows in; type a new name and the dropdown gets out of the way.
  - Backend: `ingredientCatalog` table + `getIngredientCatalog` (global) and `getMyDinerNames` (per-user); create/update normalize ingredients and feed the catalog. Deployed to prod + dev.
- Verified with Playwright at iPhone viewport: 3-field rows, unit/ingredient/diner autocomplete, normalization on save, edit pre-fill, 16px inputs (no iOS zoom), no horizontal overflow.

---

## [06-11-2026-3] - June 11, 2026

### Added
- **Recipes — Phase R2 (diner scores).** Rate finished dishes 1–10 and track what actually goes over well.
  - "+ Rate this dish" on the recipe detail: 1–10 slider, optional diner name and notes.
  - Average score + rating count shown as a color-coded badge (green ≥8, amber ≥5, red <5) on both the recipe list cards and the detail header; individual ratings listed with delete.
  - Backend: new `recipeScores` Convex table + `addScore` / `getScores` / `deleteScore` (owner-scoped, 1–10 validation); `getMyRecipes`/`getRecipe` now include `avgScore` + `scoreCount`. Deleting a recipe also cleans up its ratings. Deployed to prod + dev.
  - Verified end-to-end with Playwright at iPhone viewport (PASS 6/6): average computes and live-updates as ratings are added, badge appears on list + detail, no horizontal overflow, zero console errors.

---

## [06-11-2026-2] - June 11, 2026

### Added
- **Recipes — Phase R1 (foundation).** Chef's Kitchen now includes a per-user recipe library, the first step toward the kitchen-companion vision in RECIPES-PLAN.md.
  - New **"My Recipes"** card in the course selector (all users, optional) → routes to a dedicated Recipes screen (separate from the quiz engine).
  - Create / edit / delete recipes with title, description, ingredients (one per line), steps, servings, prep/cook time, tags, and 1+ photos (camera or photo roll via Convex file storage).
  - Recipe **list** (with search by title/tag), **detail** view, and **add/edit** form.
  - Backend: `recipes` Convex table + owner-scoped CRUD (`convex/recipes.ts`), deployed to prod + dev.
  - Verified end-to-end in a real browser (Playwright): full create→list→detail→edit→delete flow, zero console errors.
- **Mobile/iOS friendliness** (Recipes will be used mostly on phones, in class/kitchens):
  - `viewport-fit=cover` for iPhone safe areas; 16px form inputs to stop iOS focus-zoom; 44px+ tap targets on touch devices; momentum scrolling; word-wrap + image max-width to prevent horizontal overflow.
  - Verified at iPhone 13 viewport (390px): no horizontal overflow on any Recipes screen.

### Dev
- Added **Playwright** as a dev dependency for browser-based UI verification and screenshots.

---

## [06-11-2026-1] - June 11, 2026

### Changed
- **App renamed to "Chef's Kitchen Study Aid."** The app started as a CUL-104 ServSafe study tool ("ServSafe PWA") and has grown to three courses, so the visible app name and internal project metadata are now course-neutral. Updated the PWA name/description (`manifest.json`), login subtitle ("Culinary Study Aid"), `package.json`/`package-lock.json` (`chefs-kitchen-pwa`), and doc headers (CHANGELOG, ARCHITECTURE).
- **Unchanged on purpose:** the GitHub repo name, the GitHub Pages URL, and the local folder path all keep their original `servsafe` names — they're addresses/identifiers, not user-facing branding, and changing them would break links. "ServSafe" is also intentionally retained everywhere it refers to the CUL-104 course itself, its content, and the ServSafe certification exam.

---

## [06-09-2026-5] - June 9, 2026

### Fixed
- **"Study by Quiz" showed no questions for CUL-112 (and any non-CUL-104 course).** The quiz-group quiz starter used a hardcoded chapter map containing only CUL-104's group ids (`1-4`, `5-7`, …). CUL-112's group ids (`quiz1`, `quiz3`, `finalvocab`, …) weren't in that map, so the filter returned an empty list and every CUL-112 quiz reported "no questions available." The starter now reads the chapter list (and label) from the active course's `quizGroups` config, falling back to the legacy map for CUL-104. All quiz groups for both courses now resolve correctly, and CUL-112 quizzes display their proper labels (e.g. "Quiz 3: Pork", "Final: Vocabulary").

---

## [06-09-2026-4] - June 9, 2026

### Added
- **CUL-112 "Final: Vocabulary" quiz** — 23 testable multiple-choice questions covering all 23 terms in `VOCABULARY.pdf` (clarified butter, fond, au sec, deglaze, depouillage, remouillage, caramelize, roux, glace, compound butter, roasting, sauté, braising, pan-frying, shallow poaching, searing, flambé, grilling, standard breading procedure, cartouche, supreme/airline breast, paupiette, scaloppini). Vocabulary is part of the final exam, so these are now **scored and tracked** (not just flashcards). Grouped under "Final: Vocabulary" (chapter 6) and added as the **Culinary Vocabulary** study topic; marked examFocus.
  - The same terms remain available as the existing tap-to-flip flashcard deck.
- CUL-112 now has **180 study items** (157 quiz + 23 flashcards); question IDs extended to 3135-3157.

---

## [06-09-2026-3] - June 9, 2026

### Added
- **CUL-112 Quiz 3 "Pork"** — all 15 questions, correct answers verified against the student's 100% submission (`Quiz - 5.pdf`, which D2L titles "Q3 Pork"). New **Pork** topic (🐷), grouped under "Quiz 3: Pork" (chapter 3). **This fills the previously-outstanding Quiz 3 gap.**
  - The original quiz's two image-based pig-diagram *matching* questions (Q11, Q12) were converted into 5 standard multiple-choice questions (the app supports MCQ/flashcards only), preserving the primal-cut knowledge (belly→bacon, Boston Butt→pulled BBQ, loin→tenderloin/baby back ribs, fresh ham→prosciutto, picnic ham→shoulder).
- CUL-112 now has **157 study items** (134 quiz + 23 flashcards) across 8 topics; question IDs extended to 3120-3134.

### Notes
- Quizzes 1–5 are now all present and verified. Student file names do NOT reliably map to D2L quiz numbers (e.g. `Quiz - 4.pdf` = D2L "Q5 Beef", `Quiz - 5.pdf` = D2L "Q3 Pork") — always read the PDF's D2L title.
- To push the new questions to Convex cloud: open `admin.html`, select CUL-112, click "Reset to Original".

---

## [06-09-2026-2] - June 9, 2026

### Added
- **CUL-112 Quiz 5 "Beef"** — all 25 real quiz questions, correct answers verified against the student's 100% submission (`Quiz - 4.pdf`, which D2L titles "Q5 Beef 2018"). New **Beef** topic (🥩), grouped under "Quiz 5: Beef" (chapter 5).
- CUL-112 now has **142 study items** (119 quiz + 23 flashcards) across 7 topics; question IDs extended to 3095-3119.

### Notes
- File names lag D2L quiz numbers by one (`Quiz - 4.pdf` = D2L "Q5"). Quiz numbering in the app follows D2L's labels (Quiz 1, 2, 4, 5); Quiz 3 remains the only gap, reserved at chapter 3.
- To push the new questions to Convex cloud: open `admin.html`, select CUL-112, click "Reset to Original".

---

## [06-09-2026-1] - June 9, 2026

### Added
- **CUL-112 Quiz 2 "Poultry"** — all 25 real quiz questions, correct answers verified against the student's 100% submission (`Quiz - 2.pdf`). New **Poultry** topic, grouped under "Quiz 2: Poultry" (chapter 2).
- **CUL-112 Quiz 4 "Fish and Shellfish"** — all 20 real quiz questions, verified against the 100% submission (`Quiz - 3.pdf`, which D2L titles "Q4"). New **Fish & Shellfish** topic, grouped under "Quiz 4: Fish & Shellfish" (chapter 4).
- CUL-112 now has **117 study items** (94 quiz + 23 flashcards) across 6 topics; question IDs extended to 3050-3094.
- Category icons for Poultry (🐔), Fish & Shellfish (🐟), Stocks & Sauces, Soups, Cooking Methods & Principles, Culinary Terms.

### Notes
- Quiz 3 is intentionally absent — that quiz hasn't been taken/provided yet. The quiz numbering follows D2L's labels (Quiz 1, 2, 4), so a future Quiz 3 slots in cleanly at chapter 3.
- To push the new questions to Convex cloud: open `admin.html`, select CUL-112, click "Reset to Original".

---

## [05-31-2026-1] - May 31, 2026

### Added
- **CUL-112: Classical Cooking Foundations** — third course added to the app (Summer 1 2026 term)
  - 72 study items: 49 quiz questions + 23 flashcards
  - **Quiz 1 "Stocks & Sauces"** — all 25 real quiz questions, with correct answers verified against the student's 100% retake (`Quiz - 1b.pdf`). Marked `examFocus: true` and grouped under the "Quiz 1: Stocks & Sauces" quiz group.
  - **24 supplementary study questions** generated from the Stock & Sauces, Soups, and Principles of Cooking PowerPoints (mirepoix ratios, stock types, mother sauces, thickening agents, roux types, soup categories, clarification, heat transfer, etc.)
  - **23 Classical Cooking vocabulary flashcards** from `VOCABULARY.pdf` (clarified butter, fond, deglaze, remouillage, braising, sauté, cartouche, scaloppini, and more)
  - Topics: Stocks, Sauces, Soups, Cooking Principles, Culinary Vocabulary
  - **Hybrid organization** (like CUL-104): browse by topic AND by quiz group; "Quiz Focus" button drills the real quiz questions; flashcard deck for vocabulary
  - Question IDs: quiz 3001-3049, flashcards 4001-4023
  - New files: `questions-cul112.js` (`var questionsCUL112`), `questions-cul112-original.js` (`var originalQuestionsCUL112`)
  - Appears automatically in both the student course selector and admin course toggle (both iterate `Object.keys(COURSES)`)
  - Convex-safe: the runtime question loader guards against empty results, so CUL-112's static questions display correctly until pushed to Convex via admin "Reset to Original"

### Notes
- Scope is Phase 1: Quiz 1 + vocabulary + the three quiz-relevant decks. The 8 protein-cookery PowerPoints (Beef, Pork, Lamb, Veal, Poultry, Game, Fish & Shellfish, Meat Cookery) are held until those quizzes approach.
- To push CUL-112 questions to Convex cloud: open `admin.html`, select CUL-112, click "Reset to Original".

---

## [04-01-2026-5] - April 1, 2026

### Fixed
- **Student app not detecting professor ending test early** — Poll now continues during an active test to check whether the professor ended it. When that's detected, the student transitions to the finished screen with the leaderboard instead of staying stuck mid-test.

---

## [04-01-2026-4] - April 1, 2026

### Fixed
- **Convex is now source of truth for questions** — Student app loads questions from Convex cloud for both CUL-104 and CUL-105, not just static JS files. Admin edits now appear for students immediately on reload.
- **CUL-105 questions synced to Convex** — All 563 CUL-105 items (340 quiz + 223 flashcards) now live in Convex alongside CUL-104's 342 questions.
- **COURSES references preserved on Convex sync** — Arrays mutated in place instead of reassigned, so COURSES object always reflects latest Convex data.
- **Live test resilient to connection issues** — Poll failures no longer reset test state (students stay on their current test screen). Answer submissions retry once on failure.
- **CUL-105 localStorage caching** — Student app caches CUL-105 questions in localStorage for fast offline reload.

---

## [04-01-2026-2] - April 1, 2026

### Fixed
- **Live test questions not loading for CUL-105** — Student app only searched `questionsDB` (CUL-104) when looking up test question IDs. CUL-105 question IDs (1001+) were not found, resulting in empty test and student falling back to home screen. Now searches both `questionsDB` and `questionsCUL105`.

---

## [04-01-2026-1] - April 1, 2026

### Added
- **Admin course switching** — Professor can now switch between CUL-104 and CUL-105 in the admin panel
  - Course selector toggle in admin header (CUL-104 | CUL-105 buttons)
  - Questions tab filters to show only selected course's questions
  - Stats bar adapts: shows Chapters for CUL-104, Topics for CUL-105
  - Filter bar adapts: Chapter dropdown for CUL-104, Topic dropdown for CUL-105
  - Type filter for CUL-105 (Quiz vs Flashcard)
  - Question editor shows Topic field for CUL-105, Chapter for CUL-104
  - Question editor supports flashcard type (term/definition) for CUL-105
  - Question rows show topic and type indicators for CUL-105
  - Export/Import scoped to active course (separate backup files, correct variable names)
  - Reset to Original scoped to active course (won't affect other course's data)
  - Live Test creation uses active course's questions and modes (Topic mode for CUL-105)
  - Course selection persisted in localStorage (`chefKitchenAdminCourse`)
  - Separate localStorage keys per course for questions and categories

---

## [03-29-2026-1] - March 29, 2026

### Added
- **Multi-course support** — App now handles CUL-104 (ServSafe) and CUL-105 (Kitchen Fundamentals) side by side
  - Course selector cards on the home screen to switch between courses
  - Per-course progress tracking (nested under course keys, fully independent)
  - Automatic migration of existing CUL-104 progress to new nested format
  - Dynamic study modes: chapters/quiz groups for CUL-104, topics for CUL-105
  - Course-aware class stats polling
- **CUL-105 Kitchen Fundamentals question bank** — 530 items total
  - 340 multiple-choice quiz questions covering comprehensive course material
  - 190 flashcards for key terms, definitions, techniques, and concepts
  - 200 items marked Exam Focus (midterm study guide material — accessible via Exam Focus button)
  - 330 additional items extracted from all 15 course PowerPoints (binary .ppt files parsed via olefile)
  - Full coverage: food safety, eggs & dairy, vegetables, salads, flavors & spices, menus, brigade system, heat transfer, meat cooking/USDA grades, stocks (remouillage, glace, demi-glace, court bouillon), tools & equipment, mise en place, cooking principles, costing, and specific dish techniques
  - Topics: Knife Skills, Cooking Methods, Stocks & Sauces, Soups, Grains/Rice/Pasta, Vegetables/Potatoes, Measurements, Culinary History, and more
  - Categories: Techniques & Methods, Sauces & Soups, Ingredients & Products, Measurements & Math, Culinary History, Kitchen Fundamentals
- **Flashcard mode** — New study mode for CUL-105
  - Tap to flip between term and definition
  - Track cards reviewed in progress
  - Navigate through full deck with Next/Finish buttons
- **Convex schema updates** — Added `course`, `topic`, and `type` fields to questions table; `course` field to liveTests table; `by_course` index
- **Backend function updates** — All queries/mutations now support optional `course` parameter for per-course filtering
  - `bulkImport` and `resetToOriginal` scoped per course (won't wipe other courses)
  - `getClassStats` and `getAllStudents` extract per-course progress from nested format

### Changed
- Title changed from "CUL 104 Study Aid" to "Chef's Kitchen Study Aid"
- Header dynamically shows active course name
- Progress stored in nested format: `{ "CUL-104": {...}, "CUL-105": {...} }`
- Study mode filtering uses course-scoped questions instead of global questionsDB

### Files Added
- `questions-cul105.js` — CUL-105 question bank (200 items, `var questionsCUL105`)
- `questions-cul105-original.js` — CUL-105 backup (`var originalQuestionsCUL105`)

---

## [02-21-2026-3] - February 21, 2026

### Added
- **Offline resilience** — Progress earned while offline is now protected
  - Pending sync flag tracks when cloud sync fails; local data won't be overwritten by stale cloud data on reconnect
  - Auto-retry: when browser comes back online, pending progress is flushed to cloud automatically
  - Connection timeout: "Connecting to cloud..." falls back to "Offline" after 10 seconds instead of hanging indefinitely
  - Offline banner now shows "Changes saved locally" when there's unsynced progress
- **Version checking & auto-update for PWA**
  - Checks for new version on app load and every 30 minutes
  - Blue "Update Now" banner appears when a newer version is deployed
  - Identity check screen (idle timeout) auto-reloads to latest version when user confirms identity
  - Ensures installed PWAs on iOS/Android don't run stale versions indefinitely

---

## [02-21-2026-2] - February 21, 2026

### Fixed
- **Q254 & Q255: Swapped correct answers** — bacterial vs viral prevention answers were reversed
  - Q254 (bacterial): Changed correct answer to "Controlling time and temperature" (was "Practicing good personal hygiene")
  - Q255 (viral): Changed correct answer to "Practicing good personal hygiene" (was "Controlling time and temperature")
  - Updated hints and explanations for both questions
  - Q254 category corrected from "Sanitation & Hygiene" to "Foodborne Illness", chapter 3 → 2
  - Verified against official ServSafe materials
  - Fixed in both `questions.js` and `questions-original.js`

---

## [02-21-2026-1] - February 21, 2026

### Fixed
- **Admin Students tab: Avg Accuracy now excludes inactive students** — students who haven't answered any questions are no longer counted in the average, so it reflects actual usage instead of being dragged down by 0% entries

---

## [02-20-2026-2] - February 20, 2026

### Added
- **44 new questions from Class #11 (Practice Exam #2) and ServSafe Mock Exam docx**
  - Sourced from both the Class #11 transcript (82+ question walkthrough) and the professor's Mock Exam document
  - Topics: time-temperature abuse during slicing, norovirus reporting, allergen response protocol, hepatitis outbreak procedures, chemical/physical contamination types, ALERT food defense system, honest menu presentation, restriction vs exclusion, Staphylococcus locations, thermocouple use for thin items, thermometer accuracy standards, cutting board materials, unmarked food disposal, sliced tomato transport temps, time marking requirements, norovirus symptoms, 7-day date marking, 3-compartment sink heat sanitizing (171°F), power outage food disposal, master cleaning schedule involvement, inverted pot storage, abrasive powders prohibition, self-service monitoring, USDA grading, Listeria/deli meats, vacuum breakers, wastewater response, outdoor garbage lids, oyster sourcing, restricted-use pesticides, pasteurized eggs for children, sesame allergen, cleaning vs sanitizing, off-site catering time limits, CCP corrective action, pork sausage temps
  - All 44 questions marked `examFocus: true`
- **Total questions now: 342** (up from 298)

---

## [02-20-2026-1] - February 20, 2026

### Added
- **47 new questions from Class #10 (Week 6 exam review session)**
  - Covers comprehensive exam review topics: coving, foodborne illness prevention (bacterial vs viral vs parasites), allergen transfer, ready-to-eat foods, personal hygiene details, TCS food handling, receiving/suppliers, storage organization, cooking/reheating temperatures, cooling procedures, thawing methods, cleaning/sanitizing procedures, Active Managerial Control steps, regulatory agencies, variance requirements, facilities/equipment, and more
  - Questions span chapters 1-12 with heavy exam focus
  - All 47 questions marked `examFocus: true`
- **Total questions now: 298** (up from 251)

---

## [02-15-2026-2] - February 15, 2026

### Added
- **32 new questions from Quiz #3 (Ch 8-10) and Quiz #4 (Ch 11-14)**
  - Chapter 8: 6 questions (sneeze guards, ice handling, protein salad TCS limits, additives, reconditioning, hot-hold timing)
  - Chapter 9: 3 questions (pork roast temp, partial cooking time, raw/undercooked menu advisory)
  - Chapter 10: 4 questions (outbreak response, imminent health hazards, HACCP monitoring, pest control as food safety program)
  - Chapter 12: 7 questions (post-pesticide cleanup, pest reporting, PCO selection, pesticide storage, roach signs, recyclables, three pest rules)
  - Chapter 13: 1 question (FDA issues Food Code)
  - Chapter 14: 11 questions (core items, inspection intervals, training approach/frequency/timing, staff knowledge, priority items, violation deadlines, inspection purpose)
- **Total questions now: 251** (up from 219)

---

## [02-15-2026-1] - February 15, 2026

### Added
- **24 new questions from Week 5 class recordings** (Class 8 & Class 9)
  - Chapter 10: 3 questions (Bacillus cereus, HACCP hazard types, critical limits)
  - Chapter 11: 10 questions (cleaning order, D-Limer, PPM, hard water, sanitizer types, 3-compartment sink, chemical labeling, degreasers)
  - Chapter 12: 3 questions (PCO, damaged packages, air curtains)
  - Chapters 13-14: 8 questions (FDA/USDA/CDC roles, local enforcement, USDA stamps, SC Dept of Agriculture)
- **Total questions now: 219** (up from 195)

### Changed
- **Consolidated 19 categories into 7** balanced categories:
  - Food Safety Basics (46 Q), Temperature Control (34 Q), Sanitation & Hygiene (27 Q+), Foodborne Illness (22 Q+), Facilities & Operations (19 Q+), Food Storage (9 Q), Training (6 Q)
- Updated category icons for new consolidated names
- Fixed badge catalog to show Chapters and Quizzes badge categories (were missing from display)

### Fixed
- **Exam Focus button invisible in dark mode** — text color changed from theme-dependent to fixed dark color
- **Badge notification not dismissing on tap inside badge** — removed stopPropagation that blocked clicks
- **Chapter stats not tracking** — added chapterStats to handleAnswer and reset functions
- **Progress section showing mismatched data** — old 19 categories had many with 0-2 questions

---

## [02-12-2026-2] - February 12, 2026

### Changed
- **CLAUDE.md rewritten** to match FlooringXP documentation standards:
  - Added Business Context, Student Workflow diagram, Technical Overview
  - Added Architecture section (no build step, data flow, state management, auth, theming)
  - Added Convex Backend section (functions summary, database tables, question schema)
  - Added Code Style Guidelines, Git Workflow, Multi-Device Development
  - Added Known Issues & Workarounds table, Important Files Reference
  - Restructured from flat list format to comprehensive project guide

### Added
- **plan.md** - Development roadmap matching FlooringXP documentation standards:
  - Current status and recent versions
  - Complete development progress checklist (all features marked completed)
  - Active work items section
  - Short-term, mid-term, and long-term goals
  - Question bank history table
  - Full version history table
  - Cross-references to all documentation files

### Why
- Match documentation standards established in FlooringXP project
- Enable multi-device development with comprehensive context transfer
- Ensure Claude Code can quickly understand project state from any device

---

## [02-12-2026-1] - February 12, 2026

### Added
- **Comprehensive Documentation**
  - **README.md** - Project overview, features, architecture, deployment, database schema, key components
  - **CHANGELOG.md** - Complete version history from initial build to current (all 14+ versions documented)
  - **ARCHITECTURE.md** - Technical deep dive covering:
    - Technology stack and data flow
    - Frontend/backend architecture
    - State management and theming system
    - Authentication and synchronization
    - Live test system implementation
    - Performance optimizations
    - Known limitations and future enhancements
  - **Updated CLAUDE.md** - Added documentation section, updated features list, corrected question count to 195
  - **Updated CONVEX_SETUP.md** - Fixed outdated Convex URL and question count

### Changed
- Version format now uses actual date (02-12-2026-1) instead of previous date references
- All documentation files cross-reference each other for easy navigation

### Why
- Enable multiple AI tools and devices to understand full project context
- Document all changes, bug fixes, and design decisions for future reference
- Provide comprehensive technical documentation for maintenance and onboarding

---

## [02-09-2026-13] - February 12, 2026

### Added
- **Professor Account System**
  - `isProf` optional boolean field in `users` table schema
  - `users:toggleProf` Convex mutation to flag accounts
  - Professor accounts excluded from `users:getClassStats` query
  - Professor accounts excluded from `tests:getTestLeaderboard` query
  - Purple "Prof" badge displayed next to professor names in student list
  - Toggle button in student detail modal to mark/unmark professor accounts
  - Admin summary stats (Students, Avg Accuracy, Total Answers) exclude professor accounts
  - Deployed schema changes to Convex

### Changed
- `getAllStudents` query now returns `isProf` flag for each student
- Student dashboard summary calculations filter out professor accounts

---

## [02-09-2026-12] - February 12, 2026

### Added
- "Back to Tests" button on finished test view in admin Live Test tab
- Dark mode support for Live Test leaderboard row highlights
- CSS classes for leaderboard rows (`.leaderboard-row-0/1/2`) with dark variants

### Fixed
- **Admin Live Test dark mode issues:**
  - `text-blue-600`, `text-blue-800`, `text-red-500`, `text-red-700` now visible in dark mode
  - Leaderboard row backgrounds (gold/blue/orange) now use semi-transparent colors in dark mode
  - Modal overlay darkened in dark mode
- **Admin Live Test navigation:**
  - Added back button when viewing past finished tests (previously could only create "New Test" which cleared view)

---

## [02-09-2026-11] - February 12, 2026

### Changed
- **Class stats polling:** Changed from single fetch on login to polling every 5 seconds
- `useEffect` for `getClassStats` now sets up interval with cleanup

### Why
- Ensures class statistics stay fresh as students answer questions in real-time
- Matches live test polling pattern (3s) for consistent real-time experience

---

## [02-09-2026-10] - February 12, 2026

### Fixed
- **Admin dark mode - student detail modal:**
  - `bg-orange-50`, `bg-purple-50` stat card backgrounds now use semi-transparent colors
  - `bg-yellow-50` and `border-yellow-200` badge chips now visible
  - `bg-gray-200` progress bar track updated for dark mode
  - Modal overlay background darkened

### Added
- Dark mode CSS overrides for colored background utilities in student modal

---

## [02-09-2026-9] - February 12, 2026

### Fixed
- **Admin dark mode - Backup & Recovery section:**
  - Gradient header (`bg-gradient-to-r from-blue-50 to-green-50`) now adapts to dark theme
  - "Recommended" badge background and text color visible in dark mode
  - Button text colors (`text-green-800`, `text-red-600`, `border-red-300`) adjusted
  - Colored background utilities (`bg-blue-50`, `bg-green-50`, `bg-red-50`, `bg-green-100`) themed

### Added
- CSS overrides for gradient backgrounds in dark mode
- Dark mode support for colored text and borders used in admin buttons

---

## [02-09-2026-8] - February 12, 2026

### Changed
- Avatar menu button size increased from 40px to 52px for better visibility

---

## [02-09-2026-7] - February 12, 2026

### Changed
- Login screen avatar image changed from `assets/chef-greeting.jpg` to `assets/headshot_20260210.png`
- Consistent chef rat branding across login and account menu

---

## [02-09-2026-6] - February 12, 2026

### Changed
- Account menu avatar replaced inline SVG with actual image (`assets/headshot_20260210.png`)
- Avatar displays cute cartoon chef rat with toque and orange neckerchief
- Used `<img>` element with `object-fit: cover` and `borderRadius: '50%'`

---

## [02-09-2026-5] - February 9, 2026

### Added
- **Admin dark/light/system themes**
  - Theme toggle button in header (☀️/🌙/💻)
  - CSS variables for all color values
  - Separate localStorage key (`chefKitchenAdminTheme`)
  - Theme state in AdminApp component
  - CSS overrides for Tailwind utility classes in dark mode
  - `@media (prefers-color-scheme: dark)` fallback for system theme
  - Theme applied before React renders to prevent flash

### Changed
- Admin header now includes theme toggle between version and Preview button
- All colors use CSS variables for dynamic theming

---

## [02-09-2026-4] - February 9, 2026

### Added
- Chef rat avatar in account menu (replaced orange circle with initial)
- Inline SVG with ears, chef hat, face, eyes, nose, whiskers, smile
- 36x36px avatar in 40px circular button with gradient background

---

## [02-09-2026-3] - February 9, 2026

### Added
- **32 New Questions** (IDs 164-195):
  - **18 questions from Quiz #2** (Chapters 5-7):
    - Receiving and storage procedures
    - Temperature danger zones
    - Thermometer calibration
    - FIFO and food rotation
  - **14 questions from Chapter 10 lecture**:
    - HACCP system (7 principles)
    - Active Managerial Control (AMC)
    - Variance requirements
    - Crisis management and recalls

### Fixed
- `questions-original.js` variable name corrected to `var originalQuestionsDB` (was `var questionsDB`)
- Duplicate footer code removed from `questions-original.js`
- "Reset to Original" button now correctly pushes 195 questions instead of 0

### Changed
- Total question count: 163 → 195
- All new questions marked `examFocus: true`
- Question bank now covers all 15 chapters comprehensively

### Documentation
- Memory file updated with lesson: `questions-original.js` must use `var originalQuestionsDB`, not `var questionsDB`

---

## [02-09-2026-2] - February 9, 2026

### Added
- Consolidated version string into `version.js` shared between index.html and admin.html
- `var APP_VERSION = "02-09-2026-2";`

### Changed
- `index.html` now loads version from `version.js` via script tag
- `admin.html` now loads version from `version.js` via script tag
- Removed inline `APP_VERSION` constants from both HTML files

### Fixed
- Version strings now stay in sync automatically

---

## [02-09-2026-1] - February 9, 2026

### Added
- Version string display in admin header (replacing "Back to App" button)
- Format: `v MM-DD-YYYY-BUILD` (e.g., "v 02-09-2026-1")

### Removed
- "Back to App" button from admin header (redundant with "Preview Study App")

---

## [02-08-2026-X] - February 8, 2026

### Added
- **Live Test System** (admin and student side)
  - Professor can create timed tests with custom parameters
  - Test creation: name, mode (examFocus, chapter, quizGroup), timer (5-60 min)
  - Test lifecycle: waiting → active → finished
  - Student polling (3s) for active tests
  - Live leaderboard with real-time updates (3s polling)
  - Countdown timer with client-side tracking
  - Test history and past test review
  - Delete test functionality
  - Medal indicators (🥇🥈🥉) for top 3
  - Colored row highlights for top performers
  - Speed-based tiebreaking (faster = higher rank)

- **Convex Backend for Live Tests**
  - `liveTests` table with status indexing
  - `testResults` table with compound indexes
  - 8 mutations and queries in `convex/tests.ts`:
    - `createTest`, `startTest`, `endTest`, `submitAnswer`, `deleteTest`
    - `getActiveTest`, `getTestLeaderboard`, `getTestHistory`, `getTestDetail`

### Changed
- Admin interface now has 3 tabs: Questions, Students, Live Test
- Student app shows live test overlay when test is active
- Test answers submit immediately (no hint option during tests)

---

## [02-07-2026-X] - February 7, 2026

### Added
- **User System and Cloud Sync**
  - Gamer name + first name authentication (no passwords)
  - Cross-device progress synchronization via Convex
  - Identity check on idle timeout (30 min on shared devices)
  - "Personal device" toggle to skip re-auth
  - Progress merge logic (cloud wins, but preserve local bests)
  - Debounced sync (2s) after each answer
  - Reset progress with automatic archiving

- **Convex Backend**
  - 4 new tables: `users`, `userProgress`, `progressArchives`, `liveTests`
  - 10 queries and mutations in `convex/users.ts`:
    - `register`, `login`, `syncProgress`, `resetProgress`, `checkGamerName`
    - `getProgress`, `getAllStudents`, `getStudentDetail`, `getClassStats`, `getStudentArchives`

- **Professor Dashboard** (admin.html)
  - Students tab with full student list
  - Student detail modal:
    - Overall stats (accuracy, answered, streaks, badges)
    - Per-chapter performance (15 chapters)
    - Per-category performance with color-coded bars
    - Badge progress grid
    - Reset history archives with timestamps
  - CSV export of student data
  - Search and sort functionality

- **Class Stats Card** (student app)
  - Shows class-wide statistics
  - Class average accuracy vs personal accuracy
  - Color-coded comparison (green if above, orange if below)
  - Expandable per-category class averages
  - Graceful offline fallback

- **Account Menu** (student app)
  - Avatar icon in upper right (replaces footer-based theme toggle)
  - Dropdown menu:
    - Signed in as {displayName}
    - Theme selector (System/Light/Dark)
    - Personal device toggle
    - Reset progress button
    - Sign out button
  - Visible on both HomeScreen and QuizScreen

### Changed
- Student app now requires login before showing study modes
- Progress persists across devices when logged in
- localStorage used as cache, Convex as source of truth

---

## [02-06-2026-X] - February 6, 2026

### Added
- Dark mode support for student app
- Light mode support for student app
- System theme detection
- Theme toggle in footer
- CSS variables for all colors (`--bg-primary`, `--bg-card`, `--text-primary`, etc.)
- Smooth theme transitions
- Theme preference saved to localStorage (`chefKitchenTheme`)

### Changed
- All hardcoded colors replaced with CSS variables
- Badge cards, quiz screen, home screen, and modals now theme-aware

---

## [01-XX-2026] - January 2026

### Added (Initial Build)
- **Core Study App Features:**
  - 163 study questions across 15 ServSafe chapters
  - Multiple study modes:
    - Exam Focus
    - Single Chapter (1-15)
    - Quiz Groups (1-4, 5-7, 8-10, 11-14, 15)
    - Chapter Ranges
    - All Questions
    - Category-based
  - Hint system (tracks usage, impacts badges)
  - Detailed explanations after answering
  - Question history tracking (never repeat in same session)
  - Progress statistics (accuracy, streaks, category/chapter breakdown)

- **Gamification:**
  - 15 achievement badges:
    - Perfect Start, First Steps, Getting Started
    - Streak Master (5, 10, 20 correct in a row)
    - No Hint Warrior
    - Category Mastery (all categories 80%+)
    - Chapter Mastery (all chapters 80%+)
    - Speed Demon (50 questions in one session)
    - Early Bird, Night Owl, Weekend Warrior
    - Exam Ready (all exam focus 90%+)
  - Confetti celebration animations for new badges
  - Badge progress tracking (locked/unlocked states)

- **Admin Interface:**
  - Question management (add, edit, delete)
  - Search and filter by category, chapter, exam focus
  - Category manager (add/remove categories)
  - Bulk export/import (JSON)
  - Backup and restore functionality
  - "Reset to Original" button (loads from questions-original.js)
  - Network status indicator

- **Convex Integration:**
  - Cloud question database
  - Real-time sync (admin changes appear on student side)
  - Offline fallback to localStorage cache
  - Network status indicator (Live/Connecting/Offline)

- **PWA Features:**
  - Progressive Web App manifest
  - Service worker for offline support
  - Install to home screen
  - Responsive design (mobile, tablet, desktop)
  - Fast loading with localStorage caching

- **Question Bank:**
  - 163 questions covering:
    - Food safety fundamentals
    - Personal hygiene
    - Cross-contamination
    - Time and temperature control
    - Cleaning and sanitizing
    - Facility design
    - Pest management
    - HACCP principles
    - Regulatory compliance
  - All questions include:
    - Question text
    - 4 multiple choice options
    - Correct answer
    - Helpful hint (doesn't give away answer)
    - Detailed explanation
    - Category tag
    - Chapter number (1-15)
    - Exam focus flag

### Technical Stack
- React 18 (via CDN, no build step)
- Tailwind CSS (via CDN)
- Convex backend
- localStorage for caching
- GitHub Pages deployment
- No passwords or sensitive data

---

## Notes

### Version Format
- `MM-DD-YYYY-BUILD` where BUILD increments for same-day changes
- Example: `02-09-2026-1`, `02-09-2026-2`, etc.
- Reset build to 1 on new date

### Question Bank History
- **Initial:** 163 questions (Jan 2026)
- **02-09-2026-3:** 195 questions (added 32 from Quiz #2 and Ch 10 lecture)
- **02-15-2026-1:** 219 questions (added 24 from Class 8 & 9 recordings)
- **02-15-2026-2:** 251 questions (added 32 from Quiz #3 & #4)
- **02-20-2026-1:** 298 questions (added 47 from Class #10 exam review)
- **02-20-2026-2:** 342 questions (added 44 from Class #11 practice exam & Mock Exam docx)

### Known Issues
- Convex deployment shows benign warning about unknown `deployment` property in `convex.json` (ignore it)
- Question content changes require "Reset to Original" button in admin to sync to Convex (not automatic)

### Future Enhancements
- Migrate from HTTP polling to Convex SDK for WebSocket-based real-time updates
- Additional gamification features
- More detailed analytics for professor
- Printable study guides
- Mobile app versions (iOS/Android)
