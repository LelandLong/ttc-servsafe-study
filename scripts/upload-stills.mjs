#!/usr/bin/env node
/**
 * Upload the converted stills to Convex file storage and record their URLs.
 *
 * Reads  <root>/_web/manifest.json   (written by scripts/convert-stills.mjs)
 * Writes <root>/_web/uploaded.json   storageId + URL per file, per size
 *
 * RESUMABLE. Every upload is recorded immediately, and an already-uploaded file
 * is skipped - so an interrupted run (hotel wifi) is restarted, not restarted
 * from scratch. Nothing here is destructive: it only adds files to storage.
 *
 * AUTH: curator only, via convex/media.ts, which is gated on CURATOR_USER_ID and
 * fails closed. Pass the curator's user id as CK_USER_ID - never hard-code it.
 *
 *   CK_USER_ID=<curator> node scripts/upload-stills.mjs [root] [--limit N]
 */
import fs from 'fs';
import path from 'path';

// argv[0] is the node binary and argv[1] this script - both absolute paths.
// Only USER arguments count.
const ARGS = process.argv.slice(2);
const ROOT = ARGS.find(a => a.startsWith('/')) || '/Volumes/Andromeda/Screenflow/Italy';
const WEB  = path.join(ROOT, '_web');
const li   = ARGS.indexOf('--limit');
const LIMIT = li > -1 ? parseInt(ARGS[li+1], 10) : Infinity;

const USER = process.env.CK_USER_ID;
const API  = process.env.CONVEX_URL || 'https://cautious-monitor-526.convex.cloud';
if (!USER) { console.error('set CK_USER_ID to the curator user id'); process.exit(1); }

const manifestPath = path.join(WEB, 'manifest.json');
if (!fs.existsSync(manifestPath)) { console.error('no manifest - run convert-stills.mjs first'); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const statePath = path.join(WEB, 'uploaded.json');
const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};

// 🛑 NEVER re-upload what was deliberately taken out.
// Two classes are excluded, and the guard lives HERE rather than only in the
// gallery build, because convert-stills regenerates the manifest from the
// originals - so a later run would happily re-upload a photo that was removed
// on purpose, and the URLs are unauthenticated once they exist.
//   · section "skip"  - personal / unrelated / not to be shared
//   · the plain half of an iPhone Portrait pair (IMG_NNNN when IMG_ENNNN also
//     exists) - the edited copy is the one with the depth-of-field blur
const secPath = path.join(WEB, 'sections.json');
const sections = fs.existsSync(secPath) ? JSON.parse(fs.readFileSync(secPath,'utf8')).photos || {} : {};
const allKeys = new Set(manifest.map(m => m.day + '/' + m.name));
function excluded(key){
  if (sections[key] && sections[key].section === 'skip') return 'skipped';
  const m = /^(.*\/)IMG_(\d+)$/.exec(key);
  if (m && allKeys.has(m[1] + 'IMG_E' + m[2])) return 'portrait-duplicate';
  return null;
}
const save  = () => fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

async function convex(kind, fnPath, args) {
  const r = await fetch(API + '/api/' + kind, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: fnPath, args, format: 'json' })
  });
  const j = await r.json();
  if (j.status !== 'success') throw new Error(fnPath + ': ' + (j.errorMessage || JSON.stringify(j)));
  return j.value;
}

async function uploadOne(absPath) {
  const url = await convex('mutation', 'media:generateUploadUrl', { userId: USER });
  const body = fs.readFileSync(absPath);
  const res = await fetch(url, { method:'POST', headers:{ 'Content-Type':'image/jpeg' }, body });
  if (!res.ok) throw new Error('upload HTTP ' + res.status);
  const { storageId } = await res.json();
  if (!storageId) throw new Error('no storageId returned');
  return storageId;                       // read back from the issuer, never invented
}

let done = 0, skipped = 0, failed = 0, n = 0, excludedCount = 0;
for (const m of manifest) {
  if (n >= LIMIT) break;
  const key = m.day + '/' + m.name;
  const why = excluded(key);
  if (why) { excludedCount++; continue; }
  state[key] = state[key] || {};
  let touched = false;
  for (const size of ['full','thumb']) {
    if (state[key][size] && state[key][size].storageId) { skipped++; continue; }
    const abs = path.join(WEB, m[size]);
    if (!fs.existsSync(abs)) { console.error('  missing ' + abs); failed++; continue; }
    try {
      const storageId = await uploadOne(abs);
      state[key][size] = { storageId, bytes: fs.statSync(abs).size };
      done++; touched = true;
    } catch (e) { console.error('  FAILED ' + key + ' ' + size + ': ' + e.message); failed++; }
  }
  if (touched) { save(); n++; if (n % 20 === 0) console.log('  uploaded ' + n + ' photos...'); }
}
save();

// Resolve every storage id to a URL in ONE call rather than one per file.
const ids = [];
for (const k of Object.keys(state)) for (const s of ['full','thumb'])
  if (state[k][s] && state[k][s].storageId && !state[k][s].url) ids.push(state[k][s].storageId);

if (ids.length) {
  console.log('resolving ' + ids.length + ' URLs...');
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i+200);
    const rows = await convex('query', 'media:urlsFor', { userId: USER, storageIds: chunk });
    const byId = Object.fromEntries(rows.map(r => [r.storageId, r.url]));
    for (const k of Object.keys(state)) for (const s of ['full','thumb']) {
      const e = state[k][s];
      if (e && byId[e.storageId]) e.url = byId[e.storageId];
    }
  }
  save();
}

const withUrl = Object.values(state).reduce((a,v) =>
  a + ['full','thumb'].filter(s => v[s] && v[s].url).length, 0);
console.log('\nuploaded ' + done + ' · already there ' + skipped + ' · failed ' + failed + ' · excluded ' + excludedCount);
console.log('files with URLs: ' + withUrl);
console.log('state: ' + statePath);
if (failed) process.exit(1);
