---
name: feature-flow
description: The end-to-end workflow for working a feature / bug fix in the Chef's Kitchen repo (ttc-servsafe-study) — from scoping through branch, code, checks, browser verification, PR, docs, Convex deploy, Pages deploy, and back to main. Follow this every time so Leland doesn't have to re-drive the process. Invoke at the start of feature work; re-read at each phase boundary. Adapted for Chef's Kitchen from the FlooringXP / Scheduler feature-flow skills.
---

# Feature / Bug Workflow (Chef's Kitchen)

> Crossfeed flow adaptation: `feature-flow` template v1.0 (`~/crossfeed/flows/`). This copy
> predates the template and comes from the same FXP/Scheduler family it was distilled from.

Standing process for any feature or fix in this repo. **Drive it end-to-end so Leland doesn't have to prompt each step.** Announce actions as you take them (so he can interrupt), but don't block on a question he already answered. Numbered steps are the flow; the **🔑 rules** are Chef's Kitchen conventions (sourced from `CLAUDE.md` + session history).

> **Golden overrides (these beat the happy path every time):**
> - 🚨 **PRODUCTION HAS REAL USERS.** Convex prod (`cautious-monitor-526`) holds ~30 real student accounts, live progress, badges, recipes. Never seed, reset, bulk-import, or destructively mutate prod data as part of dev work. Read-only queries are always fine; targeted mutations Leland asked for are fine; "clean up while I'm in here" is not.
> - 🔀 **SERVER AHEAD OF CLIENT, NEVER BEHIND.** This repo owns BOTH the Convex backend and the frontend, and they deploy separately: `npx convex deploy --yes` (immediate) vs. merge-to-`main` → GitHub Pages (~1–2 min). If a frontend change calls new/changed Convex functions, **deploy Convex FIRST**, then ship the frontend. Never merge a client that prod validators will reject.
> - 📦 **NEVER COMMIT WITHOUT ASKING** (CLAUDE.md). Exception: once Leland gives an ordered plan or says "commit, merge, push, deploy" / "make it live", **execute the whole chain straight through** — announce each step, never pause mid-chain to re-ask "go?". He'll interrupt to redirect. Per-step approval applies only when there is NO plan.
> - 🔒 **ZERO PRIVATE BYTES IN THE REPO.** This repo is PUBLIC and serves GitHub Pages — anything committed is world-readable. Private content (HOS-190 itinerary, trip info, anything personal) lives ONLY in Convex `privatePages`; source HTML stays in `private/` (gitignored). Private-page **content** updates need no commit and no deploy — just re-push via the script. See `PRIVATE-PAGES.md`.
> - 🎯 **CONVEX CLI TARGETING GOTCHA.** The legacy `convex.json` points at the dev box `good-alpaca-167`, so bare `npx convex run`/`data` silently hit DEV. `.env.local` pins `CONVEX_DEPLOYMENT=prod:cautious-monitor-526`; still pass `--prod` on `convex run` when you mean production, and confirm with a sentinel read (e.g. `convex data users --limit 3` — prod has ~30 real users, dev has `r1test`). A green tick is not evidence you hit the right box.
> - 🧪 **NO BUILD STEP = NO COMPILER SAFETY NET.** React 18 via CDN, `React.createElement` (no JSX), `var` throughout, Tailwind via CDN. The only automated gates are the ones you run: `node --check` on the extracted inline scripts, then a real browser. Match the existing idiom — don't introduce JSX, imports, `let`/`const` module patterns, or a bundler.
> - 📝 **Version bump + CHANGELOG before every commit** — no exceptions (see step 8).
> - ❓ **Question-bank JS changes do NOT auto-sync to Convex.** After editing `questions*.js`, the admin must click "Reset to Original" (course-scoped) to push to the cloud — say so in the summary.
> - 🗣️ **Never invent user-facing copy/UX beyond the ask without checking** — this app has a strong voice (Ratatouille theme, gamification); match it, don't freelance it.
> - 🧾 **Unrelated discoveries get their own tracked item** (a plan.md/CHANGELOG note or a question to Leland), never a ride-along fix on the current branch.
> - 🤝 **Cross-repo division of labor (crossfeed):** the TTC Coursework session (`TTC`) owns HOS-190 class-content truth and DRAFTS private-page HTML into `private/`; this session (`CHEF`) reviews every draft in a real browser, fixes convention violations, and owns ALL pushes and deploys (Convex, Pages, private-page content). Handoffs and reports travel via `~/crossfeed/crossfeed-personal.md` — write them self-sufficient, so the receiving session has zero questions.

---

## Repo map (what you're touching)
| Piece | Stack | Check | Deploy |
|---|---|---|---|
| `index.html` (~5000 lines) | Student PWA — React 18 CDN, no JSX, Convex HTTP API | `node --check` extracted scripts + Playwright | **auto → GitHub Pages** on merge to `main` (`lelandlong.github.io/ttc-servsafe-study/`) |
| `admin.html` (~2400 lines) | Professor dashboard, same stack | same | same |
| `convex/*.ts` | Convex backend (prod `cautious-monitor-526`, dev `good-alpaca-167`) | `npx convex deploy` runs typecheck | **`npx convex deploy --yes`** from this repo — immediate, no CI |
| `questions*.js` | Question banks (CUL-104/105/112) | keep IDs sequential; copy to `-original` backup | commit + Pages, then admin "Reset to Original" to sync cloud |
| `private/` (gitignored) | Private page HTML sources | render locally | `CK_USER_ID=<id> node scripts/push-private-page.mjs <slug> <file> "<Title>" "<emoji>" "<blurb>"` — no commit, no Convex deploy |
| `version.js` / `CHANGELOG.md` / `plan.md` / docs | shared version + paper trail | — | ship with every frontend commit |

## 1. Document first — scope the work
- Restate the ask, list what will change (files, schema, data), and flag anything irreversible (schema changes, data migrations, user-visible behavior shifts). For multi-part work, use TodoWrite as the running plan.
- This repo doesn't use GitHub issues today — the PR body + `CHANGELOG.md` + `plan.md` are the paper trail. If Leland starts using issues, mirror the FlooringXP issue-first discipline.

## 2. Branch + confirm scope
- **Branch from up-to-date `main`**: `git checkout main && git pull`, then `git checkout -b <type>/<slug>` (`feature/` · `fix/` · `refactor/` · `chore/` · `docs/`). Never commit directly to `main`.
- **Ask clarifying questions UP FRONT**, numbered, each `(required)`/`(optional)`. Resolve forks before coding. Once answered / plan given → execute straight through.

## 3. Generate code
- Match surrounding idiom exactly: `React.createElement`, `var`, camelCase JS, Tailwind utility classes with CSS-variable theming (`card-bg`, `text-primary`, dark-mode `!important` overrides), emoji in UI labels stored as `\uXXXX` escapes in existing code.
- State = `useState`/`useEffect` in the root `App`; API = direct `fetch` helpers `convexQuery`/`convexMutation` (no SDK on the frontend).
- Access gating is **server-side**: the client renders only what Convex returns (pattern: `privatePages:list`, `users:getAccess`). Never gate by hiding client-side alone.
- Convex: course-scoped operations take an optional `course` arg; new user flags go on the `users` table as `v.optional(v.boolean())` (additive, no migration). Admin-invoked mutations follow the existing unauthenticated pattern (`toggleProf`-style); anything that must NOT be publicly callable is an `internalMutation` (CLI-only).

## 4. Resolve syntax errors
- Extract and check every inline script: `node --check` on the script bodies of `index.html` and `admin.html` (see Quick reference for the one-liner). IDE diagnostics count too.
- Convex: `npx convex deploy --yes` is itself the typecheck gate — but don't use a prod deploy as a lint run; read the code first.

## 5. Tests / data verification
- No unit-test framework here. Verification = **curl the Convex HTTP API** for backend behavior (positive AND negative cases — e.g. authorized user gets data, unauthorized gets `null`/`[]`) + browser verification (step 6).
- After deploying backend changes, verify against **prod** with real calls, not assumptions.

## 6. Browser verification (MANDATORY for any user-facing change)
- Green syntax checks do NOT substitute for a real browser. Playwright is a devDependency (`npm install`, `npx playwright install chromium` once per machine).
- Pattern: serve the repo (`python3 -m http.server 8123`), `addInitScript` to inject `chefKitchenUser` / `chefKitchenPersonalDevice` into localStorage, load, assert the **actual outcome** (element present, overlay opens, data rendered) — not just "no red screen". Screenshot and LOOK at it. Kill the server when done.
- Verify the negative path too (signed out / unauthorized account sees nothing).
- Multi-course changes: verify the affected courses (CUL-104 vs CUL-105 differ: chapters vs topics, quiz groups, flashcards).

## 7. Ask for feedback + confirm
- Surface what was built + how to test + open questions. **Don't commit yet** unless a straight-through plan is already in force (golden override above).

## 8. Commit, push, create PR — the pre-commit checklist is law
Before every commit, in this order:
1. **`version.js`** — bump to `MM-DD-YYYY-BUILD` (today's date via `date`; increment build for same-day, reset to 1 on a new date).
2. **`CHANGELOG.md`** — new entry for that version: what + why, user-visible first.
3. **`plan.md`** — if development status/roadmap changed.
4. **`CLAUDE.md`** — if project context changed (new features, patterns, courses, tables).
5. **`README.md`** — if features/deployment changed. **`PRIVATE-PAGES.md`** — if the private-pages system changed.
- Commit with a clear subject + body (what/why), ending `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Push branch → `gh pr create --base main` with Summary + Test plan, ending `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

## 9. Review
- No CI and no bot reviewers on this repo — the merge gate is your own verification (steps 4–6) plus Leland. If he wants eyes on it first, hold at the open PR; if the plan says ship, proceed.

## 10. If code changed → back to step 4
- Any post-review change loops through syntax → curl checks → browser → push. Don't merge on stale verification.

## 11. Update docs (continuous)
- Docs are the cross-device memory (Leland works from multiple machines; the next session may have zero context). `CHANGELOG.md`, `plan.md`, `CLAUDE.md`, `README.md`, `PRIVATE-PAGES.md`, `RECIPES-PLAN.md` — whatever the change makes stale, fix in the same commit, not later.

## 12. Deploy — the stages, in order
**Say what stage you're at as you go.** The full chain once approved: **Convex deploy → commit → push → PR → merge → Pages deploy → verify live.**

1. **Convex (backend) — FIRST, before the frontend merges:** `npx convex deploy --yes` → prod `cautious-monitor-526`. Immediate. Verify with a real call (curl the HTTP API or `convex run --prod`), not the success banner. The `convex.json` "unknown property `deployment`" warning is benign.
2. **Data / flags:** any one-off grants or records (e.g. `users:setPrivateAccess`, internal mutations via `npx convex run ... --prod`) — do them now and verify with a read-back.
3. **Private page content:** push via `scripts/push-private-page.mjs` (needs `CK_USER_ID` of an authorized account). Content-only changes END here — no commit, no Pages deploy needed.
4. **Frontend:** merge the PR to `main` (`gh pr merge <PR> --merge --delete-branch=false`) → **GitHub Pages auto-deploys** in ~1–2 min.
5. **Verify live — always:** poll `https://lelandlong.github.io/ttc-servsafe-study/version.js` until it serves the new version, then spot-check the live HTML actually contains the new code (`curl | grep`). Students get the update banner via the app's 30-min version check, or on reload.
6. **Question-bank changes only:** remind Leland (or do it if asked) — admin → "Reset to Original" for the affected course to sync the cloud question set.

## 13. Close the loop
- Report what shipped, what was verified (with evidence), anything deferred, and any follow-up the change created (e.g. "admin.html is still an ungated URL"). If something failed or was skipped, say so plainly.

## 14. Return to main
- `git checkout main && git pull`. Keep the feature branch unless Leland says delete (`--delete-branch=false` on merge). Working tree should end clean.

## 15. Revisit the to-do list — what's next
- Reconcile TodoWrite; surface remaining open items + the next candidate. Confirm direction.

---

## Quick reference
- Syntax check both HTML files:
  `python3 -c "import re,subprocess,tempfile,os
  for f in ('index.html','admin.html'):
      for s in re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', open(f).read(), re.S):
          if len(s.strip())<50: continue
          t=tempfile.NamedTemporaryFile('w',suffix='.js',delete=False); t.write(s); t.close()
          r=subprocess.run(['node','--check',t.name],capture_output=True,text=True)
          print(f,'OK' if r.returncode==0 else r.stderr[:400]); os.unlink(t.name)"`
- Convex: `npx convex deploy --yes` · `npx convex run <fn> '<json>' --prod` · `npx convex data <table> --limit 5` (check which box you hit!)
- Convex HTTP API (prod): `curl -s -X POST https://cautious-monitor-526.convex.cloud/api/query -H "Content-Type: application/json" -d '{"path":"<module:fn>","args":{...},"format":"json"}'`
- Private page: `CK_USER_ID=<userId> node scripts/push-private-page.mjs <slug> private/<file>.html "<Title>" "<emoji>" "<blurb>"`
- PR: `gh pr create --base main` · `gh pr merge <n> --merge --delete-branch=false` · `gh pr view <n> --json state,mergedAt`
- Live check: `curl -s "https://lelandlong.github.io/ttc-servsafe-study/version.js?nc=$RANDOM"`
- Full context: `CLAUDE.md`, `plan.md`, `CHANGELOG.md`, `ARCHITECTURE.md`, `PRIVATE-PAGES.md`, `RECIPES-PLAN.md`.
