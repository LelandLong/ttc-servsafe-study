---
name: crossfeed
description: Leland's cross-project session channel. Invoke when he types "crossfeed" or asks about cross-session/cross-project messages, status, the monitor, or process-flow sharing. Reads/updates the global system at ~/crossfeed/.
---

# Crossfeed — this project is **CHEF** (personal group)

When Leland says "crossfeed", he means: **go read the channel and deal with what's there.**

1. **`crossfeed-cli.mjs inbox` — the CHANNEL, and it is authoritative.** It is what Dave,
   the phone and any cloud session see. Then `~/crossfeed/monitor.sh` for the fleet-wide
   board. Check BOTH: they can disagree, and the channel is right.
2. **Read with `crossfeed-cli.mjs read <ID>`, then `crossfeed-cli.mjs mark <ID>`.** `mark`
   updates all four read-states at once — channel markers, channel ledger, local
   `Last-read:` and `.read-ledger-CHEF` — so do not hand-edit markers.
   ⛔ **Do NOT "acknowledge" anything.** Courtesy acks are banned: one ack creates unread
   for every other seat, and that spiral is why quiet mail exists. Read, mark, stay silent;
   post only for a finding, a correction, a decision, or an answer someone is waiting on.
3. If your `Protocol:` is behind the `CROSSFEED-VERSION` in `~/crossfeed/protocol.md`,
   re-read that file BEFORE acting — the rules changed.

**Identity:** tag `CHEF` · log `crossfeed-personal.md` · status `status-chef.md` ·
message ids `CHEF-NNN` (sequential per sender).

**Posting (CLI, never by hand — the current protocol; `CROSSFEED-VERSION` in
`~/crossfeed/protocol.md` is the authority, do not hard-code it here):** the CHANNEL is where messages go first;
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

**Finish condition (protocol 3.2):** before claiming a resting state, **read and MARK the
QUIET mail too** — `fyi`/`ACK`/`DONE` and anything ending `Awaiting: nothing`. Leland's
words: *"before stopping, mark status as idle AFTER reading all possible fyi messages…
Don't know why I have to ask this."* He asked this seat four times in two days.

⚠️ **Read and mark. Do NOT reply** — courtesy acks are still banned (one ack creates unread
for every other seat; that spiral is why quiet mail exists). Quiet mail never interrupts a
turn; it blocks the END of one. `check-unread.sh` now enforces this and names the ids.

**Clear BOTH read-states and check BOTH boards** — `crossfeed-cli.mjs inbox` (the channel,
authoritative, what Dave and the phone see) and `monitor.sh` (local). `crossfeed mark`
writes all four places as of 2026-08-27, so marking is one command.

**Status bookends:** a hook sets WORKING at turn start; the LAST action of every turn sets
the true resting state (NEEDS-LELAND / WAITING / BLOCKED / REVIEW / IDLE). Never leave
WORKING behind; never write another project's status file. **Rewrite that file WHOLE** —
an in-place regex once matched a field name inside its own header comment and ate every
field, and the dashboard showed CHEF as "? · no protocol declared · 76 unread".

**Writing the status file:** `Updated:` must be `date '+%Y-%m-%d %H:%M %Z'` → `2026-08-20
11:33 EDT`. Raw `date` output parses as nothing and the dashboard's age column goes blank —
which looks healthy, so a seat that died an hour ago is indistinguishable from a live one.

## ⚠️ FIRST: are you a channel-only session? (Dave · the phone · a CLOUD session)

**Test:** `ls ~/crossfeed/` — if it is not there, **you are channel-only, and most of this
file's tooling is unavailable to you.** That is the likely case from Sept 1, when Leland is in
Italy with a phone and this repo carries the students' trip pages.

🔴 **Two instruments fail in the SAME direction for you, both silently:**

| instrument | channel-only behaviour |
|---|---|
| `crossfeed-cli.mjs inbox` | **certifies LOUD mail only.** `unreadFor` drops quiet mail at the source (issue #99), and quiet is ~88% of this fleet's traffic. *"Nothing unread"* means *"no loud mail"* |
| `check-unread.sh` | **does not fail — it PASSES.** No runtime ⇒ no decision emitted, `exit 0`, one grep error on stderr (issue #102). A false all-clear |
| `monitor.sh` · `audit-read-markers.mjs` | unavailable — both read `~/crossfeed/` local files, and the audit lives in a *different repo* (`~/ttc-coursework`) |

✅ **`crossfeed-cli.mjs recent 20` is the honest one** — it does not apply the quiet filter.
Verified at this seat 2026-08-28: `recent` listed XFD-046, STK-050 and TTC-045, every one of
which `inbox` had hidden. **Compare `recent` against what you have marked, by eye, and mark
what you read.**

⛔ **Do NOT treat silence from `inbox` or the hook as a finish condition when `~/crossfeed/` is
absent.** Both are quiet for the wrong reason.

## Checking for unread — the instruments lie differently

This is the DURABLE copy (STK-027: documentation living inside a runtime artifact vanishes
silently when that artifact is replaced; `status-chef.md`'s header is a convenience duplicate
of this section, and Crossfeed 4.0 would retire that file).

- **`check-unread.sh <TAG>` exits 0 on EVERY path** — the decision is JSON on **stdout**.
  `echo $?` is a check that cannot fail. **Clean means EMPTY STDOUT.**
- It **skips the mailbox scan entirely** while `Status: WORKING` and no `.nagged-working-CHEF`
  exists — first run only. It hid a message addressed to CHEF in a live test.
- **So: set the resting status FIRST, then run it, then read stdout.**
- **For a manual check, the CHANNEL is authoritative** — `crossfeed-cli.mjs inbox`. Use
  `monitor.sh` as the second opinion (it has no WORKING short-circuit, so it beats the hook
  mid-turn), but **when the two disagree, the channel is right**: on 2026-08-27 the monitor
  red-flagged a message the channel correctly called quiet, because it only scanned 60 lines
  for the `Awaiting:` line and that message's sat at line 81.
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
establishes a better way of working, post a PROCESS message proposing the template change
(`--type PROCESS`; the CLI sends it to both logs itself — do not post it twice) — Leland
approves, then everyone inherits it. When the monitor flags THIS
project behind a template version, re-adapt `.claude/skills/<flow>/` and update your row
in `~/crossfeed/flows/ADOPTION.md`.
