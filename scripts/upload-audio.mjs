#!/usr/bin/env node
/**
 * Upload the trip's audio recordings to Convex storage and add them to the hub
 * (private/video-hub.json). It used to print entries to paste into the page,
 * but the page's list is now GENERATED from that JSON, so pasted entries would
 * be wiped on the next build.
 *
 * Audio needs NO conversion: these are AAC in an .m4a container, which every
 * current browser plays natively. Re-encoding would cost quality for nothing.
 *
 * ORIGINALS ARE NEVER TOUCHED - this only reads them.
 * Resumable: already-uploaded files are recorded in _web/audio.json and skipped.
 *
 *   CK_USER_ID=<curator> node scripts/upload-audio.mjs [root] [--day 091026]
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { readHub, writeHub, HUB_JSON } from './lib/media.mjs';

const ARGS = process.argv.slice(2);
const ROOT = ARGS.find(a => a.startsWith('/')) || '/Volumes/Andromeda/Screenflow/Italy';
const di   = ARGS.indexOf('--day');
const ONLY = di > -1 ? ARGS[di + 1] : null;
const WEB  = path.join(ROOT, '_web');
const USER = process.env.CK_USER_ID;
const API  = process.env.CONVEX_URL || 'https://cautious-monitor-526.convex.cloud';
if (!USER) { console.error('set CK_USER_ID to the curator user id'); process.exit(1); }

const statePath = path.join(WEB, 'audio.json');
const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};
const save = () => fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

async function convex(kind, fnPath, args) {
  const r = await fetch(API + '/api/' + kind, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: fnPath, args, format: 'json' })
  });
  const j = await r.json();
  if (j.status !== 'success') throw new Error(fnPath + ': ' + (j.errorMessage || JSON.stringify(j)));
  return j.value;
}

function probe(f) {
  try {
    const d = execFileSync('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1', f], {encoding:'utf8'}).trim();
    const secs = Math.round(parseFloat(d));
    const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), s = secs%60;
    return h ? h + 'h' + String(m).padStart(2,'0') + 'm' : m + 'm' + String(s).padStart(2,'0') + 's';
  } catch { return ''; }
}

const days = fs.readdirSync(ROOT)
  .filter(d => /^\d{6}$/.test(d) && fs.statSync(path.join(ROOT,d)).isDirectory())
  .filter(d => !ONLY || d === ONLY).sort();

const entries = [];
for (const day of days) {
  const files = fs.readdirSync(path.join(ROOT, day))
    .filter(f => /\.(m4a|mp3|aac|wav)$/i.test(f) && !f.startsWith('.')).sort();
  for (const f of files) {
    const key = day + '/' + f;
    const abs = path.join(ROOT, day, f);
    if (!state[key] || !state[key].storageId) {
      const url = await convex('mutation', 'media:generateUploadUrl', { userId: USER });
      const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'audio/mp4' }, body: fs.readFileSync(abs) });
      if (!res.ok) { console.error('  FAILED ' + key + ' HTTP ' + res.status); continue; }
      const { storageId } = await res.json();
      state[key] = { storageId, bytes: fs.statSync(abs).size, dur: probe(abs) };
      save();
      console.log('  uploaded ' + key + '  (' + (state[key].bytes/1048576).toFixed(1) + ' MB, ' + state[key].dur + ')');
    } else {
      console.log('  already there ' + key);
    }
    entries.push({ key, day, file: f, ...state[key] });
  }
}

const need = entries.filter(e => !e.url).map(e => e.storageId);
if (need.length) {
  const rows = await convex('query', 'media:urlsFor', { userId: USER, storageIds: need });
  const byId = Object.fromEntries(rows.map(r => [r.storageId, r.url]));
  for (const k of Object.keys(state)) if (byId[state[k].storageId]) state[k].url = byId[state[k].storageId];
  save();
  for (const e of entries) e.url = state[e.key].url;
}

// Upsert into the hub - keyed by the stored URL, so re-running never duplicates
// an entry or overwrites a description someone has already written.
const hub = readHub() || { entries: [] };
const have = new Set(hub.entries.map(e => e.src).filter(Boolean));
const today = new Date().toISOString().slice(0, 10);
let added = 0;
for (const e of entries) {
  const url = state[e.key].url;
  if (!url || have.has(url)) continue;
  hub.entries.push({
    media: 'audio', src: url, kind: 'raw',
    date: '20' + e.day.slice(4, 6) + '-' + e.day.slice(0, 2) + '-' + e.day.slice(2, 4),
    place: '', what: '', dur: e.dur, added: today,
    file: path.join(ROOT, e.key),
  });
  added++;
}
writeHub(hub);
console.log('\nadded ' + added + ' audio entr' + (added === 1 ? 'y' : 'ies') + ' to ' + HUB_JSON);
if (added) console.log('next: node scripts/describe-videos.mjs   then ask Claude to publish');
