# Claude Instructions for ServSafe PWA

## Documentation

**Comprehensive project documentation is available:**
- **README.md** - Project overview, features, deployment, current state
- **CHANGELOG.md** - Detailed version history with all changes, bug fixes, features
- **ARCHITECTURE.md** - Technical deep dive (data flow, components, theming, auth, sync, live tests)
- **PLAN-user-system.md** - Original user system implementation plan (archived, completed)
- **CONVEX_SETUP.md** - Initial Convex deployment guide

**Read these files first to understand the project before making changes.**

---

## Development Workflow

**IMPORTANT:** After making any changes to files in this project:

1. **UPDATE VERSION NUMBER** - Update `version.js`:
   - Format: `MM-DD-YYYY-BUILD` (e.g., "02-07-2026-1", "02-07-2026-2" for second build same day)
   - Increment the build number if same day, otherwise reset to 1
   - `version.js` is shared between `index.html` and `admin.html`
2. **Remind the user to commit via VSCode** - Changes are not live until committed
3. **User publishes to GitHub Pages** - This deploys the changes
4. **Refresh the browser** - To see the updated app
5. **UPDATE CHANGELOG.md** - Document changes in CHANGELOG.md with version number and description

The deployment flow is:
```
Claude makes changes → Update version.js → Update CHANGELOG.md → User commits in VSCode → Push to GitHub → GitHub Pages deploys → Refresh browser
```

## Project Overview

- **Purpose:** CUL 104 ServSafe exam study aid for Trident Technical College
- **Theme:** Ratatouille-inspired rat chef character
- **Deployed at:** GitHub Pages (user's repository)
- **Database:** Convex cloud (production: `cautious-monitor-526.convex.cloud`)

## Key Files

- `index.html` - Main study app (PWA) - ~4200 lines
- `admin.html` - Question management interface for professor - ~2000 lines
- `version.js` - Shared `APP_VERSION` constant (currently: 02-12-2026-1)
- `questions.js` - Local questions database (195 questions, chapters 1-15, var questionsDB)
- `questions-original.js` - Backup for admin "Reset to Original" button (var originalQuestionsDB)
- `convex/schema.ts` - Database schema (8 tables)
- `convex/users.ts` - User queries/mutations (10 functions)
- `convex/tests.ts` - Live test functions (8 functions)
- `convex/questions.ts` - Question CRUD (7 functions)

## Features

**Student App:**
- 195 study questions across 15 ServSafe chapters
- Multiple study modes: exam focus, chapter, quiz groups, chapter ranges, category, all
- User accounts with cross-device cloud sync
- Badge/achievement system (15 achievements) with confetti celebrations
- Class-wide statistics with real-time comparison (polling every 5 seconds)
- Live timed tests with leaderboard
- Dark/light/system themes
- PWA features (offline, install to home screen)
- Identity check on idle timeout (30 min on shared devices)
- Personal device option (skip idle check)

**Admin App:**
- 3-tab interface: Questions | Students | Live Test
- Full question CRUD with search/filter
- Student dashboard with stats, detail modal, CSV export
- Professor account flagging (excluded from stats)
- Live test creation/management with real-time leaderboard
- Backup & Recovery (JSON export/import, reset to original)
- Dark/light/system themes

## Convex Deployment

When schema or backend functions change:
```bash
cd ServSafePWA
npx convex deploy --yes
```

**Non-interactive flag:** `--yes` is required for terminal deployments (no prompts).

**Benign warning:** `convex.json` shows warning about unknown `deployment` property - ignore it.

**Important:** Question content changes in `questions.js` do NOT auto-sync to Convex. Admin must click "Reset to Original" button to push questions to cloud.

## Question Schema

Each question has:
- `id` - Unique identifier
- `question` - Question text
- `options` - Array of 4 answer choices
- `correct` - Index of correct answer (0-3)
- `hint` - Study hint (doesn't give away answer)
- `explanation` - Shown after answering
- `category` - Topic category
- `chapter` - Chapter number (1-15)
- `examFocus` - true if professor emphasized for exam
