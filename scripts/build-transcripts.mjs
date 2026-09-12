#!/usr/bin/env node
/**
 * Regenerate every transcript output from the RAW Whisper JSON plus each
 * recording's trim, for all audio in the hub:
 *   _transcripts/<name>.md / .txt   readable text
 *   _transcripts/<name>.tx.json     structured paragraphs - embedded in the app
 *                                   by build-hub-data for the Transcript button
 *   _transcripts/<name>.html        a SELF-CONTAINED, text-only copy for
 *                                   reading on the laptop (audio lives in the app)
 *
 * CONTEXT-RECONCILED TEXT WINS when it exists: _transcripts/<name>.ctx.json
 * ({method, paras}) is written by reading several machine transcriptions of the
 * same audio side by side and choosing what makes sense on the tour - "opera
 * art" is "opera house" in an opera house. Its paragraphs use the same {t, x} /
 * {t, g} shape, with {braces} around words that are a best guess from context
 * (shown in italics) and [unclear] where no reading made sense. Timestamps are
 * seconds into the PUBLISHED (trimmed) audio, so tap-to-seek lines up.
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
  const ctxPath = path.join(TX, name + '.ctx.json');
  if (fs.existsSync(ctxPath)) {
    const ctx = JSON.parse(fs.readFileSync(ctxPath, 'utf8'));
    r.paras = ctx.paras;
    r.words = ctx.paras.filter(p => p.x).reduce((a, p) => a + p.x.replace(/\[unclear\]/g, '').split(/\s+/).filter(Boolean).length, 0);
    r.md = '# ' + (e.what || name) + '\n\n*' + ctx.method + '*\n\n' + (e.note ? '> ' + e.note + '\n\n' : '') +
      ctx.paras.map(p => p.g !== undefined ? '*[' + hms(p.t) + ' – ' + hms(p.t + p.g) + ' · no clear speech]*'
                                           : '**[' + hms(p.t) + ']** ' + p.x.replace(/\{([^}]*)\}/g, '*$1*')).join('\n\n') + '\n';
    r.txt = ctx.paras.filter(p => p.x).map(p => p.x.replace(/[{}]/g, '')).join('\n') + '\n';
  }
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
  console.log('  ' + (e.what || name).padEnd(22) + (fs.existsSync(ctxPath) ? ' [context-reconciled]' : ' [machine]') + ' ' + String(r.paras.filter(p => p.x).length).padStart(3) + ' paragraphs · ' +
              r.words + ' words · starts at ' + hms(start) + ' of the original · check ' + (lc.length ? '!! ' + lc.join('; ') : 'clean'));
  n++;
}
console.log('built ' + n + ' transcript(s) in ' + TX);
