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
// Taller than wide AS DISPLAYED. An iPhone portrait .MOV is stored 1920x1080 with
// a 90-degree rotation tag, so the raw width/height alone call it landscape; the
// transcoded .mp4 is written upright (1080x1920). Both must read as vertical, so
// the hub plays them in the 9:16 player instead of a thin strip (2026-09-12).
export function isVertical(file) {
  try {
    const j = JSON.parse(execFileSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries',
      'stream=width,height:stream_side_data=rotation', '-of','json', file], { encoding: 'utf8' }));
    const st = (j.streams || [])[0]; if (!st) return false;
    let w = st.width, h = st.height;
    const rot = ((st.side_data_list || []).find(x => x.rotation !== undefined) || {}).rotation || 0;
    if (Math.abs(rot) % 180 === 90) [w, h] = [h, w];
    return h > w;
  } catch { return false; }
}

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
      vertical: isVertical(file),
    };
  } catch { return { dur: '', shot: null, time: null, vertical: false }; }
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
// Lines below MIN_CONF (Whisper's own avg_logprob) are shown as [unclear] instead
// of printed. On this audio - speech ~5 dB above the room - a low-confidence line
// is usually invented English that merely sounds plausible, and a reader cannot
// tell it from the real thing. -0.6 was chosen by reading the output: it keeps the
// real gist of tour 2/3 ("families owned the boxes... to show their status") while
// dropping most of the nonsense. It cannot catch a line that is confidently WRONG.
export const MIN_CONF = -0.6;
export const UNCLEAR = '[unclear]';
export function renderTranscript({ title, lang, total, segs, note, minConf = MIN_CONF }) {
  const keep = segs.filter(s => !isHallucination(s) &&
    !((s.no_speech_prob ?? 0) > 0.6 && (s.avg_logprob ?? 0) < -1.0));
  const paras = []; let cur = null, lastEnd = 0;
  let lastUnclear = false;
  for (const s of keep) {
    if (s.start - lastEnd >= 20) {
      paras.push({ gap: true, from: lastEnd, len: s.start - lastEnd });
      cur = null;
    }
    if (!cur || s.start - cur.start >= 60) { cur = { start: s.start, text: [] }; paras.push(cur); lastUnclear = false; }
    const sure = (s.avg_logprob ?? 0) >= minConf;
    if (sure) { cur.text.push(s.text.trim()); lastUnclear = false; }
    else if (!lastUnclear) { cur.text.push(UNCLEAR); lastUnclear = true; }   // one marker per run
    lastEnd = Math.max(lastEnd, s.end ?? s.start);
  }
  if (total - lastEnd >= 20) paras.push({ gap: true, from: lastEnd, len: total - lastEnd });
  const sureSegs = keep.filter(s => (s.avg_logprob ?? 0) >= minConf);
  const words = sureSegs.reduce((a, s) => a + s.text.trim().split(/\s+/).length, 0);
  const md = '# ' + title + '\n\n' +
    '*Transcribed locally with Whisper large-v3-turbo · language ' + lang + ' · ' + hms(total) + ' · ' +
    keep.length + ' segments · ' + words + ' words. Machine transcription: names, Italian words, ' +
    'singing and crosstalk will have errors. ' + (segs.length - keep.length) +
    ' segments Whisper itself flagged as hallucination were removed, and lines it was not confident about are shown as ' +
    UNCLEAR + '.*\n\n' +
    (note ? '> ' + note + '\n\n' : '') +
    paras.map(p => p.gap
      ? '*[' + hms(p.from) + ' – ' + hms(p.from + p.len) + ' · no clear speech, ' + hms(p.len) + ']*'
      : '**[' + hms(p.start) + ']** ' + p.text.join(' ')).join('\n\n') + '\n';
  // STRUCTURED form for the app's transcript view: {t, x} is a paragraph starting
  // at t seconds, {t, g} a stretch of g seconds with no clear speech.
  const struct = paras.map(p => p.gap ? { t: Math.round(p.from), g: Math.round(p.len) }
                                      : { t: Math.round(p.start), x: p.text.join(' ') });
  return { md, txt: keep.map(s => (s.avg_logprob ?? 0) >= minConf ? s.text.trim() : UNCLEAR)
             .filter((t, i, a) => !(t === UNCLEAR && a[i - 1] === UNCLEAR)).join('\n') + '\n', keep, words,
           dropped: segs.length - keep.length, paras: struct };
}

// A SELF-CONTAINED html copy - rendered now, no network needed to read it (the
// standing rule: a page built on a CDN opens black outside the editor). `audio`
// is an optional path to a local copy; build-transcripts passes none, because a
// local file's audio could not be verified to play (the test browser refuses media
// on file:// by ANY path form - relative, %20-encoded, absolute), and a player that
// may silently not work is worse than none. Listening along lives in the app.
export function transcriptHtml({ title, meta, note, paras, audio }) {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const body = paras.map(p => p.g !== undefined
    ? '<p class="gap">' + hms(p.t) + ' – ' + hms(p.t + p.g) + ' · no clear speech</p>'
    : '<p>' + (audio ? '<button class="ts" data-t="' + p.t + '">' + hms(p.t) + '</button>'
                     : '<span class="ts">' + hms(p.t) + '</span>') +
      esc(p.x).split(UNCLEAR).join('<span class="unc">' + UNCLEAR + '</span>').replace(/\{([^}]*)\}/g, '<em class="guess">$1</em>') + '</p>').join('\n');
  return '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title><style>' +
    ':root{--ink:#2b2320;--mute:#8a7f76;--paper:#faf6f0;--line:#e8ded2;--terra:#c1502e}' +
    '*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 Georgia,"Iowan Old Style",serif}' +
    'header{position:sticky;top:0;background:#2b2320;color:#f5efe6;padding:14px 20px 12px;font-family:-apple-system,"Helvetica Neue",sans-serif}' +
    'h1{margin:0;font-size:19px;font-weight:800}.meta{font-size:12.5px;color:#c9bcb2;font-weight:700;margin-top:3px}' +
    'audio{width:100%;margin-top:10px;display:block}main{max-width:40em;margin:0 auto;padding:22px 20px 60px}' +
    '.note{font:14px/1.5 -apple-system,sans-serif;color:#6b6152;background:#f2ece3;border-left:3px solid #b9ab97;padding:9px 12px;border-radius:0 8px 8px 0;margin:0 0 22px}' +
    'p{margin:0 0 1.05em}.gap{font:italic 13px -apple-system,sans-serif;color:var(--mute);text-align:center;border-top:1px dashed var(--line);border-bottom:1px dashed var(--line);padding:6px 0}' +
    '.ts{font:700 12px -apple-system,sans-serif;color:var(--terra);background:#fff;border:1px solid var(--line);border-radius:999px;padding:1px 8px;margin-right:8px;cursor:pointer;vertical-align:1px}' +
    '.ts:focus-visible{outline:2px solid var(--terra);outline-offset:2px}.unc{font:italic 13px -apple-system,sans-serif;color:var(--mute);background:#f2ece3;border-radius:4px;padding:0 5px}.fine{font:12px -apple-system,sans-serif;color:var(--mute);margin-top:30px}.guess{font-style:italic;color:#6b4a3a}' +
    '</style></head><body><header><h1>' + esc(title) + '</h1><div class="meta">' + esc(meta) + '</div>' +
    (audio ? '<audio id="a" controls preload="metadata" src="' + esc(audio) + '"></audio>' : '') + '</header><main>' +
    (note ? '<div class="note">' + esc(note) + '</div>' : '') + body +
    '<p class="fine">Transcribed from a quiet recording in a large hall. <em>Italic</em> words are best guesses from context; ' + UNCLEAR + ' marks speech that could not be made out. Names and Italian words may still have errors.</p>' +
    '</main><script>document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".ts");' +
    'var a=document.getElementById("a");if(!b||!a)return;a.currentTime=+b.dataset.t;a.play();});</script></body></html>\n';
}

// The segments of a raw transcript that fall inside a trim window, re-timed to
// the trimmed audio. Keeps a line if MOST of it is inside: "starts inside" dropped
// "Silenzio, cast!" (Whisper stamped it 420.0; the shout is at 423.04) while the
// audio kept it, and "ends inside" would let the tail of cut-out chatter back in.
// Shared by trim-audio and build-transcripts so they cannot disagree.
export function windowSegments(segs, start = 0, end = null) {
  const hi = end === null || end === undefined ? Infinity : end;
  return segs.filter(s => {
    const e = s.end ?? s.start, len = e - s.start;
    if (len <= 0) return s.start >= start && s.start < hi;
    return (Math.min(e, hi) - Math.max(s.start, start)) / len > 0.5;
  }).map(s => ({ ...s, start: Math.max(0, s.start - start), end: Math.max(0, (s.end ?? s.start) - start) }));
}
