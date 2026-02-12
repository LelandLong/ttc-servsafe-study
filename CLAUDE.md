# CLAUDE.md - Chef's Kitchen ServSafe PWA Project Guide

This file provides context and rules for Claude Code when working on the ServSafe study app project.

---

## Business Context

### What is Chef's Kitchen?

**Chef's Kitchen** is a Progressive Web App (PWA) study tool for **CUL 104 ServSafe** at **Trident Technical College (TTC)**. It helps culinary students prepare for the ServSafe Manager Certification Exam through gamified quiz-based learning.

### The Users

| Role | App Usage |
|------|-----------|
| **Students** | Primary users - study questions, take quizzes, track progress, compete on leaderboards |
| **Professor** | Admin interface - manage questions, view student progress, run live tests |

### Theme

Ratatouille-inspired rat chef character. The mascot appears on the login screen and serves as the account avatar throughout the app.

---

## Student Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. SIGN IN                                                      │
│     Open app → Create account (gamer name + first name)          │
│     or sign in as returning user                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. CHOOSE STUDY MODE                                            │
│     Exam Focus | Chapter | Quiz Group | Chapter Range |          │
│     Category | All Questions                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. ANSWER QUESTIONS                                             │
│     Read question → Select answer → View explanation             │
│     Optional: Use hint (affects badge progress)                  │
│     Progress synced to cloud every 2 seconds                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         ↓                                         ↓
┌─────────────────────┐                 ┌─────────────────────────┐
│  KEEP STUDYING      │                 │  LIVE TEST              │
│  Track stats,       │                 │  Professor starts test  │
│  earn badges,       │                 │  → students join auto   │
│  compare to class   │                 │  → timed quiz           │
│                     │                 │  → live leaderboard     │
└─────────────────────┘                 └─────────────────────────┘
```

---

## Technical Overview

- **Current Version:** 02-12-2026-2
- **Framework:** React 18 via CDN (no build step, no JSX)
- **Styling:** Tailwind CSS via CDN + CSS variables for theming
- **Backend:** Convex Cloud (production: `cautious-monitor-526.convex.cloud`)
- **Deployment:** GitHub Pages (static hosting)
- **Database:** 8 Convex tables (questions, categories, metadata, users, userProgress, progressArchives, liveTests, testResults)
- **User Base:** College classroom (~30 students)

---

## Project Structure

```
ttc-servsafe-study/
├── index.html              # Student study app (main PWA, ~4200 lines)
├── admin.html              # Professor dashboard (~2000 lines)
├── questions.js            # Main question bank (195 questions, var questionsDB)
├── questions-original.js   # Backup for admin "Reset to Original" (var originalQuestionsDB)
├── version.js              # Shared APP_VERSION constant
├── manifest.json           # PWA manifest
├── assets/                 # Images (chef-greeting.jpg, headshot_20260210.png, icons)
├── convex/
│   ├── schema.ts           # Database schema (8 tables)
│   ├── users.ts            # User queries/mutations (10 functions)
│   ├── tests.ts            # Live test functions (8 functions)
│   └── questions.ts        # Question CRUD (7 functions)
├── CLAUDE.md               # This file - project guide for Claude Code
├── plan.md                 # Development roadmap and status
├── README.md               # Project overview, features, deployment
├── CHANGELOG.md            # Detailed version history
├── ARCHITECTURE.md         # Technical deep dive
├── PLAN-user-system.md     # Original user system plan (archived, completed)
└── CONVEX_SETUP.md         # Initial Convex deployment guide
```

---

## Related Documentation

- [README.md](./README.md) - Project overview, features, deployment, database schema
- [CHANGELOG.md](./CHANGELOG.md) - Detailed version history with all changes
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep dive (data flow, components, theming, auth, sync, live tests)
- [plan.md](./plan.md) - Development roadmap, completed features, next steps
- [PLAN-user-system.md](./PLAN-user-system.md) - Original user system implementation plan (archived, completed)
- [CONVEX_SETUP.md](./CONVEX_SETUP.md) - Initial Convex deployment guide

**Read these files first to understand the project before making changes.**

---

## Development Workflow

### Making Changes

1. Edit files (`index.html`, `admin.html`, `convex/*.ts`, etc.)
2. If Convex schema/functions changed: `npx convex deploy --yes`
3. Update `version.js` (increment build number or date)
4. Update `CHANGELOG.md` with changes
5. Test locally by opening HTML files in browser
6. Commit in VSCode
7. Push to GitHub → GitHub Pages auto-deploys

### Deployment Flow

```
Claude makes changes → Update version.js → Update CHANGELOG.md → User commits in VSCode → Push to GitHub → GitHub Pages deploys → Refresh browser
```

### Version Number Format

**File:** `version.js` — shared between `index.html` and `admin.html`

- **Format:** `MM-DD-YYYY-BUILD` (e.g., "02-12-2026-1", "02-12-2026-2")
- Increment the build number for same-day changes
- Reset build to 1 on a new date

### Convex Deployment

When schema or backend functions change:

```bash
npx convex deploy --yes
```

- **Non-interactive flag:** `--yes` is required (no prompts)
- **Benign warning:** `convex.json` shows warning about unknown `deployment` property — ignore it
- **Question sync:** Content changes in `questions.js` do NOT auto-sync to Convex. Admin must click "Reset to Original" button to push questions to cloud.

---

## Architecture

### No Build Step

Both `index.html` and `admin.html` are self-contained:
- All JavaScript inline in `<script>` tags
- React 18 loaded from CDN (`React.createElement()` — no JSX)
- Tailwind CSS loaded from CDN
- No bundler, no transpilation, no npm scripts for frontend

**Advantages:** Zero build time, instant iteration, works on any static host
**Disadvantages:** No JSX (verbose createElement), no TypeScript on frontend, no code splitting

### Data Flow

| Data | Flow | Timing |
|------|------|--------|
| Questions | `questions.js` → localStorage cache → Convex background fetch → merge | On page load |
| User Progress | Answer → localStorage → 2s debounce → Convex mutation | After each answer |
| Class Stats | Convex query → polled every 5 seconds | While logged in |
| Live Tests | Convex polling every 3 seconds | While logged in |
| Admin Changes | Admin edit → Convex mutation → student sees on next load | On save |

### State Management

**Student App** uses React `useState` hooks in the root `App` component:
- `screen` — 'home' | 'quiz'
- `progress` — Progress object (persisted to localStorage + Convex)
- `badges` — Badge array (persisted to localStorage + Convex)
- `user` — User object or null
- `theme` — 'light' | 'dark' | 'system'
- `classStats` — Class averages from Convex
- `activeTest` / `testScreen` — Live test state

**localStorage Keys:**
- `chefKitchenProgress` — progress object
- `chefKitchenBadges` — badge array
- `chefKitchenUser` — user object
- `chefKitchenTheme` — theme string
- `chefKitchenPersonalDevice` — boolean
- `chefKitchenLastActive` — timestamp

**Admin App** uses `chefKitchenAdminQuestions` and `chefKitchenAdminTheme` for localStorage.

### Authentication

No passwords — gamer name + first name only (case-insensitive matching). Acceptable for low-stakes educational environment.

- 30-minute idle timeout on shared devices (identity check prompt)
- "Personal device" toggle skips idle check
- Cloud progress sync with 2-second debounce
- Merge strategy on login: cloud wins for most fields, `Math.max` for best streaks, union of badges

### Theming

CSS variables approach with dark mode via `[data-theme="dark"]` attribute:
- Light mode: default CSS variables in `:root`
- Dark mode: override variables + Tailwind utility class overrides with `!important`
- System theme: `@media (prefers-color-scheme: dark)` fallback
- Theme applied before React renders to prevent flash

---

## Convex Backend

### Functions Summary

| File | Functions | Purpose |
|------|-----------|---------|
| `convex/users.ts` | 10 (5 queries, 5 mutations) | User CRUD, progress sync, class stats, archives, prof toggle |
| `convex/tests.ts` | 8 (4 queries, 4 mutations) | Live test CRUD, leaderboard, answer submission |
| `convex/questions.ts` | 7 (3 queries, 4 mutations) | Question CRUD, bulk upsert, category/chapter filtering |

### Database Tables

| Table | Records | Purpose |
|-------|---------|---------|
| `questions` | 195 | Study questions with options, hints, explanations |
| `categories` | 20+ | Question category names |
| `metadata` | Key-value | Timestamps and config |
| `users` | ~30 | Student accounts |
| `userProgress` | ~30 | Per-user progress objects |
| `progressArchives` | Variable | Reset history snapshots |
| `liveTests` | Variable | Professor-created timed tests |
| `testResults` | Variable | Per-student test answers and scores |

### Question Schema

Each question has:
- `id` — Unique identifier (1-195)
- `question` — Question text
- `options` — Array of 4 answer choices
- `correct` — Index of correct answer (0-3)
- `hint` — Study hint (doesn't give away answer)
- `explanation` — Shown after answering
- `category` — Topic category
- `chapter` — Chapter number (1-15)
- `examFocus` — true if professor emphasized for exam

### Professor Exclusion

When `user.isProf === true`, the account is excluded from:
- `getClassStats()` — not counted in class averages
- `getTestLeaderboard()` — not shown on leaderboard
- Student dashboard summary stats — not counted in totals

---

## Key Features

### Student App (`index.html`)
- 195 study questions across 15 ServSafe chapters
- 6 study modes: Exam Focus, Chapter, Quiz Groups, Chapter Ranges, Category, All
- User accounts with cross-device cloud sync
- 15 achievement badges with confetti celebrations
- Class-wide statistics (polled every 5s) with performance comparison
- Live timed tests with countdown and leaderboard
- Dark/light/system themes
- PWA (offline support, install to home screen)
- Identity check on idle timeout (30 min on shared devices)

### Admin App (`admin.html`)
- 3-tab interface: Questions | Students | Live Test
- Full question CRUD with search/filter
- Student dashboard with stats, detail modal, CSV export
- Professor account flagging (excluded from stats)
- Live test creation/management with real-time leaderboard
- Backup & Recovery (JSON export/import, reset to original)
- Dark/light/system themes

---

## Code Style Guidelines

1. **No JSX** — Use `React.createElement()` throughout
2. **No build step** — Everything runs directly in the browser
3. **Tailwind CSS** — Utility-first styling, with CSS variable overrides for dark mode
4. **State** — React `useState` and `useEffect` hooks (no Redux/Context API)
5. **API calls** — Direct `fetch()` to Convex HTTP API (no SDK)
6. **Naming** — camelCase for JavaScript, lowercase for Convex field storage
7. **Variables** — `var` keyword used throughout (legacy pattern, maintain consistency)

---

## Git Workflow

**NEVER commit without asking.** Do not create commits or push without explicit user approval.

**Pre-commit checklist:**
1. **Update `version.js`** with new version number
2. **Update `CHANGELOG.md`** with changes made
3. **Update `plan.md`** if development status changed
4. **Ask the user** for permission to commit
5. **User commits in VSCode** and pushes to GitHub

### Multi-Device Development

The developer may work from multiple devices using VSCode with Claude extension.

**Important implications:**
- Keep `CLAUDE.md`, `plan.md`, and `CHANGELOG.md` up-to-date — these are the primary context transfer mechanism between devices
- Documentation should contain enough context that Claude can quickly understand where the project left off
- Assume the next session may be on a different device with no memory of the previous session

---

## Known Issues & Workarounds

| Issue | Workaround |
|-------|------------|
| `convex.json` warns about unknown `deployment` property | Ignore — benign warning |
| Question changes in `questions.js` don't auto-sync to Convex | Admin must click "Reset to Original" to push to cloud |
| Tailwind dark mode requires `!important` overrides | Explicit CSS overrides for each utility class used |
| No TypeScript on frontend | Runtime errors possible — test in browser |
| Single HTML file architecture (~4000+ lines) | Trade-off: simplicity vs. modularity |

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `index.html` | Student study app (main PWA, ~4200 lines) |
| `admin.html` | Professor dashboard (~2000 lines) |
| `version.js` | Shared `APP_VERSION` constant |
| `questions.js` | Question bank (195 questions, `var questionsDB`) |
| `questions-original.js` | Backup for reset (`var originalQuestionsDB`) |
| `convex/schema.ts` | Database schema (8 tables) |
| `convex/users.ts` | User queries/mutations (10 functions) |
| `convex/tests.ts` | Live test functions (8 functions) |
| `convex/questions.ts` | Question CRUD (7 functions) |
| `manifest.json` | PWA manifest |

---

## Course Information

- **Course:** CUL 104 - ServSafe
- **Institution:** Trident Technical College
- **Target:** ServSafe Manager Certification Exam
- **Chapters:** 1-15 (full curriculum coverage)
- **Question Bank:** 195 questions (as of 02-09-2026)

---

## Maintainer

**Primary Developer:** Leland Long
**AI Assistant:** Claude (Anthropic)
**Last Updated:** February 12, 2026
