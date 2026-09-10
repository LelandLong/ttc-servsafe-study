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
 *   node scripts/transcode-videos.mjs [root] [--day 091026] [--force]
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ARGS  = process.argv.slice(2);
const ROOT  = ARGS.find(a => a.startsWith('/')) || '/Volumes/Andromeda/Screenflow/Italy';
const FORCE = ARGS.includes('--force');
const di    = ARGS.indexOf('--day');
const ONLY  = di > -1 ? ARGS[di + 1] : null;

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
    process.stdout.write('  ' + day + '/' + f + ' ... ');
    try {
      execFileSync('ffmpeg', [
        '-y', '-i', src,
        '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium',
        '-b:v', '12M', '-maxrate', '14M', '-bufsize', '24M',
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
