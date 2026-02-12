# Architecture Documentation

Technical deep dive into Chef's Kitchen ServSafe PWA implementation.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Data Flow](#data-flow)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [State Management](#state-management)
6. [Theming System](#theming-system)
7. [Authentication](#authentication)
8. [Synchronization](#synchronization)
9. [Live Test System](#live-test-system)
10. [Performance Optimizations](#performance-optimizations)
11. [Known Limitations](#known-limitations)

---

## Technology Stack

### Frontend
- **React 18.2.0** (via CDN)
  - No JSX - uses `React.createElement()` directly
  - No build step required
  - Single HTML file architecture
- **Tailwind CSS 3.x** (via CDN)
  - Utility-first styling
  - Custom CSS variables for theming
  - Dark mode support via `data-theme` attribute
- **Vanilla JavaScript**
  - ES6+ features
  - No transpilation
  - Modern browser targets only

### Backend
- **Convex** (https://convex.dev)
  - TypeScript functions
  - Real-time database
  - HTTP API (fetch-based, no SDK)
  - Free tier (sufficient for this app)

### Deployment
- **GitHub Pages** (static hosting)
- **Git** (version control)
- **VSCode** (primary IDE)

### PWA
- **Service Worker** (`sw.js`) for offline caching
- **Manifest** (`manifest.json`) for install prompt
- **localStorage** for client-side persistence

---

## Data Flow

### Question Data Flow
```
questions.js (local file, 195 questions)
    ↓
index.html loads on page init
    ↓
localStorage cache (immediate display)
    ↓
Convex HTTP query (background fetch)
    ↓
Merge (Convex wins if newer, fallback to local)
    ↓
Display in app
```

### User Progress Flow
```
Student answers question
    ↓
localStorage update (immediate)
    ↓
2-second debounce
    ↓
Convex mutation (syncProgress)
    ↓
Cloud persistence
```

### Admin Changes Flow
```
Professor edits question in admin.html
    ↓
localStorage update (admin side)
    ↓
Convex mutation (updateQuestion)
    ↓
Cloud database updated
    ↓
Student refresh or next load
    ↓
Convex query fetches new questions
    ↓
Student sees updated content
```

### Live Test Flow
```
Professor creates test (admin.html)
    ↓
Convex mutation (createTest) → status: "waiting"
    ↓
Student polling (3s interval) detects test
    ↓
Student shows "Prepare for Test" screen
    ↓
Professor clicks "Start Test"
    ↓
Convex mutation (startTest) → status: "active"
    ↓
Students' polling detects status change → countdown begins
    ↓
Students answer → Convex mutation (submitAnswer) per question
    ↓
Professor's polling (3s) fetches leaderboard → live updates
    ↓
Timer expires OR professor ends test
    ↓
Convex mutation (endTest) → status: "finished"
    ↓
Students see final results + leaderboard
```

---

## Frontend Architecture

### Component Hierarchy (index.html)

```
App (root)
├── NetworkStatus
├── AuthScreen (if not logged in)
│   ├── Choose mode (welcome)
│   ├── Signup mode (create account)
│   └── Login mode (returning user)
├── IdentityCheckScreen (if idle timeout)
├── LiveTestScreen (if active test exists)
│   ├── Waiting (test created, not started)
│   ├── Active (countdown + quiz)
│   └── Finished (results + leaderboard)
├── HomeScreen (main menu)
│   ├── Header (title + account menu)
│   ├── ModeSelector (study mode cards)
│   ├── HintTracker
│   ├── ClassStatsCard (class comparison)
│   └── AchievementsBadges
├── QuizScreen (question display)
│   ├── Header (account menu)
│   ├── QuestionCard
│   ├── HintButton
│   ├── AnswerButtons
│   ├── ExplanationPanel
│   └── Navigation
├── AccountMenu (dropdown)
│   ├── User info
│   ├── Theme toggle
│   ├── Personal device toggle
│   ├── Reset progress
│   └── Sign out
└── BadgeCelebration (confetti overlay)
```

### Component Hierarchy (admin.html)

```
AdminApp (root)
├── NetworkStatus
├── Header
│   ├── Title + stats
│   ├── Theme toggle
│   └── Preview Study App button
├── TabNavigation (Questions | Students | Live Test)
├── QuestionsTab
│   ├── Search + filters
│   ├── Add Question button
│   ├── Question table (paginated)
│   ├── EditModal
│   └── BackupRecovery
├── StudentDashboard
│   ├── Summary stats (filtered for non-prof)
│   ├── Search bar
│   ├── Export CSV button
│   ├── Student table (sortable)
│   └── StudentDetailModal
│       ├── Header (name, joined date)
│       ├── Professor toggle button
│       ├── Overall stats cards
│       ├── Chapter performance grid
│       ├── Category performance list
│       ├── Badges earned
│       └── Reset history archives
└── LiveTestPanel
    ├── Creation form (if no active test)
    ├── Waiting state (start button)
    ├── Active state (leaderboard + countdown + end button)
    ├── Finished state (final leaderboard + new test button)
    └── Test history list
```

### File Structure (No Build)

Both `index.html` and `admin.html` are self-contained:
- All JavaScript inline in `<script>` tags
- All styles inline in `<style>` tags (plus Tailwind CDN)
- React loaded from CDN
- No bundler, no transpilation, no npm scripts for frontend

**Advantages:**
- Zero build time
- Instant iteration (edit → save → refresh)
- No dependency on Node.js for frontend development
- Works on any static host

**Disadvantages:**
- No JSX (verbose `createElement` calls)
- No TypeScript type checking on frontend
- No code splitting (everything loads at once)
- Harder to modularize (all components in one file)

---

## Backend Architecture

### Convex Functions

#### `convex/users.ts` (10 functions)

**Queries:**
- `getProgress(userId)` - Fetch user's synced progress
- `getAllStudents()` - List all users with summary stats (excludes prof if `isProf: true`)
- `getStudentDetail(userId)` - Full user detail + progress + archives
- `getClassStats()` - Aggregate averages (excludes prof accounts)
- `getStudentArchives(userId)` - Reset history
- `checkGamerName(gamerName)` - Availability check (lowercase)

**Mutations:**
- `register(gamerName, firstName)` - Create user + empty progress
- `login(gamerName, firstName)` - Lookup + update lastActive
- `syncProgress(userId, progress, badges)` - Upsert progress doc
- `resetProgress(userId)` - Archive current, clear to empty
- `toggleProf(userId)` - Toggle `isProf` flag

#### `convex/tests.ts` (8 functions)

**Queries:**
- `getActiveTest()` - Return waiting or active test (for student polling)
- `getTestLeaderboard(testId)` - Join results + users, sort by score/speed (excludes prof)
- `getTestHistory()` - List of finished tests
- `getTestDetail(testId)` - Test + all results with names

**Mutations:**
- `createTest(name, mode, modeValue, questionIds, timerMinutes)` - Create test, status="waiting"
- `startTest(testId)` - Set status="active", compute endedAt
- `endTest(testId)` - Set status="finished"
- `submitAnswer(testId, userId, questionId, selectedAnswer, correct)` - Append to testResults
- `deleteTest(testId)` - Remove test + all results

#### `convex/questions.ts` (7 functions)

**Queries:**
- `getAllQuestions()` - Fetch all questions
- `getQuestionsByCategory(category)` - Filter by category
- `getQuestionsByChapter(chapter)` - Filter by chapter

**Mutations:**
- `bulkUpsertQuestions(questions)` - Batch insert/update
- `addQuestion(question)` - Insert new question
- `updateQuestion(id, question)` - Update existing
- `deleteQuestion(questionId)` - Remove question

### Database Schema Details

#### Indexes
- `users.by_gamerName` - Unique lookup for login/registration
- `userProgress.by_userId` - Fast user progress fetch
- `progressArchives.by_userId` - Fetch reset history
- `liveTests.by_status` - Quick active test lookup
- `liveTests.by_testId` - Test ID lookup
- `testResults.by_testId` - Leaderboard fetch
- `testResults.by_testId_userId` - User's test result lookup
- `questions.by_questionId` - ID-based lookup
- `questions.by_category` - Category filtering
- `questions.by_chapter` - Chapter filtering

#### Data Types
- All timestamps are `v.number()` (epoch milliseconds)
- Names stored as lowercase (`gamerName`, `firstName`) for case-insensitive matching
- `displayName` preserves original casing for UI
- `progress` is `v.any()` for flexible schema (dynamic category/chapter keys)
- `badges` is `v.array(v.string())` for badge ID list

---

## State Management

### Student App (index.html)

**Primary State (App component):**
```javascript
const [screen, setScreen] = useState('home');              // 'home' | 'quiz'
const [progress, setProgress] = useState(loadProgress);     // Progress object
const [badges, setBadges] = useState(loadBadges);          // Badge array
const [user, setUser] = useState(loadUser);                // User object or null
const [theme, setTheme] = useState(getInitialTheme);       // 'light' | 'dark' | 'system'
const [classStats, setClassStats] = useState(null);        // Class averages
const [activeTest, setActiveTest] = useState(null);        // Live test object
const [testScreen, setTestScreen] = useState(null);        // 'waiting' | 'active' | 'finished'
```

**Persistence:**
- `chefKitchenProgress` → localStorage (progress object)
- `chefKitchenBadges` → localStorage (badge array)
- `chefKitchenUser` → localStorage (user object)
- `chefKitchenTheme` → localStorage (theme string)
- `chefKitchenPersonalDevice` → localStorage (boolean)
- `chefKitchenLastActive` → localStorage (timestamp)
- Cloud sync via Convex (2s debounce after changes)

### Admin App (admin.html)

**Primary State (AdminApp component):**
```javascript
const [theme, setTheme] = useState(getInitialTheme);           // 'light' | 'dark' | 'system'
const [activeTab, setActiveTab] = useState('questions');       // 'questions' | 'students' | 'livetest'
const [questions, setQuestions] = useState(loadQuestions);     // Question array
const [students, setStudents] = useState([]);                  // Student list
const [selectedStudent, setSelectedStudent] = useState(null);  // Student ID for detail modal
const [currentTest, setCurrentTest] = useState(null);          // Live test object
const [leaderboard, setLeaderboard] = useState([]);            // Test leaderboard
```

**Persistence:**
- `chefKitchenAdminQuestions` → localStorage (question array)
- `chefKitchenAdminTheme` → localStorage (theme string)
- All data also synced to Convex

---

## Theming System

### CSS Variables Approach

Both apps define CSS variables for all colors:

**Light Mode (default):**
```css
:root {
  --bg-primary: #F9FAFB;
  --bg-card: #FFFFFF;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  /* ...etc */
}
```

**Dark Mode (`[data-theme="dark"]`):**
```css
[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-card: #1F2937;
  --text-primary: #F3F4F6;
  --text-secondary: #D1D5DB;
  /* ...etc */
}
```

**System Preference Fallback:**
```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Same as [data-theme="dark"] */
  }
}
```

### Tailwind Override Strategy

Tailwind utility classes hardcode colors. Dark mode overrides:

```css
[data-theme="dark"] .bg-white {
  background-color: var(--bg-card) !important;
}
[data-theme="dark"] .text-gray-800 {
  color: var(--text-primary) !important;
}
/* ...etc for all color utilities used */
```

### Theme State Management

**Apply theme before React renders** (prevents flash):

```javascript
function getInitialTheme() {
  var saved = localStorage.getItem('chefKitchenTheme');
  if (saved && saved !== 'system') return saved;
  return 'system';
}

function applyTheme(theme) {
  var root = document.documentElement;
  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

// Apply BEFORE React mounts
applyTheme(getInitialTheme());
```

**Cycle through themes:**
```javascript
function cycleTheme() {
  var next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
  setTheme(next);
  applyTheme(next);
  localStorage.setItem('chefKitchenTheme', next);
}
```

---

## Authentication

### No Password System

**Why no passwords:**
- Educational environment (low security risk)
- Reduces friction for students
- Matches classroom setting (informal, collaborative)

**2-Field Auth:**
- **Gamer Name:** Unique identifier (case-insensitive)
- **First Name:** Verification field (case-insensitive)

**Flow:**
1. User enters gamer name + first name
2. Lowercase both for lookup: `gamerName.toLowerCase()`, `firstName.toLowerCase()`
3. Store lowercase in DB for uniqueness
4. Store `displayName` with original casing for UI
5. On login: match both fields (case-insensitive)
6. On success: return `userId` + `displayName`
7. Store in localStorage: `{ userId, gamerName, displayName, firstName }`

### Idle Timeout (Shared Computers)

**Purpose:** Prevent students from using each other's accounts on shared lab computers

**Logic:**
```javascript
function needsIdentityCheck() {
  var personalDevice = localStorage.getItem('chefKitchenPersonalDevice') === 'true';
  if (personalDevice) return false; // Skip check on personal device

  var lastActive = parseInt(localStorage.getItem('chefKitchenLastActive') || '0');
  var now = Date.now();
  var thirtyMinutes = 30 * 60 * 1000;

  return (now - lastActive) > thirtyMinutes;
}
```

**Identity Check Screen:**
- Shows: "Are you still **{displayName}**?"
- **Yes** → Continue, update lastActive
- **No** → Clear user, show login

**Personal Device Toggle:**
- Checkbox in account menu: "This is my personal device"
- If checked: skip idle timeout (never ask identity check)
- Stored in localStorage: `chefKitchenPersonalDevice`

---

## Synchronization

### Debounced Sync (Student Progress)

**Problem:** Every answer triggers a sync → too many API calls

**Solution:** 2-second debounce

```javascript
var syncTimeout = null;

function syncProgressToCloud(userId, progress, badges) {
  if (!userId || !CONVEX_URL) return;

  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(function() {
    convexMutation("users:syncProgress", {
      userId: userId,
      progress: progress,
      badges: badges
    }).catch(function(err) {
      console.log('Sync failed:', err.message);
    });
  }, 2000); // Wait 2s after last change
}
```

**When synced:**
- After each answer (2s debounce)
- On page unload (immediate, no debounce)
- After reset (immediate via `users:resetProgress` mutation which archives first)

### Merge Strategy (Login)

**Scenario:** Student logs in on new device

**Merge Logic:**
1. Fetch cloud progress
2. If cloud is empty → upload local
3. If local is empty → use cloud
4. If both exist → merge:
   - Cloud wins for `totalAnswered`, `totalCorrect`, `categoryStats`, `chapterStats`, `questionHistory`
   - Take `Math.max()` for `bestStreak`, `bestNoHintStreak`
   - Union of `badges` arrays (never lose a badge)
   - Boolean OR for `studiedEarly`, `studiedLate`, `studiedWeekend`
   - If local `totalAnswered` > cloud → local is fresher, use local but keep cloud's `best*` values

```javascript
function mergeProgressFromCloud(localProgress, cloudData, localBadges) {
  if (!cloudData || !cloudData.progress) {
    return { progress: localProgress, badges: localBadges };
  }

  var cloudProgress = cloudData.progress;
  var cloudBadges = cloudData.badges || [];

  // Cloud is fresher → use cloud but preserve local bests
  if (cloudProgress.totalAnswered >= localProgress.totalAnswered) {
    return {
      progress: {
        ...cloudProgress,
        bestStreak: Math.max(localProgress.bestStreak || 0, cloudProgress.bestStreak || 0),
        bestNoHintStreak: Math.max(localProgress.bestNoHintStreak || 0, cloudProgress.bestNoHintStreak || 0),
      },
      badges: [...new Set([...localBadges, ...cloudBadges])] // Union
    };
  }

  // Local is fresher → use local but preserve cloud bests
  return {
    progress: {
      ...localProgress,
      bestStreak: Math.max(localProgress.bestStreak || 0, cloudProgress.bestStreak || 0),
      bestNoHintStreak: Math.max(localProgress.bestNoHintStreak || 0, cloudProgress.bestNoHintStreak || 0),
    },
    badges: [...new Set([...localBadges, ...cloudBadges])] // Union
  };
}
```

### Class Stats Polling

**Polling Interval:** 5 seconds

**Cleanup:**
```javascript
useEffect(function() {
  if (!user || !CONVEX_URL) return;

  function fetchStats() {
    convexQuery("users:getClassStats")
      .then(function(stats) { setClassStats(stats); })
      .catch(function() {});
  }

  fetchStats(); // Immediate fetch
  var interval = setInterval(fetchStats, 5000);
  return function() { clearInterval(interval); }; // Cleanup on unmount
}, [user ? user.userId : null]);
```

---

## Live Test System

### Polling Architecture

**Student Side:**
- Poll `tests:getActiveTest()` every 3 seconds
- Stop polling when test screen is active (to avoid interrupting test)
- Resume polling after test finishes

**Professor Side:**
- Poll `tests:getTestLeaderboard(testId)` every 3 seconds while test is active
- Poll `tests:getActiveTest()` every 3 seconds to detect status changes

### Status Lifecycle

**waiting → active → finished**

1. **Professor creates test:**
   - `createTest()` → `{ status: "waiting", testId, questionIds, timerMinutes, ... }`
   - Students see "Prepare for Test" screen

2. **Professor starts test:**
   - `startTest(testId)` → `{ status: "active", startedAt: Date.now(), endedAt: startedAt + (timerMinutes * 60 * 1000) }`
   - Students' countdown begins (computed from `endedAt - Date.now()`)

3. **Timer expires OR professor ends early:**
   - `endTest(testId)` → `{ status: "finished", endedAt: Date.now() }`
   - Students see final results + leaderboard

### Answer Submission

**Immediate submission** (no batching):
```javascript
function handleTestAnswer(selectedAnswer) {
  var question = testQuestions[testIndex];
  var correct = selectedAnswer === question.correct;

  // Submit to Convex immediately
  convexMutation("tests:submitAnswer", {
    testId: activeTest.testId,
    userId: user.userId,
    questionId: question.id,
    selectedAnswer: selectedAnswer,
    correct: correct
  });

  // Update local state
  setTestScore(testScore + (correct ? 1 : 0));
  setTestAnswered(testAnswered + 1);
  setTestIndex(testIndex + 1);
}
```

**Convex stores:**
- Append to `testResults.answers[]`
- Increment `testResults.score` if correct
- Increment `testResults.totalAnswered`

### Leaderboard Sorting

**Sort order:**
1. Score (descending) - higher is better
2. Speed (ascending) - faster is better (last answer timestamp)

```javascript
leaderboard.sort((a, b) => {
  if (b.score !== a.score) return b.score - a.score; // Higher score wins
  if (a.lastAnswerTime && b.lastAnswerTime) {
    return a.lastAnswerTime - b.lastAnswerTime; // Earlier time wins (faster)
  }
  return 0;
});
```

**Display:**
- Rank 1-3: Medal emojis (🥇🥈🥉)
- Rank 1-3: Colored row backgrounds (gold, blue, orange)
- All ranks: Gamer name, score/total, accuracy %

### Professor Exclusion

**isProf flag:**
- When `user.isProf === true`, user is excluded from:
  - `getClassStats()` query (not counted in averages)
  - `getTestLeaderboard()` query (not shown on leaderboard)
  - Student dashboard summary stats (not counted in totals)
- Professor can still:
  - Take tests (answers are submitted and stored)
  - View their own progress
  - See class stats (from student perspective)

---

## Performance Optimizations

### 1. localStorage Caching
- All data cached locally for instant loads
- Cloud fetch happens in background
- Fallback to cache if offline

### 2. Debounced Sync
- Progress sync delayed by 2 seconds
- Prevents excessive API calls during rapid answers
- Immediate sync on page unload

### 3. Polling Intervals
- Class stats: 5 seconds (balance between freshness and load)
- Live tests: 3 seconds (acceptable for real-time feel)
- Stop polling when not needed (e.g., during active test)

### 4. Lazy Data Fetching
- Student detail modal: only fetch when modal opens
- Archives: only fetch when student detail opens
- Test history: only fetch on Live Test tab

### 5. Question Filtering (Client-Side)
- Filter questions by mode in-memory (no backend filtering)
- Shuffle in-memory (no backend randomization)
- Fast iteration through large question banks (195 questions)

### 6. No Build Step
- Instant refresh during development
- No webpack/babel overhead
- Direct browser execution

---

## Known Limitations

### 1. No Real-Time WebSockets
- Currently uses HTTP polling (3-5 second intervals)
- Convex SDK could provide WebSocket-based subscriptions
- Future enhancement: migrate from `fetch()` to Convex client

### 2. No Backend Filtering
- All questions loaded to client
- Filtering done in JavaScript
- Acceptable for 195 questions, may scale poorly beyond 1000+

### 3. No Password Security
- Gamer name + first name authentication is weak
- Acceptable for low-stakes educational use
- Not suitable for sensitive data

### 4. Single HTML File Architecture
- Large files (~4000+ lines)
- Hard to modularize
- No code splitting
- Trade-off: simplicity vs. scalability

### 5. localStorage Limits
- Browser limit: ~5-10MB
- Current usage: <1MB
- Risk if question bank grows 10x+

### 6. No Offline Question Sync
- Admin changes require refresh on student side
- No push notifications for updates
- Service worker caches old versions

### 7. Tailwind Dark Mode Overrides
- Requires explicit `!important` overrides for each utility class
- Brittle if Tailwind classes change
- Better solution: use Tailwind JIT with theme() function (requires build step)

### 8. No TypeScript on Frontend
- Inline JavaScript has no type checking
- Prone to runtime errors
- Trade-off: zero build vs. type safety

---

## Deployment Notes

### Convex Deployment
- **Command:** `npx convex deploy --yes`
- **Non-interactive flag:** Required for terminal deployments (no prompts)
- **Warning:** `convex.json` shows benign warning about unknown `deployment` property (ignore it)
- **Schema changes:** Require deployment before code changes take effect

### GitHub Pages
- **Auto-deploy:** Pushes to `main` branch auto-deploy
- **No build step:** Files deployed as-is
- **Cache:** May need hard refresh (Ctrl+Shift+R) to see changes

### Question Sync
- **Important:** Question content changes in `questions.js` do NOT auto-sync to Convex
- **Manual step:** Admin must click "Reset to Original" button to push questions to cloud
- **Workaround:** Use admin interface to edit questions (auto-syncs to Convex)

---

## Future Architecture Enhancements

### 1. Convex SDK Migration
Replace HTTP fetch with Convex client SDK:
- Real-time subscriptions via WebSocket
- No polling needed
- Instant updates for live tests, class stats, admin changes
- Functions remain unchanged (only client calling method changes)

### 2. Component Modularization
- Extract components to separate `.js` files
- Use ES6 modules (`import`/`export`)
- Requires build step (Vite or similar)

### 3. TypeScript Frontend
- Migrate to `.tsx` files with JSX
- Full type safety across frontend
- Better IDE support

### 4. Mobile Apps
- React Native wrapper for iOS/Android
- Native notifications for live tests
- Offline-first with background sync

### 5. Advanced Analytics
- Per-question difficulty tracking (based on class accuracy)
- Adaptive quizzing (focus on weak areas)
- Time-per-question analytics
- Detailed student progress over time (charts)

### 6. Multiplayer Features
- Study groups with shared progress
- Challenge mode (head-to-head quizzes)
- Class-wide competitions

---

## Security Considerations

### Current State
- No sensitive data (educational content only)
- No passwords (gamer name + first name auth)
- No payment processing
- No PII beyond first name + gamer name
- Convex enforces TLS encryption

### Risks
- Account takeover (if someone knows gamer name + first name)
- Progress manipulation (no server-side validation)
- Cheating on live tests (no proctoring)

### Mitigations
- Acceptable for classroom use (low-stakes)
- Professor can review individual student progress
- Live test leaderboards encourage honest participation
- Reset functionality allows recovery from issues

### Future Hardening (if needed)
- Add email verification
- Add password authentication
- Add CAPTCHA for registration
- Add server-side answer validation (prevent score tampering)
- Add rate limiting (prevent API abuse)

---

**Last Updated:** February 12, 2026
**Maintainer:** Leland Long
