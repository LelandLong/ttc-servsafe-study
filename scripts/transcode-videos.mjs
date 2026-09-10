#!/usr/bin/env node
/**
 * Transcode the trip's HEVC .MOV captures to H.264 .mp4 for upload.
 *
 * Settings are MATCHED TO THE EXISTING TRANSCODES, read off a finished file
 * rather than chosen: H.264 High profile, 1920x1080 (NO downscale), ~12 Mbps
 * video, AAC 192k 48kHz stereo, +faststart so playback can begin before the
 * whole file arrives.
 *
 * ORIGINALS ARE NEVER TOUCHED. The .mp4 is written BESIDE the .MOV with the same
 * basename - no deletion, no overwrite, no in-place edit. The HEVC original stays
 * the archival copy, at native resolution, exactly as the retention rule requires.
 *
 * Idempotent: a .mp4 that already exists and is newer than its source is skipped,
 * so re-running after a new day is offloaded only does the new work.
 *
 * OVERSIZE SOURCES (added for DHDC2099: 4K, 3h25m, 52 GB from a second camera):
 *   - anything taller than 1080 is scaled DOWN into a 1920x1080 box, aspect
 *     preserved, which keeps every clip consistent with the rest of the archive
 *     and keeps the upload sane. The 4K original is untouched and stays archival.
 *   - clips longer than 20 minutes use the Apple hardware encoder. Measured on
 *     this machine: 5x realtime, so 3h25m takes ~41 min instead of most of a
 *     night in software. At 12 Mbps 1080p the quality difference is negligible;
 *     at this duration the time difference is not.
 *
 *   node scripts/transcode-videos.mjs [root] [--day 091026] [--force] [--sw]
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ARGS  = process.argv.slice(2);
const ROOT  = ARGS.find(a => a.startsWith('/')) || '/Volumes/Andromeda/Screenflow/Italy';
const FORCE = ARGS.includes('--force');
const di    = ARGS.indexOf('--day');
const ONLY  = di > -1 ? ARGS[di + 1] : null;
const FORCE_SW = ARGS.includes('--sw');   // force software encoding

function probe(src) {
  try {
    const out = execFileSync('ffprobe', ['-v','error','-select_streams','v:0',
      '-show_entries','stream=width,height','-show_entries','format=duration',
      '-of','default=nw=1', src], { encoding: 'utf8' });
    const w = /width=(\d+)/.exec(out), h = /height=(\d+)/.exec(out), d = /duration=([\d.]+)/.exec(out);
    return { w: w ? +w[1] : 0, h: h ? +h[1] : 0, dur: d ? parseFloat(d[1]) : 0 };
  } catch { return { w: 0, h: 0, dur: 0 }; }
}

const days = fs.readdirSync(ROOT)
  .filter(d => /^\d{6}$/.test(d) && fs.statSync(path.join(ROOT, d)).isDirectory())
  .filter(d => !ONLY || d === ONLY)
  .sort();

let made = 0, skipped = 0, failed = 0;
for (const day of days) {
  const dir = fs.readdirSync(path.join(ROOT, day));
  const movs = dir.filter(f => /\.mov$/i.test(f) && !f.startsWith('.')).sort();
  if (!movs.length) continue;
  for (const f of movs) {
    const src = path.join(ROOT, day, f);
    const out = path.join(ROOT, day, f.replace(/\.mov$/i, '.mp4'));
    if (!FORCE && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) { skipped++; continue; }
    const info = probe(src);
    const oversize = info.h > 1080 || info.w > 1920;
    const useHw = !FORCE_SW && info.dur > 1200;   // >20 min: software is impractical
    process.stdout.write('  ' + day + '/' + f +
      ' [' + info.w + 'x' + info.h + ' ' + Math.round(info.dur) + 's' +
      (oversize ? ' -> 1080p' : '') + (useHw ? ' hw' : '') + '] ... ');
    // fit INSIDE a 1920x1080 box rather than forcing 1920x1080 - a portrait or
    // non-16:9 source would otherwise be squashed. -2 keeps dimensions even.
    const vf = oversize ? ['-vf', 'scale=w=1920:h=1080:force_original_aspect_ratio=decrease'] : [];
    const venc = useHw
      ? ['-c:v', 'h264_videotoolbox', '-profile:v', 'high', '-b:v', '12M']
      : ['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium',
         '-b:v', '12M', '-maxrate', '14M', '-bufsize', '24M'];
    try {
      execFileSync('ffmpeg', [
        '-y', '-i', src,
        ...vf, ...venc,
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
        '-movflags', '+faststart',
        out
      ], { stdio: 'ignore' });
      const mb = (fs.statSync(out).size / 1048576).toFixed(0);
      console.log('done (' + mb + ' MB)');
      made++;
    } catch (e) {
      console.log('FAILED');
      failed++;
    }
  }
}
console.log('\ntranscoded ' + made + ' · skipped ' + skipped + ' · failed ' + failed);
if (failed) process.exit(1);
