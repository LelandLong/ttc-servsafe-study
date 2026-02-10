# Plan: User System, Cloud Sync, Professor Dashboard, Class Stats & Live Tests

## Context

All student progress currently lives in `localStorage` only — lost on device/browser change. This plan adds a full user system to Convex enabling cross-device sync, professor analytics, class comparisons, and live timed tests. Uses 3-second polling for the live test feature now, with a future migration path to the Convex SDK client for true real-time.

---

## Phase 1: Convex Backend

### Files
- `convex/schema.ts` — add 4 new tables
- `convex/users.ts` — **new file**, user CRUD + progress sync + class stats
- `convex/tests.ts` — **new file**, live test management

### Schema Additions (`convex/schema.ts`)

**`users` table:**
```
gamerName: v.string()        // Stored LOWERCASE, displayed as-is
firstName: v.string()        // Stored LOWERCASE
displayName: v.string()      // Original casing of gamerName for display
createdAt: v.number()
lastActiveAt: v.number()
Index: by_gamerName on ["gamerName"]
```

**`userProgress` table:**
```
userId: v.id("users")
progress: v.any()            // Full progress object (dynamic keys)
badges: v.array(v.string())  // Earned badge IDs
lastSyncedAt: v.number()
Index: by_userId on ["userId"]
```

**`progressArchives` table:**
```
userId: v.id("users")
progress: v.any()            // Snapshot of progress at time of reset
badges: v.array(v.string())  // Snapshot of badges
archivedAt: v.number()       // When the reset occurred
resetNumber: v.number()      // 1st reset, 2nd reset, etc.
Index: by_userId on ["userId"]
```

**`liveTests` table:**
```
testId: v.string()           // Unique test identifier
name: v.string()             // Test name (e.g., "Quiz 1 - Chapters 1-4")
mode: v.string()             // Study mode key (examFocus, chapter, quizGroup, etc.)
modeValue: v.optional(v.any())  // Mode parameter (chapter number, quiz group, etc.)
questionIds: v.array(v.number()) // Specific question IDs for this test
timerMinutes: v.number()     // Duration (5, 10, 15, 30, etc.)
status: v.string()           // "waiting" | "active" | "finished"
createdAt: v.number()
startedAt: v.optional(v.number())  // When professor hit Start
endedAt: v.optional(v.number())    // When timer expired or professor stopped
Index: by_status on ["status"]
```

**`testResults` table:**
```
testId: v.string()
userId: v.id("users")
answers: v.array(v.object({
  questionId: v.number(),
  selectedAnswer: v.number(),
  correct: v.boolean(),
  answeredAt: v.number()
}))
score: v.number()            // Running correct count
totalAnswered: v.number()    // Running total answered
finishedAt: v.optional(v.number())
Index: by_testId on ["testId"]
Index: by_testId_userId on ["testId", "userId"]
```

### Convex Functions — `convex/users.ts`

**Mutations:**
| Function | Purpose |
|----------|---------|
| `register(gamerName, firstName)` | Store names as `.toLowerCase()`, store `displayName` as original casing. Check uniqueness on lowercase gamerName. Create user + empty userProgress. |
| `login(gamerName, firstName)` | Lookup by `gamerName.toLowerCase()`. Compare `firstName.toLowerCase()`. Update `lastActiveAt`. Return userId + displayName. |
| `syncProgress(userId, progress, badges)` | Upsert userProgress. Update `lastActiveAt`. |
| `resetProgress(userId)` | Archive current progress to `progressArchives` (increment resetNumber). Clear userProgress to empty. |
| `checkGamerName(gamerName)` | Return `{ available: boolean }` using lowercase comparison. |

**Queries:**
| Function | Purpose |
|----------|---------|
| `getProgress(userId)` | Return userProgress doc |
| `getAllStudents()` | Join users + userProgress → summary list for professor |
| `getStudentDetail(userId)` | User + full progress + badges + archive history |
| `getClassStats()` | Aggregate averages across all students |
| `getStudentArchives(userId)` | Return all progressArchives for a student, sorted by archivedAt |

### Convex Functions — `convex/tests.ts`

**Mutations:**
| Function | Purpose |
|----------|---------|
| `createTest(name, mode, modeValue, questionIds, timerMinutes)` | Create test with status "waiting". Generate unique testId. |
| `startTest(testId)` | Set status="active", startedAt=now, compute endedAt from timer |
| `endTest(testId)` | Set status="finished", endedAt=now |
| `submitAnswer(testId, userId, questionId, selectedAnswer, correct)` | Append to testResults.answers, update score/totalAnswered |
| `deleteTest(testId)` | Remove test + all its results |

**Queries:**
| Function | Purpose |
|----------|---------|
| `getActiveTest()` | Return test where status="waiting" or "active" (for student polling) |
| `getTestLeaderboard(testId)` | Join testResults + users → sorted by score desc, then by speed |
| `getTestHistory()` | Return all finished tests for professor review |
| `getTestDetail(testId)` | Test info + all results with student names |

---

## Phase 2: Student App Auth & Account (`index.html`)

### Add `convexMutation` helper (~line 422)
Same pattern as `admin.html` lines 64-75, posting to `/api/mutation`.

### User storage (~line 1574)
```
USER_KEY = 'chefKitchenUser'       // { userId, gamerName, displayName, firstName }
USER_LAST_ACTIVE = 'chefKitchenLastActive'  // Epoch millis timestamp
PERSONAL_DEVICE = 'chefKitchenPersonalDevice'  // boolean
```

### Identity check on load (idle timeout)
On app load, if user exists in localStorage:
- Check `USER_LAST_ACTIVE` timestamp
- If > 30 minutes since last activity AND `PERSONAL_DEVICE` is not true:
  - Show a quick prompt: "Are you still **{displayName}**?" with Yes/No buttons
  - **Yes** → continue as that user, update last active
  - **No** → clear user, show login screen
- If < 30 minutes or personal device → auto-continue
- Update `USER_LAST_ACTIVE` on every answer and periodically

### AuthScreen component (~before HomeScreen)
Ratatouille-themed, matching existing app style.

**"Choose" mode:**
- Chef Whiskers welcome graphic
- "New Chef? Create Account" button
- "Returning Chef? Sign In" button

**"Signup" mode:**
- Gamer Name input (real-time availability check via `users:checkGamerName` on lowercase)
- First Name input
- "Create Account" button
- On success: if pre-existing local progress, prompt "Upload your existing progress?"

**"Login" mode:**
- Gamer Name + First Name inputs (accept any casing)
- "Sign In" button
- On success: pull cloud progress, merge with local (cloud wins, union badges, max of best streaks)

### Account Menu (upper right corner)
Replace the current footer-based theme toggle with an **account icon button** in the upper right.

- Shows a user avatar icon (or first letter of gamer name in a circle)
- On click: dropdown/popover menu with:
  - **Signed in as {displayName}** (header, non-clickable)
  - **Theme:** System / Light / Dark (cycle or sub-options)
  - **This is my personal device** (toggle — skips identity check)
  - **Reset Progress** (with confirmation)
  - **Sign Out**
- Styled consistently with the app theme (dark mode aware)
- Visible on both HomeScreen and QuizScreen

### Progress sync
- **`syncProgressToCloud(userId, progress, badges)`** — 2-second debounce
- Called after each answer in `handleAnswer` (~line 3007)
- Called after reset in `handleResetProgress` (via `users:resetProgress` which archives first)
- On page load with existing user: fetch cloud progress in background, merge

### Merge strategy (on login/reconnect)
- Cloud wins for most fields
- Take `Math.max` of `bestStreak`, `bestNoHintStreak`
- Union of badge arrays (never lose a badge)
- Boolean OR for `studiedEarly`, `studiedLate`, `studiedWeekend`
- If local has higher `totalAnswered` → local is more recent, use local but keep cloud bests

---

## Phase 3: Class-Wide Stats (`index.html`)

### ClassStatsCard component
On HomeScreen, between hint tracker and achievements sections.

- "X students studying" count
- Class avg accuracy vs your accuracy (color-coded: green if above, orange if below)
- Visual comparison bar
- Expandable: per-category class averages vs yours
- Only renders if data loaded (graceful offline fallback)

### Data fetching
`useEffect` in App: when user exists, call `users:getClassStats`, set state.

---

## Phase 4: Live Timed Test System

### Student side (`index.html`)

**Polling mechanism:**
- When user is logged in, poll `tests:getActiveTest()` every 3 seconds
- When a test with status "waiting" or "active" is found → show test UI
- Stop polling when in a test or when no user

**Test screen (replaces/overlays normal app):**

**"Waiting" state** (test created but not started):
- "Prepare for Test" header with test name
- Shows which questions/mode will be tested
- Timer duration shown
- "Waiting for professor to start..." with animated dots
- Continue polling until status changes to "active"

**"Active" state** (test in progress):
- Countdown timer prominently displayed (top bar)
- Questions presented one at a time (similar to QuizScreen but streamlined)
- Each answer immediately submitted via `tests:submitAnswer`
- No hints available during tests
- Progress: "Question X of Y"
- Running score display
- When timer expires (computed client-side from `startedAt` + `timerMinutes`): stop accepting answers, show results

**"Finished" state:**
- "Test Complete!" with final score
- Mini leaderboard showing top 5 (fetched from `tests:getTestLeaderboard`)
- "Return to Study" button → back to normal app
- Late joiners: if they open app after test started, they join with remaining time

### Professor side (`admin.html`)

**New tab or section: "Live Test"** (alongside Questions and Students tabs)

**Test Creation:**
- Test name input
- Study mode selector (same options as student app: Exam Focus, Chapter, Quiz Group, etc.)
- Timer selector: 5, 10, 15, 20, 30, 45, 60 minutes (or custom)
- "Create Test" button → calls `tests:createTest` → moves to waiting state

**Waiting state:**
- Shows test details, # of connected students (from polling `tests:getTestLeaderboard` which returns 0 results)
- Big "START TEST" button
- "Cancel" button

**Active state (live leaderboard):**
- Countdown timer
- Real-time leaderboard table (polls every 3 seconds):
  - Rank, Gamer Name, Score, Questions Answered, Accuracy %
  - Color-coded rows (top 3 highlighted)
  - Auto-sorts by score desc, then by speed
- "End Test Early" button

**Finished state:**
- Final leaderboard (frozen)
- Stats summary: average score, highest score, completion rate
- "Show to Class" button (could make leaderboard full-screen for projector)
- "New Test" button → create another

### Test history
- Professor can review past tests from the Students tab or a dedicated section
- Each past test shows: date, name, duration, participants, leaderboard

---

## Phase 5: Professor Dashboard (`admin.html`)

### Tab navigation
Add `activeTab` state to AdminApp: `'questions' | 'students' | 'livetest'`
Tab buttons in header, styled to match admin theme.

### StudentDashboard component (Students tab)
- **Summary bar:** total students, class avg accuracy, total questions answered
- **Student table:** gamer name, first name, questions answered, accuracy %, badges earned, last active
- **Sortable columns** (click header)
- **Search/filter** by name
- **"View Details"** button → StudentDetailModal
- **"Export CSV"** button → downloads `chef-kitchen-students-YYYY-MM-DD.csv`

### StudentDetailModal
- Student header: display name, first name, joined, last active
- Overall stats: accuracy, total answered, streaks
- Per-chapter scores: 15 chapters with accuracy bars
- Per-category scores: list with accuracy bars
- Badges grid: earned/locked
- **Archive section:** "Previous Progress (before resets)" — expandable list of archived snapshots with dates, showing stats at each reset point

### CSV Export
Columns: Gamer Name, First Name, Questions Answered, Accuracy %, Badges Earned, Last Active.
Creates blob → triggers download.

---

## Phase 6: Version Bump

- Update `APP_VERSION` in `index.html` line 357 to `"02-09-2026-1"`

---

## Files Changed Summary

| File | Change | Scope |
|------|--------|-------|
| `convex/schema.ts` | Modify | Add 4 tables: users, userProgress, progressArchives, liveTests, testResults |
| `convex/users.ts` | **New** | 10 functions: user CRUD, progress sync, class stats, archives |
| `convex/tests.ts` | **New** | 8 functions: test CRUD, leaderboard, answer submission |
| `index.html` | Modify | AuthScreen, account menu, convexMutation, sync logic, ClassStatsCard, test polling + test screen, identity check, version bump |
| `admin.html` | Modify | 3-tab navigation, StudentDashboard, StudentDetailModal, CSV export, LiveTest creation/leaderboard |

---

## Implementation Order

Given the scope, recommended build order:

1. **Convex schema + deploy** (all tables at once)
2. **`convex/users.ts`** functions + deploy
3. **`index.html` auth** (AuthScreen, account menu, identity check)
4. **`index.html` progress sync** (cloud read/write, merge logic)
5. **`convex/tests.ts`** functions + deploy
6. **`admin.html` tabs + StudentDashboard** (professor can see students)
7. **`index.html` ClassStatsCard** (student sees class averages)
8. **`admin.html` LiveTest** (professor creates/starts tests)
9. **`index.html` test screen** (student takes tests)
10. **Polish, CSV export, version bump**

---

## Verification Plan

### Auth
- Create account → stored in Convex with lowercase names, displayName preserves casing
- Login with mixed casing → matches correctly
- Refresh within 30 min → auto-login, no prompt
- Wait 30+ min (or simulate) → "Are you still X?" prompt appears
- Toggle "personal device" → skip prompt on reload
- Sign out → clears session, shows login

### Sync
- Answer questions → check Convex dashboard (data appears after 2s debounce)
- Login on new device → cloud progress loads
- Reset progress → archive created in Convex, progress cleared
- Professor sees archive in student detail

### Class Stats
- Multiple students with progress → ClassStatsCard shows averages
- Student accuracy compared to class average with color coding

### Live Test
- Professor creates test → students see "Prepare for Test" within 3 seconds
- Professor starts → countdown begins for everyone
- Students answer → leaderboard updates on admin every 3 seconds
- Timer expires → test stops for everyone, final leaderboard shown
- Late joiner → sees test with remaining time

### Dashboard
- All students visible with correct stats
- Detail modal shows per-chapter/category breakdown
- Archive section shows historical resets
- CSV exports valid file

### Future: Convex SDK Migration
When ready, replace HTTP `fetch` calls with Convex client SDK for true WebSocket-based real-time subscriptions. This would eliminate polling for live tests and enable instant data sync everywhere. The Convex functions (queries/mutations) would remain unchanged — only the client-side calling mechanism changes.
