#!/usr/bin/env node
/**
 * Regenerate every transcript output from the RAW Whisper JSON plus each
 * recording's trim, for all audio in the hub:
 *   _transcripts/<name>.md / .txt   readable text
 *   _transcripts/<name>.tx.json     structured paragraphs - embedded in the app
 *                                   by build-hub-data for the Transcript button
 *   _transcripts/<name>.html        a SELF-CONTAINED, text-only copy for
 *                                   reading on the laptop (audio lives in the app)
 * Everything stays on the drive: transcripts contain other people's speech.
 *
 *   node scripts/build-transcripts.mjs
 */
import fs from 'fs';
import path from 'path';
import { ROOT, readHub, renderTranscript, transcriptHtml, windowSegments, loopCheck, hms } from './lib/media.mjs';

const TX = path.join(ROOT, '_transcripts');
const hub = readHub();
if (!hub) { console.error('no hub data'); process.exit(1); }
let n = 0;
for (const e of hub.entries.filter(x => x.media === 'audio')) {
  const src = e.source || e.file;
  const name = path.basename(src || '').replace(/\.[^.]+$/, '');
  const rawPath = [path.join(TX, 'raw', name + '.json'), path.join(TX, name + '.json')].find(fs.existsSync);
  if (!rawPath) { console.log('  no transcript yet for ' + name + ' - run transcribe-audio'); continue; }
  const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  const start = e.trim ? e.trim.start : 0, end = e.trim ? e.trim.end : null;
  const total = (end ?? raw.duration) - start;
  const segs = windowSegments(raw.segments, start, end);
  const r = renderTranscript({ title: e.what || name, lang: raw.language, total, segs, note: e.note });
  // same date style as the rest of the hub ("Sep 10"), not the raw ISO string
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pretty = d => { const [y, m, dd] = String(d || '').split('-').map(Number); return m ? MON[m - 1] + ' ' + dd : ''; };
  const meta = [pretty(e.date), e.place, e.dur, r.words.toLocaleString('en-US') + ' words'].filter(Boolean).join(' · ');
  fs.writeFileSync(path.join(TX, name + '.md'), r.md);
  fs.writeFileSync(path.join(TX, name + '.txt'), r.txt);
  fs.writeFileSync(path.join(TX, name + '.tx.json'), JSON.stringify({ title: e.what || name, meta, paras: r.paras }));
  // text-only: see transcriptHtml - an unverifiable local player is not shipped
  fs.writeFileSync(path.join(TX, name + '.html'), transcriptHtml({ title: e.what || name, meta, note: e.note, paras: r.paras, audio: null }));
  const lc = loopCheck(r.keep, total);
  console.log('  ' + (e.what || name).padEnd(22) + ' ' + String(r.paras.filter(p => p.x).length).padStart(3) + ' paragraphs · ' +
              r.words + ' words · starts at ' + hms(start) + ' of the original · check ' + (lc.length ? '!! ' + lc.join('; ') : 'clean'));
  n++;
}
console.log('built ' + n + ' transcript(s) in ' + TX);
