# CLAUDE.md - Chef's Kitchen Multi-Course Study PWA

This file provides context and rules for Claude Code when working on the Chef's Kitchen study app project.

> **Always read these files at session start:**
> - [README.md](./README.md) — Project overview, features, deployment
> - [ARCHITECTURE.md](./ARCHITECTURE.md) — Technical deep dive (data flow, components, theming)
> - [CHANGELOG.md](./CHANGELOG.md) — Version history
> - [plan.md](./plan.md) — Current development roadmap and status

---

## Business Context

### What is Chef's Kitchen?

**Chef's Kitchen** is a Progressive Web App (PWA) study tool for culinary courses at **Trident Technical College (TTC)**. It supports multiple courses with gamified quiz-based learning, flashcards, cloud sync, and professor tools.

### Supported Courses

| Course | Content | Questions |
|--------|---------|-----------|
| **CUL-104: ServSafe** | Food Safety Manager Certification — 15 chapters, 7 categories | 342 quiz questions |
| **CUL-105: Kitchen Fundamentals** | Culinary techniques, ingredients, history — 18 topics, 6 categories | 340 quiz + 223 flashcards (563 total) |

### The Users

| Role | App Usage |
|------|-----------|
| **Students** | Primary users - study questions, flashcards, take quizzes, track progress, compete on leaderboards |
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
│  2. SELECT COURSE                                                │
│     CUL-104: ServSafe  |  CUL-105: Kitchen Fundamentals          │
│     Course selector at top of home screen                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. CHOOSE STUDY MODE                                            │
│     CUL-104: Exam Focus | Chapter | Quiz Group | Category | All  │
│     CUL-105: Midterm Focus | Topic | Flashcards | Category | All │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. STUDY                                                        │
│     Quiz: Read question → Select answer → View explanation       │
│     Flashcards: View term → Tap to flip → See definition         │
│     Progress synced to cloud every 2 seconds                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technical Overview

- **Current Version:** 03-29-2026-7
- **Framework:** React 18 via CDN (no build step, no JSX)
- **Styling:** Tailwind CSS via CDN + CSS variables for theming
- **Backend:** Convex Cloud (production: `cautious-monitor-526.convex.cloud`)
- **Deployment:** GitHub Pages (static hosting)
- **Database:** 8 Convex tables (questions, categories, metadata, users, userProgress, progressArchives, liveTests, testResults)
- **User Base:** College classroom (~30 students)
- **Total Questions:** 905 (342 CUL-104 + 563 CUL-105)

---

## Project Structure

```
ServSafePWA/
├── index.html                  # Student study app (main PWA, ~4800+ lines)
├── admin.html                  # Professor dashboard (~2260 lines)
├── questions.js                # CUL-104 question bank (342 questions, var questionsDB)
├── questions-original.js       # CUL-104 backup (var originalQuestionsDB)
├── questions-cul105.js         # CUL-105 question bank (563 items, var questionsCUL105)
├── questions-cul105-original.js # CUL-105 backup (var originalQuestionsCUL105)
├── version.js                  # Shared APP_VERSION constant
├── manifest.json               # PWA manifest
├── assets/                     # Images (chef-*.jpg themed illustrations, headshot_20260210.png)
├── convex/
│   ├── schema.ts               # Database schema (8 tables)
│   ├── users.ts                # User queries/mutations
│   ├── tests.ts                # Live test functions
│   ├── questions.ts            # Question CRUD (course-scoped)
│   └── seed.ts                 # Initial seed script (historical)
├── CLAUDE.md                   # This file - project guide for Claude Code
├── plan.md                     # Development roadmap and status
├── README.md                   # Project overview, features, deployment
├── CHANGELOG.md                # Detailed version history
├── ARCHITECTURE.md             # Technical deep dive
├── PLAN-user-system.md         # Original user system plan (archived, completed)
└── CONVEX_SETUP.md             # Initial Convex deployment guide
```

---

## Multi-Course Architecture

### Course Configuration

Defined in `index.html` as the `COURSES` object:

| Field | CUL-104 | CUL-105 |
|-------|---------|---------|
| `orgType` | `'chapters'` (numbered 1-15) | `'topics'` (named) |
| `hasExamFocus` | Yes | Yes (labeled "Midterm Focus") |
| `hasQuizGroups` | Yes (Quiz 1-4, Final) | No |
| `hasFlashcards` | No | Yes (topic-based decks) |
| Questions file | `questionsDB` | `questionsCUL105` |

### Per-Course Data Separation

- **Progress:** Nested format `{ "CUL-104": {...}, "CUL-105": {...} }` — each course has independent stats
- **Badges:** Per-course `{ "CUL-104": { earned: [...] }, "CUL-105": { earned: [...] } }` — course-specific + shared badges
- **Badge definitions:** Each badge has `course: 'shared' | 'CUL-104' | 'CUL-105'`
- **Questions:** Separate JS files loaded via `<script>` tags
- **Cloud sync:** Entire nested progress object synced; Convex functions accept optional `course` parameter

### CUL-105 Question Structure

Each CUL-105 question has additional fields beyond CUL-104:
- `topic` — Topic name (e.g., "Knife Skills & Cuts", "Stocks & Sauces")
- `type` — `"quiz"` or `"flashcard"`
- `course` — `"CUL-105"` (optional, used in Convex)

### CUL-105 Topics (18)

Cooking Methods, Moist-Heat & Combination, Meat Cooking & Doneness, Stocks & Foundations, Sauces & Thickeners, Eggs & Breakfast, Dairy Products, Grains Rice & Pasta, Vegetables & Potatoes, Flavors & Seasoning, Food Safety & Sanitation, Knife Skills & Cuts, Tools & Equipment, Mise en Place, Measurements & Math, Food Costing & Purchasing, Professionalism, Culinary History

### CUL-105 Study Material Sources

Questions generated from study materials in Dropbox: `/Users/lelandlong/Library/CloudStorage/Dropbox/Personal/TTC/CUL-105/`
- `StudyGuide/Study Material Culinary 105 Hawkins.docx` — Main midterm study guide (examFocus: true)
- `StudyGuide/*.docx` — Sauce classifications, soup classifications, grains, culinary giants, movements, Maillard reaction
- `MeasurementStudyGuide/*.docx` — Volume, weight, metric conversions, culinary math
- `OnCookingPowerpoints/*.ppt` — 15 PowerPoints from "On Cooking" textbook (extracted via olefile binary parsing)
- `AdditionalPowerpoints/*.pptx` — Costing 101, Building Blocks of Flavor, Mercer Knives
- `Recipe packet CUL 105.docx` — Specific dish techniques
- `Yield + conversion factor reference.docx` — Yield and conversion formulas

---

## Development Workflow

### Making Changes

1. Edit files (`index.html`, `admin.html`, `convex/*.ts`, `questions-*.js`, etc.)
2. If Convex schema/functions changed: `npx convex deploy --yes`
3. Update `version.js` (increment build number or date)
4. Update `CHANGELOG.md` with changes
5. **Update ALL relevant MD files** (CLAUDE.md, plan.md, README.md)
6. Test locally by opening HTML files in browser
7. Commit in VSCode
8. Push to GitHub → GitHub Pages auto-deploys

### Version Number Format

**File:** `version.js` — shared between `index.html` and `admin.html`

- **Format:** `MM-DD-YYYY-BUILD` (e.g., "03-29-2026-7")
- Increment the build number for same-day changes
- Reset build to 1 on a new date

### Convex Deployment

When schema or backend functions change:

```bash
npx convex deploy --yes
```

- **Non-interactive flag:** `--yes` is required (no prompts)
- **Benign warning:** `convex.json` shows warning about unknown `deployment` property — ignore it
- **Question sync:** Content changes in question JS files do NOT auto-sync to Convex. Admin must click "Reset to Original" to push to cloud.
- **Course-scoped operations:** `bulkImport` and `resetToOriginal` only affect the specified course's questions

### Adding CUL-105 Questions

1. Edit `questions-cul105.js` — add questions with proper format (id, question, options, correct, hint, explanation, category, topic, chapter: null, examFocus, type)
2. Quiz IDs continue from last quiz ID; flashcard IDs continue from last flashcard ID
3. Copy to backup: `sed 's/var questionsCUL105/var originalQuestionsCUL105/' questions-cul105.js > questions-cul105-original.js`
4. Bump version, update CHANGELOG

---

## State Management

**Student App** uses React `useState` hooks in the root `App` component:
- `screen` — 'home' | 'quiz'
- `progress` — Nested per-course progress object
- `badges` — Nested per-course badge object
- `activeCourse` — 'CUL-104' | 'CUL-105'
- `user` — User object or null
- `theme` — 'light' | 'dark' | 'system'
- `classStats` — Class averages from Convex (per-course)
- `activeTest` / `testScreen` — Live test state

**Derived values (recomputed on render):**
- `courseProgress` — `progress[activeCourse]`
- `courseBadges` — `badges[activeCourse]`
- `courseQuestions` — filtered from active course's question file
- `courseFlashcards` — filtered for type === 'flashcard'
- `courseConfig` — `COURSES[activeCourse]`

**localStorage Keys:**
- `chefKitchenProgress` — nested per-course progress object
- `chefKitchenBadges` — nested per-course badge object
- `chefKitchenActiveCourse` — selected course ID
- `chefKitchenUser` — user object
- `chefKitchenTheme` — theme string
- `chefKitchenPersonalDevice` — boolean
- `chefKitchenLastActive` — timestamp
- `chefKitchenPendingSync` — boolean

---

## Key Features

### Student App (`index.html`)
- **Multi-course support** with course selector at top of home screen
- **CUL-104:** 342 quiz questions, 15 chapters, quiz groups, chapter ranges
- **CUL-105:** 340 quiz + 223 flashcards, 18 study topics, flashcard decks by topic
- **Exam/Midterm Focus** buttons filter to professor-emphasized content
- User accounts with cross-device cloud sync
- Per-course badges with course-specific achievements (topic mastery, flashcard milestones, chapter completion)
- Class-wide statistics (polled every 5s) with performance comparison
- Live timed tests with countdown and leaderboard
- Dark/light/system themes
- Offline resilience (pending sync flag, auto-retry on reconnect)
- PWA version checking & auto-update banner

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
4. **Update `CLAUDE.md`** if project context changed (new features, patterns, courses)
5. **Update `README.md`** if features or deployment changed
6. **Ask the user** for permission to commit
7. **User commits in VSCode** and pushes to GitHub

### Multi-Device Development

The developer works from multiple devices using VSCode with Claude Code extension (previously Claude desktop app).

**Important implications:**
- Keep `CLAUDE.md`, `plan.md`, and `CHANGELOG.md` up-to-date — these are the primary context transfer mechanism between devices
- Documentation should contain enough context that Claude can quickly understand where the project left off
- Assume the next session may be on a different device with no memory of the previous session

---

## Known Issues & Workarounds

| Issue | Workaround |
|-------|------------|
| `convex.json` warns about unknown `deployment` property | Ignore — benign warning |
| Question changes in JS files don't auto-sync to Convex | Admin must click "Reset to Original" to push to cloud |
| Tailwind dark mode requires `!important` overrides | Explicit CSS overrides for each utility class used |
| No TypeScript on frontend | Runtime errors possible — test in browser |
| Single HTML file architecture (~4800+ lines) | Trade-off: simplicity vs. modularity |
| CUL-105 .ppt files are old binary format | Use `olefile` Python module to extract text |

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `index.html` | Student study app (main PWA, ~4800+ lines) |
| `admin.html` | Professor dashboard (~2260 lines) |
| `version.js` | Shared `APP_VERSION` constant |
| `questions.js` | CUL-104 question bank (342 questions, `var questionsDB`) |
| `questions-original.js` | CUL-104 backup (`var originalQuestionsDB`) |
| `questions-cul105.js` | CUL-105 question bank (563 items, `var questionsCUL105`) |
| `questions-cul105-original.js` | CUL-105 backup (`var originalQuestionsCUL105`) |
| `convex/schema.ts` | Database schema (8 tables, course/topic/type fields) |
| `convex/users.ts` | User queries/mutations (course-aware stats) |
| `convex/tests.ts` | Live test functions (course field on tests) |
| `convex/questions.ts` | Question CRUD (course-scoped bulk operations) |
| `manifest.json` | PWA manifest |

---

## Course Information

| | CUL-104 | CUL-105 |
|---|---------|---------|
| **Course** | ServSafe | Kitchen Fundamentals |
| **Institution** | Trident Technical College | Trident Technical College |
| **Target** | ServSafe Manager Certification Exam | Midterm + Final Exam |
| **Organization** | 15 chapters, 7 categories | 18 topics, 6 categories |
| **Questions** | 342 quiz | 340 quiz + 223 flashcards |
| **Exam Focus** | Quiz-specific (Q1-4, Q5-7, etc.) | Midterm study guide (200 items) |

---

## Maintainer

**Primary Developer:** Leland Long
**AI Assistant:** Claude (Anthropic) — VS Code Claude Code extension
**Last Updated:** March 29, 2026
