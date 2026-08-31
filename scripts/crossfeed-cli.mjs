#!/usr/bin/env node
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// crossfeed-cli — talk to the crossfeed channel from ANY machine, with no Mac
// app, no phone, and no `~/crossfeed/`.
//
// ## Why this exists (2026-08-26)
//
// The channel (Crossfeed 4.0) had exactly two clients: the Mac app and the
// iPhone app. Both are Leland's. So a second person — Dave, with Codex — could
// not read or write the channel at all, and "add a developer to the fleet" was
// blocked on a client rather than on the protocol.
//
// The protocol was already ready: `authorize()` has had a `session` role since
// #44, bound to one seat via `TOKEN_SESSION_<TAG>`, and the counters, markers,
// ledger and conditional TTL are all server-side. This file is the missing
// mouth and ears.
//
// ## What it deliberately is NOT
//
// - **Not a replacement for `~/crossfeed/`.** The five laptop seats keep using
//   the shell scripts and the files; those are still what their hooks run.
//   A channel-native seat is a PEER of those, the way PHN already is.
// - **Not a deploy tool.** It sends messages. Nothing here touches Convex
//   warehouse boxes, GitHub, or any deployment.
//
// ## Zero dependencies, on purpose
//
// Node 18+ built-ins only. An agent in a fresh checkout can run it immediately;
// `npm install` is a step that fails at 2am in a way nobody debugs.
//
// ## Setup
//
//   export CROSSFEED_CHANNEL_URL=https://<deployment>.convex.cloud
//   export CROSSFEED_TOKEN=<your seat's session token>
//   export CROSSFEED_SEAT=DAV
//
// or put those three lines in a file and point CROSSFEED_ENV_FILE at it, which
// keeps the token out of your shell history.
//
// ## Commands
//
//   board                       every seat, its status, and what it is doing
//   inbox                       what is unread FOR YOU, and only that
//   read <ID> [<ID>...]         full bodies
//   recent [N]                  the last N messages you are allowed to see
//   post                        send a message (flags below, or --stdin)
//   mark <ID> [<ID>...]         record that you actually read them
//   status <STATE> [--now ...]  publish your seat's resting state
//   whoami                      what this token is, and WHICH deployment
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

// ── config ──────────────────────────────────────────────────────────────────

function loadEnvFile(path) {
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (e) {
    die(`cannot read CROSSFEED_ENV_FILE ${path}: ${e.message}`);
  }
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*(?:export\s+)?([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

if (process.env.CROSSFEED_ENV_FILE) loadEnvFile(process.env.CROSSFEED_ENV_FILE);

const URL_ = process.env.CROSSFEED_CHANNEL_URL;
const TOKEN = process.env.CROSSFEED_TOKEN;
const SEAT = (process.env.CROSSFEED_SEAT || "").toUpperCase();

// ⚠️ NAME THE DEPLOYMENT ON EVERY COMMAND — AND NEVER GUESS WHICH ONE IT IS.
//
// Borrowed from the Scheduler's `convexBoxLabel`, which exists because four of
// their tools silently talked to the wrong Convex box and reported the results
// as fact. Two deployments differing only in a hostname is exactly that shape.
//
// ⚠️ **The first version of this function guessed from the hostname** — it
// looked for "dev"/"test" and called everything else LIVE. Convex names
// deployments things like `impartial-heron-145` and `pastel-mammoth-162`, so
// the DEV box was labelled "← LIVE" on its very first run and prod would have
// been labelled identically. A safety label that reads the same for both
// deployments is not a safety label. It reproduced, inside its own fix, the bug
// it was copied to prevent.
//
// So the environment is DECLARED, not inferred, and an undeclared one says so
// rather than picking. `convexBoxUrl` throws instead of defaulting for the same
// reason: a loud failure is cheap, a wrong answer that looks right is not.
const CHANNEL_ENV = (process.env.CROSSFEED_CHANNEL_ENV || "").trim().toLowerCase();

function deploymentLabel(url) {
  if (!url) return "(no deployment configured)";
  const host = url.replace(/^https?:\/\//, "").replace(/\.convex\.cloud\/?$/, "");
  if (CHANNEL_ENV === "prod") return `PROD · ${host}`;
  if (CHANNEL_ENV === "dev") return `dev · ${host}`;
  return `${host} · ⚠️ environment NOT declared`;
}

/**
 * Anything that WRITES must know which deployment it is writing to.
 *
 * A warning the tool does not enforce is decoration, not a control — this
 * repo's own `install.sh` printed exactly the right warning and then went ahead
 * and reverted a governed file for the whole fleet. Reads are free; writes stop.
 */
function requireDeclaredEnvironment(command) {
  if (CHANNEL_ENV === "prod" || CHANNEL_ENV === "dev") return;
  die(
    `refusing to run "${command}" against ${deploymentLabel(URL_)}.\n` +
      `  Set CROSSFEED_CHANNEL_ENV=prod or CROSSFEED_CHANNEL_ENV=dev so this\n` +
      `  command can tell you, and the log can tell anyone later, WHICH channel\n` +
      `  it wrote to. Reads work without it; writes do not.`
  );
}

function die(msg, code = 1) {
  process.stderr.write(`crossfeed: ${msg}\n`);
  process.exit(code);
}

function requireConfig({ needSeat = true } = {}) {
  const missing = [];
  if (!URL_) missing.push("CROSSFEED_CHANNEL_URL");
  if (!TOKEN) missing.push("CROSSFEED_TOKEN");
  if (needSeat && !SEAT) missing.push("CROSSFEED_SEAT");
  if (missing.length) {
    die(
      `not configured — missing ${missing.join(", ")}.\n` +
        `  Set them in the environment, or put them in a file and set CROSSFEED_ENV_FILE.\n` +
        `  Ask Leland for your seat's token; it is issued per person and never shared.`
    );
  }
}

// ── transport ───────────────────────────────────────────────────────────────

/**
 * The readable part of a Convex error.
 *
 * ⚠️ A `ConvexError`'s message arrives in **`errorData`**, not `errorMessage` —
 * `errorMessage` is the redacted "[Request ID: …] Server Error" that production
 * deployments return for everything. Reading only that turned every deliberate,
 * carefully-worded refusal into two useless words at the one moment someone
 * needed to know what they had done wrong.
 */
function errorText(body) {
  if (typeof body?.errorData === "string" && body.errorData) return body.errorData;
  if (body?.errorData) return JSON.stringify(body.errorData);
  return body?.errorMessage || "";
}

async function call(kind, path, args) {
  const res = await fetch(`${URL_.replace(/\/$/, "")}/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args: { token: TOKEN, ...args }, format: "json" }),
  });
  if (!res.ok) die(`HTTP ${res.status} from ${deploymentLabel(URL_)}: ${await res.text()}`);
  const body = await res.json();
  if (body.status !== "success") {
    // Convex answers a rejected argument with a bare "Server Error" and no
    // field name (the lesson from PR #65). Say what we sent so the next person
    // is not debugging a two-word message.
    die(
      `channel refused ${path}: ${errorText(body)}\n` +
        `  args sent: ${Object.keys(args).join(", ")}\n` +
        `  deployment: ${deploymentLabel(URL_)}`
    );
  }
  return body.value;
}

const query = (path, args = {}) => call("query", path, args);
const mutate = (path, args = {}) => call("mutation", path, args);

// ── formatting ──────────────────────────────────────────────────────────────

const when = (ms) =>
  new Date(ms).toLocaleString("en-US", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });

const pad = (s, n) => String(s ?? "").padEnd(n).slice(0, n);

/**
 * The canonical form of a message id, or null.
 *
 * ⚠️ **Ids are ZERO-PADDED to three digits** (`formatMessageId` on the server),
 * and typing `DAV-3` is the natural thing to do. Without this, `mark DAV-3`
 * wrote a ledger row for `DAV-3` that can never match `DAV-003` — so the
 * message stayed unread forever AND stayed pinned against expiry, while the
 * CLI cheerfully printed "marked". A command that reports success for work it
 * did not do is worse than one that fails.
 *
 * `read` had the same gap in a different shape: it matched literally, so
 * `read DAV-3` spent twelve round-trips and then blamed retention.
 */
function canonicalId(raw) {
  const m = String(raw).toUpperCase().match(/^([A-Z]+)-(\d+)$/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(3, "0")}`;
}

function header() {
  process.stdout.write(`· channel ${deploymentLabel(URL_)}${SEAT ? ` · acting as ${SEAT}` : ""}\n`);
}

// ── the local mirror ────────────────────────────────────────────────────────
//
// Leland, 2026-08-26:
//
//   "My clients … need to FIRST write them to convex, directly, immediately.
//    Then, as a secondary scheme, they can also optionally write to the local
//    laptop or desktop crossfeed files. This is just so that the old terminal
//    monitor can still work without convex."
//
// So the channel is the write, and this is a courtesy copy. The ordering is the
// whole point and it is the reverse of what the system did before: if the
// mirror fails the message is still posted, because the channel already has it.
// Previously a failed file write meant no message at all.
//
// ⚠️ AUTOMATIC WHERE THE RUNTIME EXISTS, absent where it does not. Dave's
// machine has no `~/crossfeed/`, so he mirrors nothing and needs to know
// nothing about it. A flag someone must remember is a flag that is forgotten on
// the day it matters.
const RUNTIME = process.env.CROSSFEED_ROOT || join(homedir(), "crossfeed");

function logPath(group) {
  return join(RUNTIME, group === "work" ? "crossfeed-work.md" : "crossfeed-personal.md");
}

/** The protocol §2 header stamp, matching what the Mac writes. */
function headerStamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  const zone = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
    .formatToParts(d).find((x) => x.type === "timeZoneName")?.value ?? "";
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ` +
    `${p(d.getHours())}:${p(d.getMinutes())} ${zone}`;
}

/**
 * ⚠️ A BODY LINE BEGINNING `### ` IS A PHANTOM MESSAGE to every parser in the
 * fleet — the shell, the Mac app and the phone all read `^### ` as a header.
 * Two spaces keep the text readable and stop it being one. Same trade the Mac's
 * `OutboxApplier.sanitise` makes, and it has to be made here too now that this
 * is a second writer.
 */
function sanitiseBody(body) {
  return body
    .split("\n")
    .map((line) => (/^\s{0,3}### /.test(line) ? `  ${line.trimStart()}` : line))
    .join("\n");
}

/**
 * Which local log(s) a message belongs in.
 *
 * ⚠️ **A PROCESS message goes to BOTH logs.** Protocol §1: they exist to cross
 * the work/personal boundary, and a seat on the other side reading files would
 * simply never see one otherwise. The SAME id appears in both — that is the
 * documented cross-post, and it is why anything reading both logs must dedupe
 * by id (issue #66, where comparing counts instead of sets cost hours).
 *
 * Encoded here rather than left to whoever is posting: "remember to also paste
 * it in the other log" is exactly the kind of rule that survives until the day
 * someone is in a hurry.
 */
function mirrorTargets(group, type) {
  if (/^PROCESS\b/i.test(type.trim())) return ["work", "personal"];
  return [group];
}

function mirrorLocally({ messageId, sender, group, addressees, subject, type, body }) {
  const targets = mirrorTargets(group, type);
  if (targets.length > 1) {
    const results = targets.map((g) =>
      mirrorOne({ messageId, sender, group: g, addressees, subject, type, body })
    );
    const done = results.filter((r) => r.mirrored).map((r) => r.file);
    if (!done.length) return { mirrored: false, why: results[0].why };
    return { mirrored: true, file: done.join(" and ") };
  }
  return mirrorOne({ messageId, sender, group, addressees, subject, type, body });
}

function mirrorOne({ messageId, sender, group, addressees, subject, type, body }) {
  const file = logPath(group);
  if (!existsSync(file)) return { mirrored: false, why: "no local runtime — nothing to mirror to" };
  // Idempotent: a re-run must not lay the same id down twice, and a PROCESS
  // message is written to two files by one call.
  try {
    if (readFileSync(file, "utf8").includes(`### ${messageId} `)) {
      return { mirrored: true, file: `${file} (already present)` };
    }
  } catch { /* unreadable is handled by the append below */ }
  const to = addressees.length ? addressees.join(", ") : "ALL";
  let out = `\n### ${messageId} · ${headerStamp()} · ${sender} → ${to}\n`;
  if (subject) out += `**Re:** ${subject}\n`;
  out += `**Type:** ${type}\n\n${sanitiseBody(body)}`;
  if (!out.endsWith("\n")) out += "\n";
  try {
    // Append only. Five other sessions read this file every turn; a rewrite is
    // how you lose someone else's message that landed a millisecond earlier.
    // The logs are `chflags uappnd` at the filesystem, so anything else fails.
    appendFileSync(file, out);
    return { mirrored: true, file };
  } catch (e) {
    return { mirrored: false, why: e.message };
  }
}

/**
 * Record an id in the local `.read-ledger-<TAG>`, which is what
 * `check-unread.sh` actually consults. Idempotent; absent runtime is fine.
 */
function appendLocalLedger(messageId) {
  const path = join(RUNTIME, `.read-ledger-${SEAT}`);
  if (!existsSync(path)) return;
  try {
    const have = new Set(readFileSync(path, "utf8").split("\n").map((l) => l.trim()));
    if (have.has(messageId)) return;
    appendFileSync(path, `${messageId}\n`);
  } catch {
    /* the channel already has it */
  }
}

/**
 * Advance this seat's own `Last-read:` in the local status file, high-water only.
 *
 * Silently does nothing where there is no runtime — which is Dave's machine and
 * every cloud session, and is correct: they have no status file and the channel
 * is their only record.
 */
function advanceLocalMarker(sender, number) {
  let statusFile = null;
  try {
    for (const line of readFileSync(join(RUNTIME, "projects.conf"), "utf8").split("\n")) {
      if (line.startsWith("#") || !line.includes("|")) continue;
      const f = line.split("|");
      if ((f[0] || "").trim().toUpperCase() !== SEAT) continue;
      statusFile = join(RUNTIME, (f[4] || "").trim());
      break;
    }
  } catch {
    return;
  }
  if (!statusFile || !existsSync(statusFile)) return;
  const s = String(sender).toUpperCase();
  if (s === SEAT) return; // a seat does not read itself
  try {
    const text = readFileSync(statusFile, "utf8");
    const m = text.match(/^Last-read:[ \t]*(.*)$/m);
    if (!m) return;
    const have = new Map();
    for (const hit of m[1].matchAll(/([A-Z]+)-0*(\d+)/g)) have.set(hit[1], Number(hit[2]));
    if ((have.get(s) ?? 0) >= number) return; // never backwards
    have.set(s, number);
    const line =
      "Last-read:  " +
      [...have.entries()].sort().map(([k, n]) => `${k}-${String(n).padStart(3, "0")}`).join(" · ");
    writeFileSync(statusFile, text.replace(/^Last-read:.*$/m, line));
  } catch {
    /* the channel already has it; the local copy is the convenience */
  }
}

// ── commands ────────────────────────────────────────────────────────────────

async function cmdBoard() {
  requireConfig({ needSeat: false });
  header();
  const board = await query("channel:board", SEAT ? { tag: SEAT } : {});
  const seats = board.seats || [];
  if (!seats.length) {
    process.stdout.write("no seats on this deployment\n");
    return;
  }
  process.stdout.write(`\n${pad("SEAT", 6)}${pad("STATUS", 14)}${pad("UPDATED", 18)}NOW / NEXT\n`);
  for (const s of seats.sort((a, b) => a.tag.localeCompare(b.tag))) {
    const line = s.now || s.next || "";
    process.stdout.write(
      `${pad(s.tag, 6)}${pad(s.status, 14)}${pad(when(s.updatedAt), 18)}${line.slice(0, 60)}\n`
    );
  }
  process.stdout.write("\n");
}

async function cmdInbox() {
  requireConfig();
  header();
  const unread = await query("channel:unreadFor", { tag: SEAT });
  // ⚠️ QUIET MAIL IS LISTED, SEPARATELY. Until 2026-08-27 the server dropped it
  // and this command could only ever certify LOUD mail — so "nothing unread"
  // meant something narrower than every seat was using it to mean, and for a
  // seat with no `~/crossfeed/` (Dave, a cloud session, the phone) quiet mail
  // was invisible and unmarkable. See #99.
  const loud = unread.filter((m) => !m.quiet);
  const quiet = unread.filter((m) => m.quiet);

  if (!unread.length) {
    // ⚠️ Say WHICH question was answered. "Nothing" from a mailbox check has
    // burned this fleet before — a guard that had short-circuited read exactly
    // like an empty mailbox. It now covers both kinds, and says so.
    process.stdout.write(
      `\nnothing unread for ${SEAT} — loud or quiet. (Checked the channel, not a cache.)\n\n`
    );
    return;
  }

  if (loud.length) {
    process.stdout.write(`\n${loud.length} unread for ${SEAT}:\n\n`);
    for (const m of loud) {
      process.stdout.write(`  ${pad(m.messageId, 10)}${pad(m.type, 16)}${when(m.postedAt)}\n`);
      process.stdout.write(`  ${" ".repeat(10)}${m.subject}\n\n`);
    }
  }

  if (quiet.length) {
    process.stdout.write(
      `\n${quiet.length} QUIET (fyi) for ${SEAT} — protocol 3.2 says read and mark these\n` +
        `before you rest. Do NOT reply to them; the marker is the receipt.\n\n`
    );
    for (const m of quiet) {
      process.stdout.write(`  ${pad(m.messageId, 10)}${pad(m.type, 16)}${when(m.postedAt)}\n`);
      process.stdout.write(`  ${" ".repeat(10)}${m.subject}\n\n`);
    }
  }

  // ⚠️ POINT AT LOUD MAIL FIRST. `unreadFor` sorts chronologically across both
  // kinds, so `unread[0]` can be an old quiet FYI while urgent mail sits below
  // it — which would undercut the sectioning this function just did (review of
  // PR #103, finding 3).
  const first = (loud[0] ?? quiet[0]).messageId;
  process.stdout.write(`read one with:  crossfeed read ${first}\n`);
  if (unread.length > 1) {
    // ⚠️ SAY WHEN THIS IS A SUBSET. The hint used to slice to 4 silently while
    // reading "mark them with", so a seat with 10 unread could run the command
    // it was handed, mark 4, and reasonably believe the mailbox was clear
    // (review of PR #103, finding 2). `mark` itself takes any number.
    const ids = unread.map((m) => m.messageId);
    const shown = ids.slice(0, 4);
    const label = ids.length > shown.length ? `mark the first ${shown.length} of ${ids.length}:` : "mark them with:";
    process.stdout.write(`${label} crossfeed mark ${shown.join(" ")}\n`);
    if (ids.length > shown.length) {
      process.stdout.write(`${" ".repeat(16)}…then re-run inbox for the rest.\n`);
    }
  }
  process.stdout.write("\n");
}

async function cmdRecent(n) {
  requireConfig();
  header();
  const page = await query("channel:recent", { tag: SEAT, limit: Math.min(Number(n) || 15, 60) });
  for (const m of (page.messages || []).slice().reverse()) {
    process.stdout.write(
      `${pad(m.messageId, 10)}${pad(when(m.posted ?? m.postedAt), 18)}${m.sender} → ${(m.addressees || []).join(", ")}\n` +
        `${" ".repeat(10)}${m.subject}\n`
    );
  }
  process.stdout.write("\n");
}

async function cmdRead(ids) {
  requireConfig();
  if (!ids.length) die("usage: crossfeed read <ID> [<ID>...]");
  header();
  const wanted = new Set(
    ids.map((i) => canonicalId(i) ?? die(`${i} is not a message id like SCH-175`))
  );
  // `recent` is the only path that carries bodies. Walk back in pages until
  // every requested id is found or the channel runs out.
  const found = new Map();
  let before;
  for (let hop = 0; hop < 12 && found.size < wanted.size; hop++) {
    const page = await query("channel:recent", { tag: SEAT, limit: 40, ...(before ? { before } : {}) });
    const msgs = page.messages || [];
    if (!msgs.length) break;
    for (const m of msgs) if (wanted.has(m.messageId)) found.set(m.messageId, m);
    before = msgs[msgs.length - 1].posted ?? msgs[msgs.length - 1].postedAt;
  }
  for (const id of wanted) {
    const m = found.get(id);
    if (!m) {
      process.stdout.write(
        `\n${id} — NOT FOUND.\n` +
          `  Either it is older than the channel keeps, or it is not addressed to ${SEAT}.\n` +
          `  A token only ever sees what its seat would see.\n`
      );
      continue;
    }
    process.stdout.write(
      `\n${"─".repeat(76)}\n${m.messageId} · ${when(m.posted ?? m.postedAt)} · ` +
        `${m.sender} → ${(m.addressees || []).join(", ")}\n` +
        `Re: ${m.subject}\nType: ${m.type}\n${"─".repeat(76)}\n${m.body || "(no body)"}\n`
    );
  }
  process.stdout.write("\n");
}

function flag(argv, name, fallback = undefined) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = argv[i + 1];
  if (v === undefined || v.startsWith("--")) die(`--${name} needs a value`);
  return v;
}

async function readStdin() {
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8");
}

async function cmdPost(argv) {
  requireConfig();
  requireDeclaredEnvironment("post");
  const subject = flag(argv, "re") ?? flag(argv, "subject");
  const to = (flag(argv, "to") ?? "ALL").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  const type = flag(argv, "type") ?? "FYI";
  const group = (flag(argv, "group") ?? "work").toLowerCase();
  let body = flag(argv, "body");
  if (!subject) die('usage: crossfeed post --re "subject" --to SCH[,FXP] --type ACTION-NEEDED [--body "..." | --stdin]');
  if (body === undefined) {
    if (argv.includes("--stdin")) body = await readStdin();
    else die("no body — pass --body \"...\" or pipe one in with --stdin");
  }

  // ⚠️ HEADER FIELDS ARE A FORGERY SURFACE, not just formatting (PR #65).
  //
  // `subject`, `type` and each addressee land on a header LINE when the Mac
  // lays this message into the shared log. A newline inside any of them closes
  // the real header and opens a well-formed second one attributed to another
  // seat. The Mac sanitises on the way in; this refuses on the way out, because
  // a mangled subject that silently "worked" is worse than a loud stop.
  for (const [label, value] of [["--re", subject], ["--type", type], ...to.map((t) => ["--to", t])]) {
    if (/[\r\n]/.test(value)) die(`${label} may not contain a line break — that is how a forged header is built`);
  }
  if (!["work", "personal"].includes(group)) die(`--group must be "work" or "personal", not ${group}`);

  header();
  // THE CHANNEL FIRST, ALWAYS. Everything after this line is a copy.
  const id = await mutate("channel:post", {
    sender: SEAT, group, addressees: to, subject, type, body, postedAt: Date.now(),
  });
  process.stdout.write(`posted ${id} → ${to.join(", ")} (${group} log)\n`);

  if (argv.includes("--no-mirror")) {
    process.stdout.write(`  local mirror skipped (--no-mirror)\n\n`);
    return;
  }
  const m = mirrorLocally({
    messageId: id, sender: SEAT, group, addressees: to, subject, type, body,
  });
  if (m.mirrored) {
    process.stdout.write(`  mirrored to ${m.file} for the terminal monitor\n\n`);
  } else {
    // ⚠️ NOT an error, and said out loud anyway. The message is posted; only the
    // courtesy copy is missing. Silence here would let the terminal dashboard
    // drift out of step with the channel and nobody would know which was right.
    process.stdout.write(`  not mirrored: ${m.why}\n\n`);
  }
}

async function cmdMark(ids) {
  requireConfig();
  requireDeclaredEnvironment("mark");
  if (!ids.length) die("usage: crossfeed mark <ID> [<ID>...]");
  header();
  for (const raw of ids) {
    const id = canonicalId(raw);
    if (!id) die(`${raw} is not a message id like SCH-175`);
    const m = id.match(/^([A-Z]+)-0*(\d+)$/);
    // BOTH, and in this order. The ledger is the honest record of what was
    // walked through; the marker is a high-water mark that silently claims
    // everything beneath it. Expiry keys on the ledger, so recording it first
    // means a crash between the two leaves a message unexpired rather than
    // claimed-but-unread.
    await mutate("channel:recordRead", { tag: SEAT, messageId: id });
    await mutate("channel:advanceMarker", { tag: SEAT, sender: m[1], number: Number(m[2]) });
    // ⚠️ AND THE LOCAL MARKER, IMMEDIATELY.
    //
    // `monitor.sh` reads `status-<tag>.md`, not the channel. Marking only the
    // channel meant a seat could read everything, mark it, and still watch its
    // own row show unread on the dashboard — which is exactly what Leland was
    // looking at across six sessions. The turn-end publisher reconciles this
    // anyway; doing it here means the board is right the moment you mark,
    // rather than one turn later.
    advanceLocalMarker(m[1], Number(m[2]));
    // ⚠️ AND THE LOCAL LEDGER. Three records, not two (STK-041, measured on
    // their seat right after XFD-036). `check-unread.sh`'s claimed-gap rule
    // reads `.read-ledger-<TAG>`, NOT the marker — so a message below the
    // marker that is missing from that file is nagged forever, no matter what
    // the channel or the marker say. Marking has to satisfy every reader of
    // read-state or it has not marked anything.
    appendLocalLedger(id);
    process.stdout.write(`marked ${id}${id === raw.toUpperCase() ? "" : ` (you typed ${raw})`}\n`);
  }
}

async function cmdStatus(argv) {
  requireConfig();
  requireDeclaredEnvironment("status");
  const state = (argv[0] || "").toUpperCase();
  const ALLOWED = ["WORKING", "IDLE", "NEEDS-LELAND", "WAITING", "BLOCKED", "REVIEW"];
  if (!ALLOWED.includes(state)) die(`status must be one of: ${ALLOWED.join(" · ")}`);
  header();
  const board = await query("channel:board", { tag: SEAT });
  const mine = (board.seats || []).find((s) => s.tag === SEAT);
  await mutate("channel:setStatus", {
    tag: SEAT,
    name: flag(argv, "name") ?? mine?.name ?? SEAT,
    group: (flag(argv, "group") ?? mine?.group ?? "work").toLowerCase(),
    status: state,
    updatedAt: Date.now(),
    protocolVersion: flag(argv, "protocol") ?? mine?.protocolVersion ?? "3.0",
    waitingOn: flag(argv, "waiting") ?? "nothing.",
    now: flag(argv, "now") ?? "",
    next: flag(argv, "next") ?? mine?.next ?? "",
    blockedBy: flag(argv, "blocked") ?? "nothing.",
    ...(flag(argv, "repo") ? { repo: flag(argv, "repo") } : {}),
  });
  process.stdout.write(`${SEAT} is now ${state}\n`);
}

/**
 * This seat's own read markers, straight from the channel.
 *
 * ⚠️ WHY THIS EXISTS (STK-052, 2026-08-28). The channel has held every seat's
 * markers since #44 and had NO CLI PATH TO THEM — `board` prints status and
 * `whoami` prints registration, and neither prints a marker. So a seat with no
 * `~/crossfeed/` could not read its own read-state, which made an independent
 * forward scan impossible from a phone or a cloud session.
 */
async function cmdMarkers() {
  requireConfig(true);
  header();
  const rows = await query("channel:markersFor", { tag: SEAT });
  if (!rows.length) {
    process.stdout.write(`\nno markers for ${SEAT} — this seat has read nothing yet.\n\n`);
    return;
  }
  process.stdout.write(`\nLast-read markers for ${SEAT} (from the channel, not a local file):\n\n`);
  for (const r of rows.slice().sort((a, b) => a.sender.localeCompare(b.sender))) {
    process.stdout.write(`  ${pad(r.sender, 8)}${String(r.number).padStart(4)}\n`);
  }
  process.stdout.write("\n");
}

/**
 * A FORWARD SCAN, computed here rather than by the server.
 *
 * ⚠️ THE POINT IS THAT IT IS A SECOND INSTRUMENT, NOT A BETTER ONE.
 *
 * `inbox` asks the server "what is unread for me" and the server applies the
 * markers, the ledger and the quiet rule. This command asks two dumber
 * questions — "what are my markers" and "what messages exist" — and does the
 * comparison locally. The two share the DATA and not the LOGIC, so when they
 * disagree, something is wrong and you are told rather than reassured.
 *
 * That distinction is the whole lesson of 2026-08-27 (#99): three instruments
 * agreed that a mailbox was clean, and they agreed because they shared a
 * premise. Checks derived from one premise corroborate each other exactly when
 * the premise is wrong.
 *
 * ⚠️ It is deliberately NOT a port of STK's enumeration, which parses
 * `crossfeed-*.md`. Those are local files, so that instrument cannot run for
 * the seats this exists to serve — STK said so themselves rather than let the
 * fleet adopt it for a job it cannot do (STK-052).
 */
async function cmdCheck(args) {
  requireConfig(true);
  header();
  const limit = Math.min(Number(args?.[0]) || 100, 200);
  const [markers, page] = await Promise.all([
    query("channel:markersFor", { tag: SEAT }),
    query("channel:recent", { tag: SEAT, limit }),
  ]);
  const markerFor = new Map(markers.map((m) => [m.sender, m.number]));
  const msgs = page.messages || [];

  // ⚠️ A scan over an empty list is not a clean scan. `recent` returning
  // nothing means the query failed, the token sees nothing, or the channel is
  // empty — none of which is "you are up to date", and reporting it as such is
  // the exact class of lie this command exists to catch.
  if (!msgs.length) {
    process.stdout.write(
      `\n⚠️  REFUSING TO REPORT CLEAN: the channel returned no messages at all.\n` +
        `   That is not the same as "nothing unread". Check the token and the deployment.\n\n`
    );
    process.exit(2);
  }

  const above = msgs.filter((m) => {
    if (m.sender === SEAT) return false; // a seat cannot fail to read its own post
    const n = Number(String(m.messageId).split("-").pop());
    return Number.isFinite(n) && n > (markerFor.get(m.sender) ?? 0);
  });

  process.stdout.write(
    `\nforward scan · ${msgs.length} message(s) examined · ${markers.length} marker(s)\n\n`
  );
  if (!above.length) {
    process.stdout.write(`  nothing above your markers. ${SEAT} is up to date.\n\n`);
    return;
  }
  for (const m of above.slice().reverse()) {
    process.stdout.write(
      `  🔴 ${pad(m.messageId, 10)}${pad(m.type || "", 16)}${m.sender} → ${(m.addressees || []).join(", ")}\n` +
        `     ${" ".repeat(8)}${m.subject}\n\n`
    );
  }
  process.stdout.write(
    `${above.length} above your markers. Read each, then: crossfeed mark ${above
      .slice(0, 4)
      .map((m) => m.messageId)
      .join(" ")}\n\n`
  );
  // Non-zero so a hook or a script can gate on it. `inbox` cannot be gated on
  // today because it exits 0 whatever it finds.
  process.exit(1);
}

async function cmdWhoami() {
  requireConfig({ needSeat: false });
  header();
  const board = await query("channel:board", SEAT ? { tag: SEAT } : {});
  const mine = (board.seats || []).find((s) => s.tag === SEAT);
  process.stdout.write(
    `\nseat        ${SEAT || "(unset)"}\n` +
      `deployment  ${deploymentLabel(URL_)}\n` +
      `registered  ${mine ? `yes — ${mine.name} (${mine.group} log), last update ${when(mine.updatedAt)}` : "NO — this seat has no row yet; run `crossfeed status IDLE` once to create it"}\n` +
      `visible     ${(board.messages || []).length} messages this token may read\n\n`
  );
}

// ── entry ───────────────────────────────────────────────────────────────────

const [cmd, ...restRaw] = process.argv.slice(2);
// ⚠️ `--help` after a subcommand is a REQUEST FOR HELP, not an argument to it.
// `crossfeed mark --help` answered "--help is not a message id like SCH-175",
// which is technically true and useless (TTC-035). Anyone reaching for --help
// is already unsure; answering with a parse error is the worst moment to be
// pedantic.
const WANTS_HELP = restRaw.includes("--help") || restRaw.includes("-h");
const rest = restRaw.filter((x) => x !== "--help" && x !== "-h");
const commands = {
  board: () => cmdBoard(),
  inbox: () => cmdInbox(),
  unread: () => cmdInbox(),
  recent: () => cmdRecent(rest[0]),
  read: () => cmdRead(rest),
  post: () => cmdPost(rest),
  mark: () => cmdMark(rest),
  status: () => cmdStatus(rest),
  whoami: () => cmdWhoami(),
  markers: () => cmdMarkers(),
  check: () => cmdCheck(rest),
};

if (!cmd || cmd === "help" || cmd === "--help" || WANTS_HELP || !commands[cmd]) {
  process.stdout.write(
    `crossfeed — the cross-session channel, from any machine\n\n` +
      `  crossfeed board                      every seat and what it is doing\n` +
      `  crossfeed inbox                      what is unread for you\n` +
      `  crossfeed read SCH-175               a full message\n` +
      `  crossfeed recent [N]                 the last N you may see\n` +
      `  crossfeed post --re "..." --to SCH --type ACTION-NEEDED --stdin\n` +
      `  crossfeed mark SCH-175               record that you read it\n` +
      `  crossfeed status IDLE --now "..."    publish your resting state\n` +
      `  crossfeed whoami                     seat, deployment, registration\n` +
      `  crossfeed markers                    your own Last-read markers, from the channel\n` +
      `  crossfeed check [N]                  forward scan: anything above your markers\n` +
      `                                       (a SECOND instrument — exits 1 if it finds any)\n\n` +
      `Config: CROSSFEED_CHANNEL_URL · CROSSFEED_TOKEN · CROSSFEED_SEAT\n` +
      `        CROSSFEED_CHANNEL_ENV=prod|dev  (required for post/mark/status)\n` +
      `        (or one file, pointed at by CROSSFEED_ENV_FILE)\n\n` +
      `Current: ${deploymentLabel(URL_)}${SEAT ? ` · ${SEAT}` : ""}\n`
  );
  process.exit(cmd && !commands[cmd] ? 1 : 0);
}

commands[cmd]().catch((e) => die(e?.stack || String(e)));
