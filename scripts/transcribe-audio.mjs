#!/usr/bin/env node
/**
 * Transcribe trip audio LOCALLY with Whisper - nothing is uploaded.
 *
 * Follows the method recorded in ttc-coursework/HOS190/_media-in-dropbox.md,
 * which was learned the hard way: a single-pass run "looked perfect - exit 0, a
 * 2 MB JSON, the right duration - and was garbage from the 5-minute mark on",
 * because Whisper fed its own output back as context and locked into repeating
 * one phrase for two hours. So:
 *   - cut the audio into 10-minute chunks
 *   - transcribe each with --condition-on-previous-text False (context resets at
 *     every boundary, so a loop cannot propagate)
 *   - stitch the segments back with each chunk's time offset
 *   - run the ACCEPTANCE CHECK before trusting it: unique segments per 5-minute
 *     block. A populated block with <= 3 unique lines is a loop.
 *
 * LANGUAGE: detected once from a sample, then forced for every chunk - a chunk
 * that is mostly silence or applause can otherwise be mis-detected, and forcing
 * English onto Italian speech produces confident nonsense. Pass --language to
 * override.
 *
 * Output goes to the DRIVE, never this repo: recordings of a group contain other
 * people's voices and conversation.
 *
 *   node scripts/transcribe-audio.mjs <file.m4a> [more...] [--language en] [--force]
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { loopCheck, renderTranscript } from './lib/media.mjs';

const ARGS = process.argv.slice(2);
const FORCE = ARGS.includes('--force');
const li = ARGS.indexOf('--language');
const LANG = li > -1 ? ARGS[li + 1] : null;
const files = ARGS.filter((a, i) => !a.startsWith('--') && ARGS[i - 1] !== '--language');
const OUT = process.env.TRANSCRIPT_DIR || '/Volumes/Andromeda/Screenflow/Italy/_transcripts';
const MODEL = 'mlx-community/whisper-large-v3-turbo';
const CHUNK = 600;                       // seconds
if (!files.length) { console.error('usage: transcribe-audio.mjs <file> [...] [--language xx]'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });

const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] }).toString();
const dur = f => parseFloat(run('ffprobe', ['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1', f]));
const hms = t => { t = Math.max(0, Math.floor(t)); const h = Math.floor(t/3600), m = Math.floor(t%3600/60), s = t%60;
  return (h ? h + ':' + String(m).padStart(2,'0') : String(m)) + ':' + String(s).padStart(2,'0'); };

function whisper(wav, dir, lang) {
  const a = [wav, '--model', MODEL, '--output-format', 'json', '--output-dir', dir,
             '--condition-on-previous-text', 'False'];
  if (lang) a.push('--language', lang);
  run('mlx_whisper', a);
  return JSON.parse(fs.readFileSync(path.join(dir, path.basename(wav).replace(/\.wav$/, '.json')), 'utf8'));
}

for (const file of files) {
  const name = path.basename(file).replace(/\.[^.]+$/, '');
  const outBase = path.join(OUT, name);
  if (!FORCE && fs.existsSync(outBase + '.json')) { console.log('  already done: ' + name + '  (--force to redo)'); continue; }
  const total = dur(file);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tx-'));
  console.log('\n' + name + '  (' + hms(total) + ')');

  // 1. language, from a sample past any opening silence
  let lang = LANG;
  if (!lang) {
    const at = Math.min(240, total / 3);
    const s = path.join(tmp, 'probe.wav');
    run('ffmpeg', ['-v','error','-y','-ss', String(at), '-t','60','-i', file,'-ar','16000','-ac','1', s]);
    lang = whisper(s, tmp, null).language || 'en';
  }
  console.log('  language: ' + lang);

  // 2. chunk + transcribe + stitch
  const segs = [];
  const n = Math.ceil(total / CHUNK);
  for (let k = 0; k < n; k++) {
    const wav = path.join(tmp, 'c' + k + '.wav');
    run('ffmpeg', ['-v','error','-y','-ss', String(k * CHUNK), '-t', String(CHUNK), '-i', file,'-ar','16000','-ac','1', wav]);
    const d = whisper(wav, tmp, lang);
    for (const s of d.segments || []) segs.push({ ...s, start: s.start + k * CHUNK, end: s.end + k * CHUNK });
    process.stdout.write('  chunk ' + (k + 1) + '/' + n + ': ' + (d.segments || []).length + ' segments\n');
  }

  // 3. the acceptance check runs on the RAW segments - it reports what Whisper did
  const problems = loopCheck(segs, total);
  // 4. write the raw JSON (everything) and a cleaned, readable transcript
  fs.writeFileSync(outBase + '.json', JSON.stringify({ file, language: lang, model: MODEL, duration: total, segments: segs }, null, 1));
  const r = renderTranscript({ title: name, lang, total, segs });
  fs.writeFileSync(outBase + '.md', r.md);
  fs.writeFileSync(outBase + '.txt', r.txt);
  const after = loopCheck(r.keep, total);
  console.log('  segments ' + segs.length + ' (' + r.dropped + ' removed as hallucination) · words ' + r.words);
  console.log('  loop check (raw)    : ' + (problems.length ? problems.length + ' issue(s): ' + problems.join('; ') : 'clean'));
  console.log('  loop check (cleaned): ' + (after.length ? '!! ' + after.join('; ') : 'clean'));
  console.log('  -> ' + outBase + '.md');
  fs.rmSync(tmp, { recursive: true, force: true });
}
