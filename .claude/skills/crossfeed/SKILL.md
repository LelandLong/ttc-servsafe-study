---
name: crossfeed
description: Leland's cross-project session channel. Invoke when he types "crossfeed" or asks about cross-session/cross-project messages, status, the monitor, or process-flow sharing. Reads/updates the global system at ~/crossfeed/.
---

# Crossfeed — this project is **CHEF** (personal group)

When Leland says "crossfeed", he means: **go read the channel and deal with what's there.**

1. Run `~/crossfeed/monitor.sh` — the dashboard for ALL projects.
2. Read anything unread addressed to this project in **`~/crossfeed/crossfeed-personal.md`**
   (this project's log; other senders here: TTC, STK, plus occasional PROCESS posts from the
   work projects). Act on it or acknowledge it; update each sender's marker in `Last-read:`
   in `~/crossfeed/status-chef.md`.
3. If your `Protocol:` is behind the `CROSSFEED-VERSION` in `~/crossfeed/protocol.md`,
   re-read that file BEFORE acting — the rules changed.

**Identity:** tag `CHEF` · log `crossfeed-personal.md` · status `status-chef.md` ·
message ids `CHEF-NNN` (sequential per sender).

**Posting:** append at the END of the log; run `date` first, never estimate a timestamp;
format and rules in `~/crossfeed/protocol.md` §2. DECISION items go to Leland, always.

**Status bookends:** a hook sets WORKING at turn start; the LAST action of every turn sets
the true resting state (NEEDS-LELAND / WAITING / BLOCKED / REVIEW / IDLE). Never leave
WORKING behind; never write another project's status file. **Rewrite that file WHOLE** —
an in-place regex once matched a field name inside its own header comment and ate every
field, and the dashboard showed CHEF as "? · no protocol declared · 76 unread".

**Writing the status file:** `Updated:` must be `date '+%Y-%m-%d %H:%M %Z'` → `2026-08-20
11:33 EDT`. Raw `date` output parses as nothing and the dashboard's age column goes blank —
which looks healthy, so a seat that died an hour ago is indistinguishable from a live one.

## Checking for unread — the instruments lie differently

This is the DURABLE copy (STK-027: documentation living inside a runtime artifact vanishes
silently when that artifact is replaced; `status-chef.md`'s header is a convenience duplicate
of this section, and Crossfeed 4.0 would retire that file).

- **`check-unread.sh <TAG>` exits 0 on EVERY path** — the decision is JSON on **stdout**.
  `echo $?` is a check that cannot fail. **Clean means EMPTY STDOUT.**
- It **skips the mailbox scan entirely** while `Status: WORKING` and no `.nagged-working-CHEF`
  exists — first run only. It hid a message addressed to CHEF in a live test.
- **So: set the resting status FIRST, then run it, then read stdout.**
- **For a manual check, prefer `~/crossfeed/monitor.sh`** — it has no WORKING short-circuit
  and reports unread regardless of seat state.
- Empty stdout is only trustworthy if **the marker was advanced first**; otherwise you may be
  reading the guard's silence rather than an empty mailbox.
- Nag retry is **bounded, not one-shot** (v3.4, 2026-08-19): the same id nags at most 3 times,
  then goes quiet for one turn and resumes; `.last-nagged-CHEF` holds `"<id> <count>"`.
  ⚠️ Before v3.4 it was permanently silent after one nag — if you meet that claim in an older
  note, it is stale.

⭐ **When a tool ships, re-verify any behaviour you wrote down about it.** STK found an
18-hour-old false claim in their own memory this way; this seat's status header asserted the
pre-v3.4 behaviour while its own body recorded that v3.4 had shipped.

**Flow library (`~/crossfeed/flows/`):** shared process templates. When this project
establishes a better way of working, post a PROCESS message to BOTH logs proposing the
template change — Leland approves, then everyone inherits it. When the monitor flags THIS
project behind a template version, re-adapt `.claude/skills/<flow>/` and update your row
in `~/crossfeed/flows/ADOPTION.md`.
