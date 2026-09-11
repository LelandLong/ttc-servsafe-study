/**
 * Shared helpers for the trip-media scripts, so the linker, the hub builder and
 * the description tool resolve files and read metadata the SAME way. Three copies
 * of "match a YouTube title back to a file" would drift - one already did, when
 * YouTube turned IMG_0675 into "IMG 0675".
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

export const ROOT = '/Volumes/Andromeda/Screenflow/Italy';
export const HUB_JSON = process.env.HUB_JSON || 'private/video-hub.json';   // gitignored
export const HUB_PAGE = 'private/video-hub.html';                            // gitignored

// YouTube rewrites the filename it titles an upload with: IMG_0675.MOV becomes
// "IMG 0675". Compare on a normalised key or every match looks broken.
export const norm = s => String(s).trim().toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/g, '');

// Every source video/audio file on the drive, keyed by normalised basename.
// Keeps BOTH the original and the transcode: the .MOV carries the capture time,
// the .mp4 plays in any browser (HEVC .MOV plays only in Safari).
export function indexSources(root = ROOT) {
  const out = {};
  if (!fs.existsSync(root)) return out;
  for (const day of fs.readdirSync(root).filter(d => /^\d{6}$/.test(d))) {
    const dir = path.join(root, day);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.startsWith('.')) continue;
      const m = /\.(mov|mp4|m4a|mp3|aac|wav)$/i.exec(f);
      if (!m) continue;
      const base = f.replace(/\.[^.]+$/, '');
      const k = norm(base);
      const e = (out[k] = out[k] || { base, day });
      e[m[1].toLowerCase()] = path.join(dir, f);
    }
  }
  return out;
}

export async function oembedTitle(id) {
  const r = await fetch('https://www.youtube.com/oembed?url=' +
    encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json');
  if (!r.ok) return null;
  return (await r.json()).title;
}

// CAPTURE TIME MUST BE LOCAL. `creation_time` is UTC: IMG_0672 says 10:01Z, and
// the published label read "10:01 AM" when the bus ride was at 12:01 PM in Italy.
// iPhones also write com.apple.quicktime.creationdate WITH its offset - that is
// the wall-clock time the person saw, so it wins whenever it is present.
export function probe(file) {
  try {
    const out = execFileSync('ffprobe', ['-v','error','-show_entries',
      'format=duration:format_tags','-of','default=nw=1', file], { encoding: 'utf8' });
    const d = /duration=([\d.]+)/.exec(out);
    const local = /com\.apple\.quicktime\.creationdate=(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(out);
    const utc = /TAG:creation_time=(\S+)/.exec(out);
    let c = null;
    if (local) c = [null, local[1] + 'T' + local[2]];
    else if (utc) {                        // no local tag: convert UTC in this machine's zone
      const t = new Date(utc[1]);
      const z = n => String(n).padStart(2, '0');
      c = [null, t.getFullYear() + '-' + z(t.getMonth() + 1) + '-' + z(t.getDate()) + 'T' + z(t.getHours()) + ':' + z(t.getMinutes())];
    }
    const secs = d ? Math.round(parseFloat(d[1])) : 0;
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    return {
      dur: h ? h + 'h' + String(m).padStart(2, '0') + 'm' : m + 'm' + String(s).padStart(2, '0') + 's',
      shot: c ? c[1].slice(0, 10) : null,
      time: c ? c[1].slice(11, 16) : null,
    };
  } catch { return { dur: '', shot: null, time: null }; }
}

export function clock(t) {
  if (!t) return '';
  const [H, M] = t.split(':').map(Number);
  return (H % 12 === 0 ? 12 : H % 12) + ':' + String(M).padStart(2, '0') + ' ' + (H >= 12 ? 'PM' : 'AM');
}
export const isClockLabel = s => /^\d{1,2}:\d{2} [AP]M$/.test(String(s || '').trim());

export function readHub() {
  return fs.existsSync(HUB_JSON) ? JSON.parse(fs.readFileSync(HUB_JSON, 'utf8')) : null;
}
export function writeHub(hub) {
  fs.writeFileSync(HUB_JSON, JSON.stringify(hub, null, 2) + '\n');
}
// Stable identity for an entry: the YouTube id for video, the stored URL for audio.
export const keyOf = e => e.id || e.src || null;

/* ---------- transcripts ---------- */

// Which Whisper segments to TRUST. Two documented failure modes:
//  1. compression_ratio > 2.4 is Whisper's OWN hallucination threshold - the text
//     is far more repetitive than speech. File 1 ended with "I'm sorry" x26 at
//     ratio 7.0, and the first loop check never looked at this number.
//  2. A few words spread over a long window is Whisper narrating silence or music:
//     a real "Thank you." takes half a second, not the full 30-second window it
//     was reported across, again and again, at exactly 30s spacing.
export function isHallucination(s) {
  if ((s.compression_ratio ?? 0) > 2.4) return true;
  const words = String(s.text || '').trim().split(/\s+/).filter(Boolean).length;
  const span = (s.end ?? s.start) - s.start;
  if (words <= 3 && span >= 10) return true;
  return !String(s.text || '').replace(/[.\s]/g, '');     // empty or dots only
}

// The acceptance check. The first version only counted unique lines per
// 5-minute block, which a SHORT loop inside an otherwise varied block sails
// through - it called file 1 "clean". Now three independent signals, any of
// which fails the transcript.
export function loopCheck(segs, total) {
  const problems = [];
  const hi = segs.filter(s => (s.compression_ratio ?? 0) > 2.4);
  if (hi.length) problems.push(hi.length + ' segment(s) over the 2.4 compression ratio, from ' + Math.floor(hi[0].start) + 's');
  let run = 1;
  for (let i = 1; i < segs.length; i++) {
    const same = segs[i].text.trim().toLowerCase() === segs[i - 1].text.trim().toLowerCase();
    run = same ? run + 1 : 1;
    if (run === 4) problems.push('4+ identical lines in a row at ' + Math.floor(segs[i - 3].start) + 's: "' + segs[i].text.trim().slice(0, 30) + '"');
  }
  for (let b = 0; b * 300 < total; b++) {
    const inB = segs.filter(s => s.start >= b * 300 && s.start < (b + 1) * 300);
    const uniq = new Set(inB.map(s => s.text.trim().toLowerCase())).size;
    if (inB.length >= 10 && uniq <= 3) problems.push('block at ' + b * 5 + ' min: ' + uniq + ' unique of ' + inB.length);
  }
  return problems;
}

const hms = t => { t = Math.max(0, Math.floor(t)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : String(m)) + ':' + String(s).padStart(2, '0'); };
export { hms };

// Render a readable transcript from Whisper segments. Hallucinated segments are
// dropped from the TEXT (the raw JSON keeps everything), and any stretch of 20s+
// with no trusted speech is marked rather than silently closed up - a reader
// should know a minute of music or silence was there.
export function renderTranscript({ title, lang, total, segs, note }) {
  const keep = segs.filter(s => !isHallucination(s) &&
    !((s.no_speech_prob ?? 0) > 0.6 && (s.avg_logprob ?? 0) < -1.0));
  const paras = []; let cur = null, lastEnd = 0;
  for (const s of keep) {
    if (s.start - lastEnd >= 20) {
      paras.push({ gap: true, from: lastEnd, len: s.start - lastEnd });
      cur = null;
    }
    if (!cur || s.start - cur.start >= 60) { cur = { start: s.start, text: [] }; paras.push(cur); }
    cur.text.push(s.text.trim());
    lastEnd = Math.max(lastEnd, s.end ?? s.start);
  }
  if (total - lastEnd >= 20) paras.push({ gap: true, from: lastEnd, len: total - lastEnd });
  const words = keep.reduce((a, s) => a + s.text.trim().split(/\s+/).length, 0);
  const md = '# ' + title + '\n\n' +
    '*Transcribed locally with Whisper large-v3-turbo · language ' + lang + ' · ' + hms(total) + ' · ' +
    keep.length + ' segments · ' + words + ' words. Machine transcription: names, Italian words, ' +
    'singing and crosstalk will have errors. ' + (segs.length - keep.length) +
    ' segments Whisper itself flagged as hallucination were removed.*\n\n' +
    (note ? '> ' + note + '\n\n' : '') +
    paras.map(p => p.gap
      ? '*[' + hms(p.from) + ' – ' + hms(p.from + p.len) + ' · no clear speech, ' + hms(p.len) + ']*'
      : '**[' + hms(p.start) + ']** ' + p.text.join(' ')).join('\n\n') + '\n';
  return { md, txt: keep.map(s => s.text.trim()).join('\n') + '\n', keep, words, dropped: segs.length - keep.length };
}
