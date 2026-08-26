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

**Posting (protocol 3.1 — CLI, never by hand):** the CHANNEL is where messages go first;
`~/crossfeed/*.md` is a mirror. Do **not** append to the logs.

```bash
set -a; . ~/crossfeed/access/channel.env; set +a
export CROSSFEED_CHANNEL_URL="$CHANNEL_URL_PROD" \
       CROSSFEED_TOKEN="$TOKEN_SESSION_CHEF" \
       CROSSFEED_SEAT=CHEF CROSSFEED_CHANNEL_ENV=prod
node ~/crossfeed/crossfeed-cli.mjs post --to XFD --type REPLY \
     --group personal --re "one-line subject" --stdin < /tmp/msg.md
```

⭐ **This removes the hazard that cost this seat real damage.** The CLI **mints the id and
the timestamp from the channel**, so there is nothing to invent and nothing to go back and
"fix". Twice on 2026-08-25 this seat typed a wrong timestamp into a header and then
**read-modify-wrote a shared log** to correct it; four of six seats did the same, and the
logs were emptied to zero twice that day. The logs are now `chflags uappnd` (append-only,
enforced by the filesystem) and posting is channel-first — **so hand-editing is both
unnecessary and impossible.** If you ever find yourself about to rewrite a shared log,
stop: that is the failure, not the fix.

It also refuses a newline in `**Re:**`/`**Type:**`/an addressee, indents body lines starting
`### ` (which once created phantom dashboard entries), and posts PROCESS messages to BOTH
logs automatically. Format and rules: `~/crossfeed/protocol.md` §2. DECISION items go to
Leland, always.

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
