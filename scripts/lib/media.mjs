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

export function probe(file) {
  try {
    const out = execFileSync('ffprobe', ['-v','error','-show_entries',
      'format=duration:format_tags=creation_time','-of','default=nw=1', file], { encoding: 'utf8' });
    const d = /duration=([\d.]+)/.exec(out), c = /creation_time=(\S+)/.exec(out);
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
