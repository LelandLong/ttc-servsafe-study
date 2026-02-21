# Changelog

All notable changes to the Chef's Kitchen ServSafe PWA project.

Format: `MM-DD-YYYY-BUILD`

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
