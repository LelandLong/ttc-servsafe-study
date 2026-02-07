# Claude Instructions for ServSafe PWA

## Development Workflow

**IMPORTANT:** After making any changes to files in this project:

1. **UPDATE VERSION NUMBER** - Before user publishes, update `APP_VERSION` in `index.html` (line ~357)
   - Format: `MM-DD-YYYY-BUILD` (e.g., "02-07-2026-1", "02-07-2026-2" for second build same day)
   - Increment the build number if same day, otherwise reset to 1
2. **Remind the user to commit via VSCode** - Changes are not live until committed
3. **User publishes to GitHub Pages** - This deploys the changes
4. **Refresh the browser** - To see the updated app

The deployment flow is:
```
Claude makes changes → User commits in VSCode → Push to GitHub → GitHub Pages deploys → Refresh browser
```

## Project Overview

- **Purpose:** CUL 104 ServSafe exam study aid for Trident Technical College
- **Theme:** Ratatouille-inspired rat chef character
- **Deployed at:** GitHub Pages (user's repository)
- **Database:** Convex cloud (production: `cautious-monitor-526.convex.cloud`)

## Key Files

- `index.html` - Main study app (PWA)
- `admin.html` - Question management interface for professor
- `questions.js` - Local questions database (163 questions, chapters 1-15)
- `convex/` - Convex cloud database schema and functions

## Features

- Chapter-based study modes (single chapter, quiz groups, chapter ranges)
- Badge/achievement system with confetti celebrations
- Exam focus vs basic knowledge filtering
- Category-based study
- Progress tracking with localStorage
- Cloud sync via Convex

## Convex Deployment

When schema changes are needed:
```bash
cd ServSafePWA
npx convex deploy
```

Choose "Yes" to push to production when prompted.

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
