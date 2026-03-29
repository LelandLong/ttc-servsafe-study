# Chef's Kitchen - ServSafe PWA Study App

A Progressive Web App (PWA) for CUL 104 ServSafe exam preparation at Trident Technical College. Features a Ratatouille-inspired rat chef theme with gamified learning, cloud sync, live tests, and professor dashboard.

**Version:** 02-21-2026-3
**Deployment:** GitHub Pages
**Backend:** Convex Cloud (`https://cautious-monitor-526.convex.cloud`)

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Database Schema](#database-schema)
- [Key Components](#key-components)
- [Development Workflow](#development-workflow)
- [Version History](#version-history)

---

## ✨ Features

### Student Features
- **342 Study Questions** across 15 ServSafe chapters
- **Multiple Study Modes:**
  - Exam Focus (professor-curated)
  - Single Chapter
  - Quiz Groups (1-4, 5-7, 8-10, 11-14, 15)
  - Chapter Ranges
  - Category-based
- **Gamification:**
  - Badge system (15 achievements)
  - Streak tracking
  - Confetti celebrations
  - Progress statistics
- **User Accounts:**
  - Cross-device progress sync
  - Gamer name + first name authentication
  - Personal device option (skip idle timeout)
  - Cloud backup of all progress
- **Class Integration:**
  - Class-wide statistics (polling every 5 seconds)
  - Compare your performance to class average
  - Category and chapter performance comparisons
- **Live Tests:**
  - Real-time timed tests created by professor
  - Countdown timer
  - Live leaderboard
  - Automatic submission and scoring
- **Dark/Light/System Themes** with instant switching
- **PWA Features:**
  - Install to home screen
  - Offline support
  - Responsive design

### Professor Features (admin.html)
- **Question Management:**
  - Add, edit, delete questions
  - Bulk import/export (JSON)
  - Category management
  - Chapter assignment (1-15)
  - Exam focus flagging
  - Search and filter
- **Student Dashboard:**
  - View all students with stats
  - Per-student detail modal:
    - Overall accuracy and stats
    - Per-chapter performance
    - Per-category performance
    - Badge progress
    - Reset history archives
  - Professor account flagging (excluded from stats)
  - Export to CSV
  - Search/sort functionality
- **Live Test System:**
  - Create tests with custom parameters
  - Start/stop tests
  - Live leaderboard during tests
  - Test history and review
  - Past test details
- **Backup & Recovery:**
  - Create JSON backups
  - Restore from backup
  - Reset to original question bank
- **Dark/Light/System Themes**
- **Cloud Sync:**
  - All changes automatically saved to Convex
  - Real-time status indicator

---

## 🏗️ Architecture

### Frontend
- **Framework:** Vanilla JavaScript with React 18 (via CDN)
- **No Build Step:** Direct React.createElement() calls (no JSX)
- **Styling:** Tailwind CSS via CDN + custom CSS variables for theming
- **Storage:** localStorage for caching + session state
- **Cloud:** Convex HTTP API for all backend operations

### Backend (Convex)
- **Database:** 8 tables (questions, categories, metadata, users, userProgress, progressArchives, liveTests, testResults)
- **Functions:** 20+ queries and mutations in TypeScript
- **Deployment:** `npx convex deploy --yes`
- **URL:** https://cautious-monitor-526.convex.cloud

### Data Flow
1. **Question Data:** `questions.js` (195 questions) → loaded on page load → synced to Convex via admin
2. **User Progress:** localStorage → debounced sync to Convex (2s) → merged on login
3. **Class Stats:** Convex query → polled every 5 seconds → displayed in real-time
4. **Live Tests:** Convex polling (3s) → student sees test → answers submit immediately → leaderboard updates (3s)

---

## 📁 Project Structure

```
ServSafePWA/
├── index.html              # Student study app (main PWA)
├── admin.html              # Professor dashboard
├── questions.js            # Main question bank (342 questions, var questionsDB)
├── questions-original.js   # Backup for reset (var originalQuestionsDB)
├── version.js              # Shared APP_VERSION constant
├── manifest.json           # PWA manifest
├── assets/                 # Images (chef-greeting.jpg, headshot_20260210.png, icons)
├── convex/
│   ├── schema.ts           # Database schema (8 tables)
│   ├── users.ts            # User queries/mutations (10 functions)
│   ├── tests.ts            # Live test functions (8 functions)
│   └── questions.ts        # Question CRUD (7 functions)
├── CLAUDE.md               # Project guide for Claude Code
├── plan.md                 # Development roadmap and status
├── CHANGELOG.md            # Detailed version history
├── ARCHITECTURE.md         # Technical deep dive
└── README.md               # This file
```

---

## 🚀 Deployment

### Prerequisites
- Node.js (for Convex deployment)
- GitHub Pages enabled on repository
- Convex account (free tier)

### Initial Setup
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy to Convex:**
   ```bash
   npx convex deploy --yes
   ```

3. **Load questions to Convex:**
   - Open `admin.html` in browser
   - Click "Reset to Original" button (pushes 195 questions to Convex)

4. **Deploy to GitHub Pages:**
   - Commit changes to `main` branch
   - Push to GitHub
   - Changes go live automatically

### Version Update Workflow
1. Make code changes
2. **Update `version.js`:** Increment version (format: `MM-DD-YYYY-BUILD`)
3. Commit changes in VSCode
4. Push to GitHub
5. Refresh browser to see changes

### Convex Deployment
When schema or backend functions change:
```bash
npx convex deploy --yes
```
(Non-interactive flag `--yes` required for terminal deployments)

---

## 🗄️ Database Schema

### Core Tables
- **questions** (342 records)
  - questionId, question, options[], correct, hint, explanation, category, chapter (1-15), examFocus
  - Indexes: by_questionId, by_category, by_chapter

- **categories** (7 consolidated categories)
  - name
  - Index: by_name

- **metadata** (key-value store)
  - key, value (lastUpdated timestamps)
  - Index: by_key

### User System
- **users**
  - gamerName (lowercase), firstName (lowercase), displayName (original casing), isProf (boolean), createdAt, lastActiveAt
  - Index: by_gamerName

- **userProgress**
  - userId, progress (object: totalAnswered, totalCorrect, categoryStats, chapterStats, questionHistory, streaks, badges, study habits), badges[], lastSyncedAt
  - Index: by_userId

- **progressArchives** (reset history)
  - userId, progress, badges, archivedAt, resetNumber
  - Index: by_userId

### Live Test System
- **liveTests**
  - testId, name, mode, modeValue, questionIds[], timerMinutes, status (waiting|active|finished), createdAt, startedAt, endedAt
  - Indexes: by_status, by_testId

- **testResults**
  - testId, userId, answers[] (questionId, selectedAnswer, correct, answeredAt), score, totalAnswered, finishedAt
  - Indexes: by_testId, by_testId_userId

---

## 🧩 Key Components

### Student App (index.html)
- **App** - Root component with auth state
- **AuthScreen** - Login/signup with gamer name + first name
- **IdentityCheckScreen** - 30-min idle timeout on shared devices
- **HomeScreen** - Study mode selection
- **QuizScreen** - Question display with hints and explanations
- **BadgeCelebration** - Confetti animation for new badges
- **AccountMenu** - Avatar dropdown with theme, device settings, reset, sign out
- **ClassStatsCard** - Class-wide performance comparison (polled every 5s)
- **LiveTestScreen** - Waiting/Active/Finished states for timed tests
- **NetworkStatus** - Connection indicator (Live/Connecting/Offline)

### Professor Dashboard (admin.html)
- **AdminApp** - Root with 3-tab navigation (Questions, Students, Live Test)
- **QuestionsTab** - Full CRUD + search/filter + backup/restore
- **StudentDashboard** - Student list with stats, search, CSV export
- **StudentDetailModal** - Individual student deep dive + professor toggle
- **LiveTestPanel** - Create/start/stop tests + live leaderboard
- **BackupRecovery** - JSON export/import + reset to original

---

## 🛠️ Development Workflow

### Making Changes
1. Edit files (index.html, admin.html, convex/*.ts, etc.)
2. If Convex schema/functions changed: `npx convex deploy --yes`
3. Update `version.js` (increment build number or date)
4. Test locally by opening HTML files in browser
5. Commit in VSCode
6. Push to GitHub
7. Refresh deployed site

### Adding Questions
1. Open `admin.html`
2. Click "Add Question" button
3. Fill form (question, 4 options, correct answer index, hint, explanation, category, chapter, exam focus)
4. Click Save
5. Changes auto-sync to Convex
6. Copy `questions.js` to `questions-original.js` and rename variable to `originalQuestionsDB`
7. Update version and commit

### Testing Changes
- **Local:** Open `index.html` and `admin.html` in browser
- **Convex Dashboard:** https://dashboard.convex.dev (view data, logs, functions)
- **GitHub Pages:** Check deployed version after push

---

## 📚 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

**Latest:** 02-21-2026-3
- Offline resilience (pending sync, auto-retry on reconnect)
- PWA version checking & auto-update banner
- 342 total questions (up from 195 as of Feb 12)
- Category consolidation (19 → 7 categories)
- Multiple bug fixes and quality improvements

---

## 🎓 Course Information

- **Course:** CUL 104 - ServSafe
- **Institution:** Trident Technical College
- **Target:** ServSafe Manager Certification Exam
- **Chapters:** 1-15 (full curriculum coverage)
- **Question Bank:** 342 questions (as of 02-20-2026)

---

## 🐭 About the Theme

Inspired by Pixar's *Ratatouille*, featuring a chef rat character learning food safety. The mascot appears on the login screen (`headshot_20260210.png`) and serves as the account avatar.

---

## 🔧 Technical Notes

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- React 18 via CDN (no build required)
- Tailwind CSS 3.x via CDN
- Service worker for PWA features

### Performance
- All data cached in localStorage for instant loads
- Debounced sync (2s) to minimize API calls
- Polling intervals: class stats (5s), live tests (3s)
- Lazy loading of student detail data

### Security
- No passwords (gamer name + first name authentication)
- All data stored in Convex cloud (TLS encrypted)
- Personal device flag to reduce re-auth friction
- Idle timeout on shared computers (30 min)

### Known Issues
- `convex.json` shows benign warning about unknown `deployment` property (can be ignored)
- Question data stored separately from Convex (must use "Reset to Original" to sync changes)

---

## 📝 License

Educational project for Trident Technical College CUL 104.

---

## 👨‍💻 Maintenance

**Primary Developer:** Leland Long
**AI Assistant:** Claude (Anthropic)
**Last Updated:** March 29, 2026
