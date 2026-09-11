#!/usr/bin/env node
/**
 * Trim a published audio recording - e.g. to start where a tour actually begins -
 * and keep the audio, its transcript and the hub in step.
 *
 *   CK_USER_ID=<curator> node scripts/trim-audio.mjs --file "<original.m4a>" --start 1246.85 [--end S] [--note "..."]
 *   ... --transcript-only   re-cut and re-render the transcript only
 *
 * 1. writes a LOSSLESS trimmed copy (-c copy, no re-encode) to _web/audio/ -
 *    THE ORIGINAL IS NEVER TOUCHED; it stays the archive, chatter and all
 * 2. re-cuts the transcript to the same window, times shifted so they match the
 *    trimmed audio, and re-renders it (hallucinations removed)
 * 3. uploads the trimmed copy, points the hub entry at it
 * 4. DELETES the untrimmed copy from Convex. Storage URLs need no login, so
 *    leaving the old file up would leave the cut-out chatter reachable
 * 5. records the trim, so upload-audio can never quietly re-add the original
 *
 * Choose --start from the AUDIO, not only the transcript: Whisper timestamps
 * are only good to about half a second and snap to its 30s window after silence.
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { ROOT, readHub, writeHub, probe, renderTranscript, loopCheck, hms, windowSegments } from './lib/media.mjs';

const A = process.argv.slice(2);
const opt = k => { const i = A.indexOf(k); return i > -1 ? A[i + 1] : null; };
const FILE = opt('--file'), START = parseFloat(opt('--start') || 'NaN'), END = opt('--end') ? parseFloat(opt('--end')) : null;
const NOTE = opt('--note');
const TX_ONLY = A.includes('--transcript-only');   // re-render text; do not touch audio or Convex
const USER = process.env.CK_USER_ID, API = process.env.CONVEX_URL || 'https://cautious-monitor-526.convex.cloud';
if (!FILE || !fs.existsSync(FILE) || !(START >= 0)) { console.error('need --file <existing file> --start <seconds>'); process.exit(1); }
if (!USER && !TX_ONLY) { console.error('set CK_USER_ID to the curator user id'); process.exit(1); }

const WEB = path.join(ROOT, '_web'), TX = path.join(ROOT, '_transcripts');
const name = path.basename(FILE).replace(/\.[^.]+$/, '');
async function convex(kind, fn, args) {
  const r = await fetch(API + '/api/' + kind, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: fn, args, format: 'json' }) });
  const j = await r.json(); if (j.status !== 'success') throw new Error(fn + ': ' + (j.errorMessage || JSON.stringify(j)));
  return j.value;
}

// --- find the hub entry this file backs ---
const hub = readHub();
const entry = hub.entries.find(e => e.media === 'audio' && (e.source === FILE || e.file === FILE));
if (!entry) { console.error('no audio entry in the hub is backed by ' + FILE); process.exit(1); }
const oldSrc = entry.src;
const oldStorage = entry.storageId || null;   // set by a previous trim of this entry

// --- 1. lossless trim (skipped for --transcript-only: the published copy stays as it is) ---
fs.mkdirSync(path.join(WEB, 'audio'), { recursive: true });
const out = path.join(WEB, 'audio', name + '.m4a');
const args = ['-v','error','-y','-ss', String(START), '-i', FILE];
if (END !== null) args.push('-t', String(END - START));
if (!TX_ONLY) execFileSync('ffmpeg', [...args, '-c','copy','-movflags','+faststart', out]);
const before = parseFloat(execFileSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1', FILE]).toString());
const after = parseFloat(execFileSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1', out]).toString());
const expected = (END ?? before) - START;
if (Math.abs(after - expected) > 1.0) { console.error('trimmed length ' + after + 's, expected ~' + expected + 's - stopping'); process.exit(1); }
console.log(name + '\n  audio      ' + hms(before) + ' -> ' + hms(after) + '  (cut ' + hms(START) + ' from the start' + (END ? ', ended at ' + hms(END) : '') + ', lossless)');

// --- 2. transcript, same window ---
const rawDir = path.join(TX, 'raw'); fs.mkdirSync(rawDir, { recursive: true });
let rawPath = path.join(rawDir, name + '.json');
if (!fs.existsSync(rawPath) && fs.existsSync(path.join(TX, name + '.json'))) fs.renameSync(path.join(TX, name + '.json'), rawPath);
if (fs.existsSync(rawPath)) {
  const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const segs = windowSegments(raw.segments, START, END);   // shared rule - see lib
  const r = renderTranscript({ title: entry.what || name, lang: raw.language, total: after, segs, note: NOTE });
  fs.writeFileSync(path.join(TX, name + '.md'), r.md);
  fs.writeFileSync(path.join(TX, name + '.txt'), r.txt);
  const lc = loopCheck(r.keep, after);
  console.log('  transcript ' + r.keep.length + ' segments, ' + r.words + ' words, ' + r.dropped + ' hallucinations removed · check ' + (lc.length ? '!! ' + lc.join('; ') : 'clean'));
  console.log('             first line now: "' + (r.keep[0] ? r.keep[0].text.trim().slice(0, 70) : '') + '"');
} else console.log('  transcript (none found - run transcribe-audio first)');

if (TX_ONLY) { console.log('  (transcript only - audio and Convex untouched)'); process.exit(0); }

// --- 3. upload the trimmed copy ---
const upUrl = await convex('mutation', 'media:generateUploadUrl', { userId: USER });
const res = await fetch(upUrl, { method: 'POST', headers: { 'Content-Type': 'audio/mp4' }, body: fs.readFileSync(out) });
if (!res.ok) { console.error('upload failed: HTTP ' + res.status); process.exit(1); }
const { storageId } = await res.json();
const [{ url }] = await convex('query', 'media:urlsFor', { userId: USER, storageIds: [storageId] });
const d = probe(out);
entry.src = url; entry.storageId = storageId; entry.dur = d.dur; entry.source = FILE; entry.file = out;
entry.trim = { start: START, end: END };
writeHub(hub);
console.log('  published  ' + d.dur + ' at a new URL');

// --- 4. delete the untrimmed copy from Convex ---
const ledgerPath = path.join(WEB, 'audio.json');
const ledger = fs.existsSync(ledgerPath) ? JSON.parse(fs.readFileSync(ledgerPath, 'utf8')) : {};
// A RE-trim replaces a previous trimmed upload, which the ledger never recorded -
// so prefer the storage id stored on the entry, and only fall back to the ledger
// (which knows the ORIGINAL upload) the first time.
if (oldStorage) {
  await convex('mutation', 'media:remove', { userId: USER, storageId: oldStorage });
  console.log('  previous trimmed copy deleted from Convex');
}
const key = Object.keys(ledger).find(k => ledger[k].url === oldSrc);
if (!oldStorage && key && ledger[key].storageId) {
  await convex('mutation', 'media:remove', { userId: USER, storageId: ledger[key].storageId });
  // --- 5. remember it was replaced, so a re-run of upload-audio never re-adds it
  ledger[key] = { ...ledger[key], removed: true, replacedBy: url, trim: { start: START, end: END } };
  fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
  console.log('  untrimmed copy deleted from Convex');
} else if (!oldStorage) console.log('  !! could not find the old upload in audio.json - old copy NOT deleted');
