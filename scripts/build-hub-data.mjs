#!/usr/bin/env node
/**
 * The video hub's entries live in private/video-hub.json (gitignored). This
 * writes them into the VIDEOS array of private/video-hub.html - the same shape as
 * build-gallery-data does for the photos.
 *
 * WHY A DATA FILE: the list used to exist ONLY as a JavaScript literal inside the
 * page, edited by regex. That is how a replace() silently matched nothing and
 * shipped an undefined function. Tools now edit JSON; this is the one place that
 * turns JSON into page code.
 *
 *   node scripts/build-hub-data.mjs            JSON -> page
 *   node scripts/build-hub-data.mjs --import   page -> JSON (one-time migration;
 *                                              refuses to overwrite existing JSON)
 *
 * Fields: `what` is the human description (may be empty); `time` is the capture
 * clock time, kept separately so a description never erases it. The page shows
 * what || time, so an undescribed clip still reads sensibly.
 */
import fs from 'fs';
import vm from 'vm';
import path from 'path';
import { ROOT, HUB_JSON, HUB_PAGE, readHub, writeHub, indexSources, oembedTitle, norm, isClockLabel } from './lib/media.mjs';

const START = 'var VIDEOS = [', END = '\n];';
const page = fs.readFileSync(HUB_PAGE, 'utf8');
const a = page.indexOf(START), b = page.indexOf(END, a);
if (a < 0 || b < 0) { console.error('VIDEOS array not found in ' + HUB_PAGE); process.exit(1); }

if (process.argv.includes('--import')) {
  if (readHub()) { console.error(HUB_JSON + ' already exists - refusing to overwrite it'); process.exit(1); }
  // Evaluate the literal rather than regex-parse it: it has comments, quotes and
  // nesting, and it is our own file.
  const entries = vm.runInNewContext(page.slice(a, b + END.length) + '\nVIDEOS');
  const idx = indexSources();
  const audioMap = {};
  const aj = path.join(ROOT, '_web', 'audio.json');
  if (fs.existsSync(aj)) for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(aj, 'utf8'))))
    if (v.url) audioMap[v.url] = path.join(ROOT, k);

  const out = [];
  for (const e of entries) {
    const r = { ...e };
    if (isClockLabel(r.what)) { r.time = r.what; r.what = ''; }     // a time is not a description
    // ...and neither is a filename: the audio entries were labelled with theirs
    const fileLabel = f => f ? path.basename(f).replace(/\.[^.]+$/, '') : null;
    if (r.media === 'audio') {
      r.file = audioMap[r.src] || null;
      if (r.what && r.what === fileLabel(r.file)) r.what = '';
    } else if (r.id) {
      const t = await oembedTitle(r.id);
      const hit = t ? idx[norm(t)] : null;
      r.base = hit ? hit.base : null;
      r.file = hit ? (hit.mp4 || hit.mov) : null;                   // mp4 plays in every browser
    }
    out.push(r);
    console.log('  ' + (r.id || 'audio').padEnd(12) + ' ' + (r.base || path.basename(r.file || '?')).padEnd(44) +
                (r.file ? 'file OK' : 'NO LOCAL FILE'));
  }
  writeHub({ entries: out });
  console.log('imported ' + out.length + ' entries -> ' + HUB_JSON);
}

const hub = readHub();
if (!hub) { console.error('no ' + HUB_JSON + ' - run with --import first'); process.exit(1); }

// Only what the PAGE needs. Local paths stay out of a page served from Convex.
const FIELDS = ['id','media','src','tid','kind','rank','date','time','place','what','dur','added','cook','note','desc','vertical'];  // vertical: a 9:16 video (a YouTube Short) - played in a tall player
const lit = e => '  { ' + FIELDS.filter(f => e[f] !== undefined && e[f] !== null && e[f] !== '')
  .map(f => f + ':' + JSON.stringify(e[f])).join(', ') + ' }';

// Transcripts ride in the page too - behind the login, and readable offline like
// the rest of it - but in their OWN block, delimited by markers, so the public
// preview can remove the whole thing by position without parsing the text.
// They contain other people's speech; they must never reach the public repo.
const TX_OPEN = '/*TX*/', TX_CLOSE = '/*/TX*/';
const transcripts = {};
for (const e of hub.entries) {
  if (e.media !== 'audio') continue;
  const name = path.basename(e.source || e.file || '').replace(/\.[^.]+$/, '');
  const f = path.join(ROOT, '_transcripts', name + '.tx.json');
  e.tid = norm(name);
  if (fs.existsSync(f)) transcripts[e.tid] = JSON.parse(fs.readFileSync(f, 'utf8'));
}
// </script> inside a transcript would end the script block early - escape '<'.
const txBlock = TX_OPEN + 'var TRANSCRIPTS = ' + JSON.stringify(transcripts).replace(/</g, '\\u003c') + ';' + TX_CLOSE;

const body = START + '\n  /* GENERATED from ' + HUB_JSON + ' by scripts/build-hub-data.mjs - edit the\n' +
  '     JSON (or run scripts/describe-videos.mjs), not this array. */\n' +
  hub.entries.map(lit).join(',\n') + END;
let rest = page.slice(b + END.length);
const o = rest.indexOf(TX_OPEN), c = rest.indexOf(TX_CLOSE);
// Drop the previous block TOGETHER WITH the newline this build put in front of it -
// leaving that newline behind made blank lines pile up one per rebuild, so the
// output was never byte-identical twice and real diffs were buried in noise.
if (o > -1 && c > o) rest = rest.slice(0, o).replace(/\n$/, '') + rest.slice(c + TX_CLOSE.length);
fs.writeFileSync(HUB_PAGE, page.slice(0, a) + body + '\n' + txBlock + rest);
for (const e of hub.entries) delete e.tid;   // derived at build time; never stored

const described = hub.entries.filter(e => e.what).length;
console.log('wrote ' + hub.entries.length + ' entries into ' + HUB_PAGE + '  (' + described + ' described, ' + Object.keys(transcripts).length + ' transcripts)');
