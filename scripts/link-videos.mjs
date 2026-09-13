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
 *   node scripts/link-videos.mjs <url-or-id> [more...]
 *   pbpaste | node scripts/link-videos.mjs
 * then: node scripts/describe-videos.mjs  (descriptions)
 *       node scripts/build-hub-data.mjs   (JSON -> page)
 */
import fs from 'fs';
import path from 'path';
import { indexSources, oembedTitle, probe, clock, norm, readHub, writeHub, HUB_JSON } from './lib/media.mjs';

function idOf(s) {
  s = String(s).trim();
  if (!s) return null;
  const m = /(?:v=|youtu\.be\/|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/.exec(s);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;
}

const args = process.argv.slice(2);
const input = args.length ? args : fs.readFileSync(0, 'utf8').split(/\s+/);
const ids = [...new Set(input.map(idOf).filter(Boolean))];
if (!ids.length) { console.error('no YouTube links or ids found'); process.exit(1); }

const hub = readHub() || { entries: [] };
const have = new Set(hub.entries.map(e => e.id).filter(Boolean));
const idx = indexSources();
const today = new Date().toISOString().slice(0, 10);
let added = 0, already = 0, failed = 0;

for (const id of ids) {
  if (have.has(id)) { console.log('  already in hub  ' + id); already++; continue; }
  const t = await oembedTitle(id);
  if (!t) { console.error('  ' + id + ': no title (still a DRAFT? private? wrong id?)'); failed++; continue; }
  const hit = idx[norm(t)];
  if (!hit) { console.error('  ' + id + ': title "' + t + '" matches no file on disk'); failed++; continue; }
  const meta = probe(hit.mov || hit.mp4);                 // the original carries the capture time
  const day = hit.day;
  hub.entries.push({
    id, kind: 'raw',
    date: meta.shot || ('20' + day.slice(4, 6) + '-' + day.slice(0, 2) + '-' + day.slice(2, 4)),
    time: clock(meta.time), place: '', what: '', dur: meta.dur, added: today,
    ...(meta.vertical ? { vertical: true } : {}),   // portrait clip -> 9:16 player
    base: hit.base, file: hit.mp4 || hit.mov,             // mp4 plays in any browser
  });
  have.add(id); added++;
  console.log('  added  ' + id + '  ->  ' + hit.base + '  (' + day + ', ' + meta.dur + ')');
}

// keep the hub in capture order so the page and the describe tool agree
hub.entries.sort((a, b) => (a.date + (a.media === 'audio' ? '~' : '') + (a.time || ''))
  .localeCompare(b.date + (b.media === 'audio' ? '~' : '') + (b.time || '')));
writeHub(hub);
console.log('\nadded ' + added + ' · already there ' + already + ' · failed ' + failed + '  ->  ' + HUB_JSON);
if (added) console.log('next: node scripts/describe-videos.mjs   then ask Claude to publish');
if (failed) process.exit(1);
