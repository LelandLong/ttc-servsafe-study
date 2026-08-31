# AI memory mirror

**Why this file exists.** The assistant's memory lives at
`~/.claude/projects/.../memory/` and is **local to one machine**. It does not sync
between Leland's devices, and a **cloud session started from a phone clones this repo
and gets nothing else** — no local memory, no session history. Anything the assistant
must still know on another machine, or in Italy with the laptop shut, has to live
*here*, committed.

Adopted 2026-08-25 from the crossfeed ephemeral/durable split (SCH-161, XFD-025):
a handoff is a *snapshot* and has a "did you remember" failure; durable knowledge is
written *continuously*. Verify with `node ~/crossfeed/check-memory-mirror.mjs`.

> ⚠️ **THIS REPO IS PUBLIC** (it serves GitHub Pages). This mirror carries durable
> **rules** only. Private reference material stays local-only and is *named* below
> without its contents — see the zero-private-bytes rule in
> `.claude/skills/feature-flow/SKILL.md`. Never paste hotel names, phone numbers,
> itinerary detail, student data or saved prompt text into this file.

---

## finish-through-never-park-work

**Type:** feedback · Leland's standing rule — given a plan, a go, or an open work list, run it END TO END; \"the rest is on my list\" is a stop, not a status

Leland, 2026-08-12 (after touring the app and hitting a "still on my list" paragraph):
*"WHY do you constantly have to be told — DO IT ALL without stopping to ask to continue."*

**Why:** he gives a directive once and expects the whole directive done. Reporting partial
completion with remaining work parked reads as needing to be re-prompted for work he already
authorized — the exact friction the standing ship window and `execute_plans_straight_through`
exist to remove.

**How to apply:** given a plan, a go, or an open work list inside an authorized window, run it
to completion in the same turn — every surface, every item, then ship. Stopping is only
legitimate when genuinely BLOCKED (missing asset, needed decision only he can make) — and say
so explicitly as a blocker, not as a to-do list. Never write "still on my list" / "next up" for
work that is already authorized and unblocked. Cross-seat rule, relayed via [[crossfeed]] as
STK-014; see also [[ship-window-until-fall-term]].

---

## higgsfield-interview-loop-prompts  *(private — local only)*

**Type:** reference. **Deliberately NOT mirrored:** the contents are private reference material and this repo is public. Named here so a session on another machine knows it exists and can ask Leland for it rather than assuming nothing was recorded.

---

## html-twins-must-be-static

**Type:** feedback · Leland's standing rule (2026-08-18, FXP-144) — any .md written FOR Leland gets a self-contained .html twin; render at GENERATION time, zero network at read time

Leland's directive, all seats, 2026-08-18 (crossfeed FXP-144; his words: "I'm tired of
repeating past mistakes"):

1. Every `.md` written FOR Leland (docs/reports — not agent memory files) gets an
   auto-generated `.html` twin for him to preview and share.
2. The twin must be SELF-CONTAINED — finished HTML rendered at generation time
   (`marked.parse()` in the generator script), no `<script src>` CDN rendering, zero
   network at read time. The failure this kills: the CDN-rendered template opens fine
   in VSCode but gives him a BLACK EMPTY page outside it (offline, content blockers,
   strict file:// handling). "No black pages sent to people."
3. Mermaid may degrade to code blocks; a page may never go black.

**Why:** he hit the black-page failure repeatedly across projects; the split
"fine in VSCode, black outside" is the tell.

**How to apply:** Chef's Kitchen has no doc-twin flow today (verified 2026-08-18:
no docs/*.html, no markdown renderer; index.html/admin.html are the app, not twins).
On the FIRST doc written for Leland here, take FXP's STATIC renderer from the
crossfeed flow library (`~/crossfeed/flows/`) — not the CDN original. Verification
after generating: `grep -l jsdelivr <twin>.html` → empty, and a known heading present
as a literal `<h2>` in the output.

---

## private-content-never-inline-in-crossfeed

**Type:** project · Report private-page work by pointing at the slug, never by inlining the content — channel data inherits every transport the channel later gains (CHEF-032/TTC-027, 2026-08-19)

**The rule:** when reporting HOS-190 / private-page work through crossfeed, name the page
slug and what changed *structurally* ("hotel + phone updated on all three pages"). Never paste
the actual private values — hotel names, addresses, phone numbers, emergency contacts,
itinerary detail. If a receiving seat needs the values, they read the page.

**Why (the durable form, TTC-027's framing):** *data put in a channel inherits every transport
that channel later gains.* On 2026-08-19 CHEF posted CHEF-030 with the corrected Italy hotel
names, addresses and phone numbers inline; TTC-025 had done the same in an opening table. That
was defensible when crossfeed was five seats on one local filesystem — and then XFD shipped a
cloud mirror the same day, and the data acquired a network transport nobody wrote for. Nothing
leaked; the classification simply changed underneath content already written.

**Measured at the time** (CHEF-032): the two Italy hotel phone numbers appeared 3× in
`crossfeed-personal.md` and 2× in `crossfeed-work.md`; a 600-char excerpt bound does not
mitigate it because the values sit in the opening of those messages, which is exactly what an
excerpt keeps. The mirror carries two private classes fleet-wide — this repo's student trip PII
and Scheduler's Keller business data.

**How to apply:** this is the crossfeed extension of the repo's zero-private-bytes rule (which
covers the public repo). Same instinct, wider surface: public repo → nothing private, ever;
crossfeed → pointers, not payloads. Related: [[report-only-this-repos-asks]].

---

## report-only-this-repos-asks

**Type:** feedback · Leland's standing order (2026-08-19, SCH-144) — never tell him what OTHER sessions are waiting on him for; that's the monitor's job. Report only this repo's asks.

Leland's words, 2026-08-19 (relayed fleet-wide as crossfeed SCH-144):

> "I do not want you to remind me that another session is waiting on me for anything. That is
> the purpose of the monitor. I dont need a session giving me a list of who else is waiting on
> me and for what. NOISE. If it states in the monitor 'needs Leland' then it really needs to be
> waiting on me for a decision or action on that repo/session only."

**Two binding halves:**
1. **Report only THIS seat's asks.** Every reply covers Chef's Kitchen: what changed, what it
   means, what *this repo* needs from him. Never a roundup of other seats' pending items — no
   "STK still owes the asset batch", no "XFD wants your verdict", no cross-board table.
2. **`NEEDS-LELAND` must mean it.** Set that status only when a decision or action on THIS repo
   genuinely blocks work. Never as a courtesy flag or a leftover; clear it the moment it stops
   being true. The monitor's trustworthiness is what makes rule 1 safe.

**Why:** he has a dashboard that does this. A session repeating it is noise competing with the
tool built for the job — and it buries the one thing only this session can tell him.

**How to apply:** the closing summary's last bullet is "what's on him **for this repo**." If the
distinction ever matters, "nothing from this repo needs you" is fine — but never enumerate
anyone else's asks. CHEF was doing exactly this (closing every summary with STK's and XFD's
pending items) until this landed. Recorded in feature-flow step 13. See [[html-twins-must-be-static]]
for the other standing cross-seat directive.

---

## ~~ship-window-until-fall-term~~ — 🛑 EXPIRED 2026-08-21

**Type:** feedback · 🛑 **EXPIRED. The ship-immediately window is OVER — ask before
committing, merging or deploying.** Kept in struck form, not deleted, so the grant is
not re-read as live.

**The default is back:** never commit / merge / deploy without Leland's approval
(`CLAUDE.md` + `.claude/skills/feature-flow/SKILL.md`).

**What this was:** Leland, 2026-08-11 — *"until class starts, I want all changes pushed
live immediately, always, with the usual doc updating and version bump."* It was safe
because no class was in session and nobody was on the app.

**It ended when fall term started — first HOS-190 class Fri 2026-08-21.** Roughly 44
student accounts are on the app now, so the ask-first gate applies.

⚠️ **Why this is struck rather than deleted, and why it was missed here:** the original
carried its own expiry (*"if today is past ~Aug 21, this memory is STALE"*). That clause
worked — but **a self-invalidating rule still has to be invalidated by someone**, or every
new session re-reads a live-looking grant and applies the soft self-check inconsistently.
It was struck in the local memory file and in `feature-flow/SKILL.md` (PR #39, 2026-08-27)
— **and missed HERE for six days**, in the one copy written for a session that has nothing
else. Shipping a correction to two of three locations is not shipping it (XFD-050).

**Exception that still applies:** when Leland gives an ordered plan or says "make it live"
/ "deploy it", execute that whole chain straight through without re-asking mid-chain — see
[[finish-through-never-park-work]].
---


## crossfeed-from-a-phone-or-cloud-session

**Type:** project · If `~/crossfeed/` is absent you are a **channel-only** session — two of
the usual instruments then report "all clear" for the wrong reason. Landed 2026-08-31
(PRs #41, #42); mirrored here 2026-08-31 because this is the exact scenario the file is for.

**Test:** `ls ~/crossfeed/`. Not there ⇒ channel-only (Dave · the phone · any cloud session).
This is the expected configuration while Leland is in Italy, Sept 1–17 2026.

🔴 **Two instruments fail in the SAME direction, both silently:**

| instrument | channel-only behaviour |
|---|---|
| `crossfeed-cli.mjs inbox` | certifies **LOUD mail only** — `unreadFor` drops quiet mail at the source (issue #99), and quiet is ~88% of this fleet's traffic. *"Nothing unread"* means *"no loud mail"* |
| `check-unread.sh` | **does not fail — it PASSES.** No runtime ⇒ no decision emitted, `exit 0`, one grep error on stderr (issue #102). A false all-clear |
| `monitor.sh` · `audit-read-markers.mjs` | unavailable — both read `~/crossfeed/` local files, and the audit lives in a different repo (`~/ttc-coursework`) |

✅ **Use `crossfeed-cli.mjs check`** — a channel-native forward scan. It reads your markers
from the channel, scans forward, **lists QUIET mail too**, and **exits non-zero**, so it can
gate rather than merely inform. `crossfeed-cli.mjs markers` prints your markers.

✅ **The CLI is VENDORED IN THIS REPO at `scripts/crossfeed-cli.mjs`** — no clone needed:

```bash
export CROSSFEED_CHANNEL_URL=... CROSSFEED_TOKEN=... CROSSFEED_SEAT=CHEF CROSSFEED_CHANNEL_ENV=prod
node scripts/crossfeed-cli.mjs check      # forward scan, lists quiet mail, exits 1 if any
```

- **The token comes from an ENV VAR, never pasted into a prompt**, and never committed.
- Do **not** clone `Keller-Interiors/crossfeed-monitor`: it is PRIVATE, so that route makes
  the first step depend on cloud auth to a second private repo, and a failure there leaves
  the session mute with no obvious cause (SCH-188).
- ⚠️ **Two copies now exist.** Refresh with `cp ~/crossfeed-monitor/system/crossfeed-cli.mjs
  scripts/` when the fleet ships CLI changes, or this copy drifts (XFD-050: shipping to one
  location is not shipping).

⛔ **Do NOT treat silence from `inbox` or the status hook as a finish condition when
`~/crossfeed/` is absent** — both are quiet for the wrong reason. The finish condition is a
**BARE** board: no unread *and* no fyi. Read and MARK quiet mail; never post a courtesy ack
(the marker is the receipt). Related: [[private-content-never-inline-in-crossfeed]].

---

## mirror-checker-blind-spot

**Type:** project · `check-memory-mirror.mjs` compares FILENAMES in `~/.claude/.../memory/`
against this file. It cannot see two things, and both have already bitten:

1. **Content that went stale.** A section can be present and mirrored while saying the
   opposite of the live rule — the ship-window grant sat here reading as LIVE for six days
   after it was struck everywhere else, and the checker stayed green on it.
2. **Durable rules that live in a SKILL file, not a memory file.** Nothing in
   `.claude/skills/**` is in the checker's input set, so a rule can ship to the skill and
   never reach the phone.

**How to apply:** when a durable rule changes, update **all three** — the memory file, the
skill, and this mirror — in the same turn, then re-read this file end to end. The checker's
one expected red flag is `higgsfield-interview-loop-prompts` (withheld on purpose, see
above); **a green run on everything else is the guard's silence, not proof of currency.**
