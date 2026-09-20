#!/usr/bin/env node
/**
 * Add uploaded YouTube videos to the hub, from their links.
 *
 * NO OAUTH: YouTube's oEmbed endpoint returns a video's TITLE unauthenticated,
 * and an unlisted video is reachable by link. Studio titles an upload after its
 * FILENAME (rewritten: IMG_0675.MOV -> "IMG 0675"), which is the join key back to
 * the file on disk. Date, time of day and duration then come from the FILE.
 *
 * Writes straight into private/video-hub.json - the hub's source of truth. It
 * used to print entries to paste into the page, but the page's list is now
 * GENERATED from the JSON, so anything pasted there would be wiped on the next
 * build. Re-running is safe: an id already in the hub is left alone, including
 * any description already written for it.
 *
 * STAGE BEFORE UPLOAD: `--stage <day>` adds a day's clips as entries with NO id,
 * so descriptions can be written from the drive while YouTube is still uploading.
 * A later link then FILLS THE ID INTO THAT ENTRY (matched by filename) instead of
 * adding a second copy, so the description written early is kept.
 *
 *   node scripts/link-videos.mjs --stage 091326
 *   node scripts/link-videos.mjs <url-or-id> [more...]
 *   pbpaste | node scripts/link-videos.mjs
 * then: node scripts/describe-videos.mjs  (descriptions)
 *       node scripts/build-hub-data.mjs   (JSON -> page)
 */
import fs from 'fs';
import path from 'path';
import { indexSources, oembedTitle, probe, clock, norm, timeKey, readHub, writeHub, HUB_JSON } from './lib/media.mjs';

function idOf(s) {
  s = String(s).trim();
  if (!s) return null;
  const m = /(?:v=|youtu\.be\/|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/.exec(s);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
}

const args = process.argv.slice(2);
const si = args.indexOf('--stage');
const stageDay = si > -1 ? args[si + 1] : null;
const rest = si > -1 ? args.filter((a, i) => i !== si && i !== si + 1) : args;
const input = stageDay ? [] : (rest.length ? rest : fs.readFileSync(0, 'utf8').split(/\s+/));
const ids = [...new Set(input.map(idOf).filter(Boolean))];
if (!stageDay && !ids.length) { console.error('no YouTube links or ids found'); process.exit(1); }

const hub = readHub() || { entries: [] };
const have = new Set(hub.entries.map(e => e.id).filter(Boolean));
const idx = indexSources();
const today = new Date().toISOString().slice(0, 10);
let added = 0, already = 0, failed = 0, linked = 0;

function entryFor(hit) {
  const meta = probe(hit.mov || hit.mp4);                 // the original carries the capture time
  const day = hit.day;
  return {
    kind: 'raw',
    date: meta.shot || ('20' + day.slice(4, 6) + '-' + day.slice(0, 2) + '-' + day.slice(2, 4)),
    time: clock(meta.time), place: '', what: '', dur: meta.dur, added: today,
    ...(meta.vertical ? { vertical: true } : {}),   // portrait clip -> 9:16 player
    base: hit.base, file: hit.mp4 || hit.mov,             // mp4 plays in any browser
  };
}

if (stageDay) {
  // Clips deliberately skipped (unusable takes) must not come back every time a day
  // is re-staged - staging adds anything absent from the hub, so it needs a memory.
  let skip = new Set();
  try { skip = new Set(JSON.parse(fs.readFileSync('private/video-skip.json', 'utf8')).skip || []); } catch {}
  const bases = new Set(hub.entries.map(e => e.base).filter(Boolean));
  for (const hit of Object.values(idx).filter(h => h.day === stageDay).sort((a, b) => a.base.localeCompare(b.base))) {
    if (skip.has(hit.base)) { console.log('  skipped (on the skip list)  ' + hit.base); continue; }
    if (bases.has(hit.base)) { console.log('  already in hub  ' + hit.base); already++; continue; }
    const e = entryFor(hit);
    hub.entries.push(e); added++;
    console.log('  staged  ' + hit.base + '  (' + e.date + ' ' + e.time + ', ' + e.dur + (e.vertical ? ', vertical' : '') + ')');
  }
}

for (const id of ids) {
  if (have.has(id)) { console.log('  already in hub  ' + id); already++; continue; }
  const t = await oembedTitle(id);
  if (!t) { console.error('  ' + id + ': no title (still a DRAFT? private? wrong id?)'); failed++; continue; }
  const hit = idx[norm(t)];
  if (!hit) { console.error('  ' + id + ': title "' + t + '" matches no file on disk'); failed++; continue; }
  // Staged earlier (described while the upload ran)? Fill the id in, keep the text.
  const staged = hub.entries.find(e => !e.id && e.base === hit.base);
  if (staged) {
    staged.id = id;
    have.add(id); linked++;
    console.log('  linked  ' + id + '  ->  ' + hit.base + (staged.what ? '  (kept: "' + staged.what + '")' : ''));
    continue;
  }
  const e = entryFor(hit);
  hub.entries.push({ id, ...e });
  have.add(id); added++;
  console.log('  added  ' + id + '  ->  ' + hit.base + '  (' + hit.day + ', ' + e.dur + ')');
}

// keep the hub in capture order so the page and the describe tool agree
hub.entries.sort((a, b) => (a.date + (a.media === 'audio' ? '~' : '') + timeKey(a.time))
  .localeCompare(b.date + (b.media === 'audio' ? '~' : '') + timeKey(b.time)));
writeHub(hub);
console.log('\nadded ' + added + ' · linked to staged ' + linked + ' · already there ' + already + ' · failed ' + failed + '  ->  ' + HUB_JSON);
if (added || linked) console.log('next: node scripts/describe-videos.mjs   then ask Claude to publish');
if (failed) process.exit(1);
