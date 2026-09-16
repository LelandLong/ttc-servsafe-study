#!/usr/bin/env node
/**
 * Rotate a clip that was filmed sideways, and fix its hub entry.
 *
 * WHY: a phone can tag a clip portrait when the content is landscape on its side
 * (six clips in the Sep 12-16 batch). The transcode faithfully reproduces what the
 * tag says, so the fix is a real rotation, not a metadata edit.
 *
 * Re-encodes FROM THE ORIGINAL .MOV - one encode, not two - with the same settings
 * as transcode-videos (H.264 high, ~12 Mbps, AAC 192k, +faststart), writes over the
 * .mp4 only after ffmpeg succeeds, and updates private/video-hub.json: the entry's
 * `vertical` flag is re-derived from the rotated file, so a corrected landscape clip
 * stops asking for the 9:16 player. ORIGINALS ARE NEVER TOUCHED.
 *
 *   node scripts/rotate-video.mjs <base> <cw|ccw> [<base> <cw|ccw> ...]
 *     cw  = clockwise 90 (ffmpeg transpose=1)
 *     ccw = counter-clockwise 90 (transpose=2)
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { indexSources, isVertical, readHub, writeHub } from './lib/media.mjs';

const args = process.argv.slice(2);
if (!args.length || args.length % 2) {
  console.error('usage: rotate-video.mjs <base> <cw|ccw> [<base> <cw|ccw> ...]');
  process.exit(1);
}
const idx = indexSources();
const hub = readHub() || { entries: [] };
let done = 0, failed = 0;

for (let i = 0; i < args.length; i += 2) {
  const base = args[i], dir = args[i + 1].toLowerCase();
  if (dir !== 'cw' && dir !== 'ccw') { console.error('  ' + base + ': direction must be cw or ccw'); failed++; continue; }
  const hit = Object.values(idx).find(h => h.base === base);
  if (!hit || !hit.mov) { console.error('  ' + base + ': no original .MOV found'); failed++; continue; }
  const out = hit.mp4 || hit.mov.replace(/\.[^.]+$/, '.mp4');
  const tmp = out.replace(/\.mp4$/, '.rotating.mp4');
  process.stdout.write('  ' + base + ' ' + dir + ' ... ');
  try {
    execFileSync('ffmpeg', ['-y', '-i', hit.mov,
      '-vf', 'transpose=' + (dir === 'cw' ? 1 : 2),
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium',
      '-b:v', '12M', '-maxrate', '14M', '-bufsize', '24M',
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-ac', '2',
      '-movflags', '+faststart', tmp], { stdio: 'ignore' });
    fs.renameSync(tmp, out);                       // only after ffmpeg succeeded
  } catch (e) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    console.log('FAILED'); failed++; continue;
  }
  const vert = isVertical(out);
  for (const e of hub.entries) {
    if (e.base !== base) continue;
    if (vert) e.vertical = true; else delete e.vertical;
    e.file = out;
  }
  console.log('done -> ' + (vert ? 'portrait' : 'landscape') + ' (' + (fs.statSync(out).size / 1048576).toFixed(0) + ' MB)');
  done++;
}
writeHub(hub);
console.log('\nrotated ' + done + ' · failed ' + failed + '  (originals untouched)');
if (failed) process.exit(1);
