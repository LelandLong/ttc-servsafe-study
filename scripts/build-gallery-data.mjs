#!/usr/bin/env node
/**
 * Merge manifest + your sorting + the uploaded URLs into the gallery's PHOTOS
 * array, and write it into private/photos.html.
 *
 * Inputs (all under <root>/_web, none of them in this repo):
 *   manifest.json   what exists, and the EXIF shoot date
 *   sections.json   your one-keypress sorting, and any per-day places
 *   uploaded.json   Convex storage ids + URLs
 *
 * EXCLUDED, and it re-derives this rather than trusting a stale list:
 *   · section "skip"                     personal / unrelated / not to be shared
 *   · the plain half of a Portrait pair   IMG_NNNN when IMG_ENNNN also exists;
 *                                         the edited copy carries the blur
 *
 * Place and caption are OPTIONAL - the page prints only the parts that exist.
 *
 *   node scripts/build-gallery-data.mjs [root]
 */
import fs from 'fs';
import path from 'path';

const ARGS = process.argv.slice(2);
const ROOT = ARGS.find(a => a.startsWith('/')) || '/Volumes/Andromeda/Screenflow/Italy';
const WEB  = path.join(ROOT, '_web');
const PAGE = 'private/photos.html';

const manifest = JSON.parse(fs.readFileSync(path.join(WEB,'manifest.json'),'utf8'));
const secFile  = JSON.parse(fs.readFileSync(path.join(WEB,'sections.json'),'utf8'));
const uploaded = JSON.parse(fs.readFileSync(path.join(WEB,'uploaded.json'),'utf8'));
const sections = secFile.photos || {};
const places   = secFile.places || {};

// NO COOKING CONCEPT ON THE PHOTO PAGE. Cooking class was captured on VIDEO, not
// stills - a cooking-class day badge here labelled whole days off one stray shot,
// and the "cooking demos" section held exactly 1 photo out of 226. Leland asked
// for it stripped entirely. The one genuine cooking-class still (9/8) is folded
// into "food", which is the closest home; it is not discarded.
const SECTION_MAP = { cooking: 'food' };

const allKeys = new Set(manifest.map(m => m.day + '/' + m.name));
function excluded(key){
  if (sections[key] && sections[key].section === 'skip') return true;
  const m = /^(.*\/)IMG_(\d+)$/.exec(key);
  return !!(m && allKeys.has(m[1] + 'IMG_E' + m[2]));
}

// Each photo keeps the date it was FIRST added. This used to stamp every row with
// today, so each rebuild marked the whole gallery "new" - found 2026-09-12, when
// adding one day's 62 photos made "Recently added" show all 304. Matched by image
// URL, which is fixed once uploaded; only photos not already on the page get today.
const now = new Date();
const ADDED = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
const prevAdded = {};
for (const ln of fs.readFileSync(PAGE, 'utf8').split('\n')) {
  const m = /^\s*\{ src:("(?:[^"\\]|\\.)*").*, added:("\d{4}-\d\d-\d\d") \},?$/.exec(ln);
  if (m) prevAdded[JSON.parse(m[1])] = JSON.parse(m[2]);
}
const rows = [];
let noUrl = 0, unsorted = 0;

for (const m of manifest) {
  const key = m.day + '/' + m.name;
  if (excluded(key)) continue;
  let sec = sections[key] && sections[key].section;
  sec = SECTION_MAP[sec] || sec;
  if (!sec || sec === 'skip') { unsorted++; continue; }
  const up = uploaded[key];
  if (!up || !up.full || !up.full.url || !up.thumb || !up.thumb.url) { noUrl++; continue; }
  rows.push({
    src:   up.full.url,
    thumb: up.thumb.url,
    section: sec,
    date:  m.shot,
    time:  m.shotTime || '',
    place: places[m.shot] || '',
    what:  (sections[key].what || ''),
    added: prevAdded[up.full.url] || ADDED
  });
}

rows.sort((a,b) => (b.date + (b.time||'')).localeCompare(a.date + (a.time||'')));

const lines = rows.map(r =>
  '  { src:' + JSON.stringify(r.src) +
  ', thumb:' + JSON.stringify(r.thumb) +
  ', section:' + JSON.stringify(r.section) +
  ', date:' + JSON.stringify(r.date) +
  (r.place ? ', place:' + JSON.stringify(r.place) : ', place:""') +
  (r.what  ? ', what:'  + JSON.stringify(r.what)  : ', what:""') +
  ', added:' + JSON.stringify(r.added) +
  ' }'
).join(',\n');

let html = fs.readFileSync(PAGE, 'utf8');
const start = html.indexOf('var PHOTOS = [');
if (start < 0) { console.error('PHOTOS array not found in ' + PAGE); process.exit(1); }
const end = html.indexOf('];', start) + 2;
html = html.slice(0, start) + 'var PHOTOS = [\n' + lines + '\n];' + html.slice(end);
fs.writeFileSync(PAGE, html);

const by = rows.reduce((a,r) => (a[r.section] = (a[r.section]||0)+1, a), {});
console.log('  gallery entries : ' + rows.length);
console.log('  kept added date : ' + rows.filter(r => prevAdded[r.src]).length + '   new today (' + ADDED + '): ' + rows.filter(r => !prevAdded[r.src]).length);
for (const k of ['food','out']) console.log('    ' + k.padEnd(8) + (by[k]||0));
console.log('  excluded        : ' + (manifest.length - rows.length - noUrl - unsorted));
console.log('  no URL (skipped): ' + noUrl + '   unsorted: ' + unsorted);
console.log('  captions written: ' + rows.filter(r => r.what).length);
console.log('  days with a place set: ' + Object.keys(places).length);
console.log('  wrote ' + PAGE);
