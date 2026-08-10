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
WORKING behind; never write another project's status file.

**Flow library (`~/crossfeed/flows/`):** shared process templates. When this project
establishes a better way of working, post a PROCESS message to BOTH logs proposing the
template change — Leland approves, then everyone inherits it. When the monitor flags THIS
project behind a template version, re-adapt `.claude/skills/<flow>/` and update your row
in `~/crossfeed/flows/ADOPTION.md`.
