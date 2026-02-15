# Chef's Kitchen ServSafe PWA - Development Plan

**Last Updated:** February 12, 2026
**Current Version:** 02-12-2026-2

---

## Related Documentation

- [CLAUDE.md](./CLAUDE.md) - Project guide, architecture, code patterns
- [README.md](./README.md) - Project overview, features, deployment
- [CHANGELOG.md](./CHANGELOG.md) - Detailed version history
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical deep dive

---

## Current Status

### Recent Versions
- **02-12-2026-2** - Documentation standardization (CLAUDE.md rewrite, plan.md created)
- **02-12-2026-1** - Comprehensive documentation (README, CHANGELOG, ARCHITECTURE)
- **02-09-2026-13** - Professor account system (isProf flag, excluded from stats/leaderboards)
- **02-09-2026-3** - 32 new questions (Quiz #2 + Chapter 10 lecture, total: 195)

---

## Development Progress

### Completed Features

**Core Study App (January 2026):**
- [x] 195 study questions across 15 ServSafe chapters
- [x] 6 study modes (Exam Focus, Chapter, Quiz Groups, Chapter Ranges, Category, All)
- [x] Hint system with usage tracking
- [x] Detailed explanations after answering
- [x] Question history (no repeats in same session)
- [x] Progress statistics (accuracy, streaks, category/chapter breakdown)

**Gamification (January 2026):**
- [x] 15 achievement badges (Perfect Start, Streak Master, Category Mastery, etc.)
- [x] Confetti celebration animations for new badges
- [x] Badge progress tracking (locked/unlocked states)

**User System & Cloud Sync (February 7, 2026):**
- [x] Gamer name + first name authentication (no passwords)
- [x] Cross-device progress sync via Convex (2s debounce)
- [x] Identity check on idle timeout (30 min on shared devices)
- [x] "Personal device" toggle to skip re-auth
- [x] Progress merge logic (cloud wins, union badges, max streaks)
- [x] Reset progress with automatic archiving

**Class Statistics (February 7, 2026):**
- [x] Class-wide statistics card on home screen
- [x] Class average accuracy vs personal accuracy (color-coded)
- [x] Per-category class averages (expandable)
- [x] Polling every 5 seconds for real-time updates

**Live Test System (February 8, 2026):**
- [x] Professor creates timed tests with custom parameters
- [x] Test lifecycle: waiting → active → finished
- [x] Student polling (3s) for active tests
- [x] Countdown timer with client-side tracking
- [x] Live leaderboard with real-time updates (3s polling)
- [x] Medal indicators and colored row highlights for top 3
- [x] Speed-based tiebreaking (faster = higher rank)
- [x] Test history and past test review

**Professor Dashboard (February 7-9, 2026):**
- [x] 3-tab admin interface: Questions | Students | Live Test
- [x] Full question CRUD with search/filter
- [x] Student dashboard with stats, search, sort
- [x] Student detail modal (per-chapter, per-category, badges, archives)
- [x] CSV export of student data
- [x] Professor account flagging (isProf — excluded from stats)
- [x] Live test creation/management with real-time leaderboard
- [x] Backup & Recovery (JSON export/import, reset to original)

**Theming (February 6-9, 2026):**
- [x] Dark/light/system themes for student app
- [x] Dark/light/system themes for admin app
- [x] CSS variables with Tailwind override strategy
- [x] Theme applied before React renders (no flash)
- [x] Dark mode fixes for all colored backgrounds and text

**PWA Features (January 2026):**
- [x] Progressive Web App manifest
- [x] Service worker for offline support
- [x] Install to home screen
- [x] Responsive design (mobile, tablet, desktop)

**Question Bank Updates (February 9, 2026):**
- [x] 32 new questions added (Quiz #2 + Chapter 10 lecture)
- [x] Total: 195 questions covering all 15 chapters
- [x] All new questions marked examFocus: true

**Documentation (February 12, 2026):**
- [x] README.md - Project overview, features, deployment, schema
- [x] CHANGELOG.md - Complete version history (14+ versions)
- [x] ARCHITECTURE.md - Technical deep dive (850 lines)
- [x] CLAUDE.md - Rewritten to match documentation standards
- [x] plan.md - Development roadmap (this file)

**Infrastructure:**
- [x] Convex backend with 8 tables and 25 functions
- [x] Shared version.js between index.html and admin.html
- [x] GitHub Pages deployment
- [x] questions-original.js backup for admin reset functionality

---

## Active Work Items

### Recently Completed
- [x] Documentation standardization (CLAUDE.md rewrite, plan.md creation)
- [x] Professor account system (isProf flag)
- [x] All dark mode fixes (student + admin apps)

### No Active Development
The app is feature-complete for the current semester. All planned features have been implemented and are working in production.

---

## Known Issues & Bugs

### Minor
- **Convex.json warning** — Benign warning about unknown `deployment` property (ignore)
- **Question sync** — Changes in `questions.js` require manual "Reset to Original" in admin
- **Dark mode Tailwind** — Requires explicit `!important` CSS overrides for each utility class

### No Critical Issues
The app is stable and in active use by students.

---

## Short-Term Goals (Next Sprint)

### High Priority
1. [ ] Add new questions as professor provides them (from upcoming quizzes/lectures)
2. [ ] Monitor student usage and fix any reported issues

### Medium Priority
1. [ ] Consider adding "Quiz of the Day" or daily challenge feature
2. [ ] Add more detailed analytics for professor (question difficulty based on class accuracy)

---

## Mid-Term Goals (1-3 Months)

### Feature Enhancements
1. [ ] Migrate from HTTP polling to Convex SDK for WebSocket-based real-time updates
   - Would eliminate 3s/5s polling for live tests and class stats
   - Convex functions remain unchanged — only client calling mechanism changes
2. [ ] Add per-question difficulty tracking (based on class accuracy)
3. [ ] Add time-per-question analytics
4. [ ] Printable study guides (export to PDF)
5. [ ] Adaptive quizzing (focus on weak areas automatically)

### Technical Debt
1. [ ] Consider modularizing the single HTML files (extract components to separate .js files)
2. [ ] Add TypeScript to frontend (requires build step)
3. [ ] Replace `var` with `const`/`let` throughout
4. [ ] Improve error handling for Convex API failures

---

## Long-Term Goals (3-6 Months)

### Potential Enhancements
1. [ ] Mobile app versions (React Native wrapper for iOS/Android)
2. [ ] Push notifications for live tests
3. [ ] Study group features (shared progress, challenges)
4. [ ] Head-to-head quiz mode (multiplayer)
5. [ ] Student progress over time (charts/graphs)
6. [ ] Email notifications for professor (weekly class summary)

### Architecture Evolution
- **Convex SDK migration** is the highest-priority technical improvement
- Could enable instant updates for live tests (no 3-second delay)
- Better offline support with Convex client-side caching
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed future architecture notes

---

## Question Bank History

| Date | Count | Change |
|------|-------|--------|
| January 2026 | 163 | Initial question bank |
| February 9, 2026 | 195 | +32 from Quiz #2 and Chapter 10 lecture |

---

## Version History

| Version | Date | Key Changes |
|---------|------|-------------|
| 02-12-2026-2 | Feb 12, 2026 | Documentation standardization (CLAUDE.md, plan.md) |
| 02-12-2026-1 | Feb 12, 2026 | Comprehensive documentation (README, CHANGELOG, ARCHITECTURE) |
| 02-09-2026-13 | Feb 12, 2026 | Professor account system (isProf) |
| 02-09-2026-12 | Feb 12, 2026 | Admin Live Test dark mode fixes, back button |
| 02-09-2026-11 | Feb 12, 2026 | Class stats polling (5s interval) |
| 02-09-2026-10 | Feb 12, 2026 | Admin student detail modal dark mode fixes |
| 02-09-2026-9 | Feb 12, 2026 | Admin Backup & Recovery dark mode fixes |
| 02-09-2026-8 | Feb 12, 2026 | Avatar menu button size increase |
| 02-09-2026-7 | Feb 12, 2026 | Login screen avatar image update |
| 02-09-2026-6 | Feb 12, 2026 | Account menu avatar with actual image |
| 02-09-2026-5 | Feb 9, 2026 | Admin dark/light/system themes |
| 02-09-2026-4 | Feb 9, 2026 | Chef rat avatar in account menu |
| 02-09-2026-3 | Feb 9, 2026 | 32 new questions (195 total) |
| 02-09-2026-2 | Feb 9, 2026 | Consolidated version.js |
| 02-09-2026-1 | Feb 9, 2026 | Version string in admin header |
| 02-08-2026 | Feb 8, 2026 | Live test system (student + admin) |
| 02-07-2026 | Feb 7, 2026 | User system, cloud sync, professor dashboard, class stats |
| 02-06-2026 | Feb 6, 2026 | Dark/light/system themes |
| 01-XX-2026 | Jan 2026 | Initial build (163 questions, core study app, admin, PWA) |

See [CHANGELOG.md](./CHANGELOG.md) for detailed change descriptions.

---

## Notes

- The app is **feature-complete** for the Spring 2026 semester
- Professor may request new questions as the course progresses through chapters
- Live test feature is actively used during class sessions
- All student progress is backed up in Convex cloud
- GitHub Pages deployment is instant after push to main branch
