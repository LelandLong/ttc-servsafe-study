#!/usr/bin/env node
/**
 * Convert the trip's still photos to web-ready JPEGs, in two sizes.
 *
 * WHY: 269 of the 278 stills are HEIC. Safari renders HEIC; Chrome, Firefox and
 * Android do NOT. Converting is a requirement for a web gallery, not an
 * optimisation - though it also takes the set from ~560 MB to ~105 MB.
 *
 * ORIGINALS ARE NEVER TOUCHED. Same rule the video transcode follows: output is
 * written to a separate _web/ tree beside the day folders, nothing is deleted,
 * nothing is written in place. The HEICs remain the archival copy.
 *
 * OUTPUT
 *   <root>/_web/<day>/<name>-full.jpg    longest edge 1600  (the viewer)
 *   <root>/_web/<day>/<name>-thumb.jpg   longest edge  400  (the grid)
 *   <root>/_web/manifest.json            every photo, with day + dimensions
 *
 * Idempotent: a photo whose outputs already exist and are newer than the source
 * is skipped, so re-running after a new day is offloaded only does the new work.
 *
 * USAGE  node scripts/convert-stills.mjs [root] [--force]
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ROOT  = process.argv[2] && !process.argv[2].startsWith('--')
  ? process.argv[2] : '/Volumes/Andromeda/Screenflow/Italy';
const FORCE = process.argv.includes('--force');
const WEB   = path.join(ROOT, '_web');
const SIZES = { full: 1600, thumb: 400 };
const QUALITY = '72';
const EXT = /\.(heic|jpe?g|png)$/i;

if (!fs.existsSync(ROOT)) { console.error('no such root: ' + ROOT); process.exit(1); }

const days = fs.readdirSync(ROOT)
  .filter(d => /^\d{6}$/.test(d) && fs.statSync(path.join(ROOT, d)).isDirectory())
  .sort();
if (!days.length) { console.error('no day folders (YYMMDD-style) under ' + ROOT); process.exit(1); }

// The SHOOT DATE comes from the photo, not the folder. Folder names are the
// offload day and are right 7 times out of 8 - folder 090226 holds 25 photos
// from Sept 2 and 2 from Sept 1. Per-photo EXIF costs nothing and cannot drift.
function shotAt(file){
  try {
    const out = execFileSync('sips', ['-g','creation', file], {encoding:'utf8'});
    const m = /creation:\s*(\d{4}):(\d{2}):(\d{2})\s*(\d{2}:\d{2}:\d{2})?/.exec(out);
    return m ? { date: m[1]+'-'+m[2]+'-'+m[3], time: m[4] || null } : null;
  } catch { return null; }
}

function dims(file){
  try {
    const out = execFileSync('sips', ['-g','pixelWidth','-g','pixelHeight', file], {encoding:'utf8'});
    const w = /pixelWidth:\s*(\d+)/.exec(out), h = /pixelHeight:\s*(\d+)/.exec(out);
    return w && h ? { w:+w[1], h:+h[1] } : null;
  } catch { return null; }
}

// 🛑 NEVER RECREATE A PHOTO THAT WAS DELIBERATELY REMOVED.
// This script derives everything from the ORIGINALS, so without this it happily
// re-converts photos marked "skip" - personal shots that were deleted on purpose -
// every time a new day is offloaded. Found exactly that way: adding day 091026
// converted 51 files when the day held 31.
const secPath = path.join(WEB, 'sections.json');
const removedKeys = new Set();
if (fs.existsSync(secPath)) {
  const ph = (JSON.parse(fs.readFileSync(secPath, 'utf8')).photos) || {};
  for (const [k, v] of Object.entries(ph)) if (v && v.section === 'skip') removedKeys.add(k);
}

const manifest = [];
let made = 0, skipped = 0, failed = 0, skippedRemoved = 0;

for (const day of days) {
  const srcDir = path.join(ROOT, day);
  const outDir = path.join(WEB, day);
  const files = fs.readdirSync(srcDir).filter(f => EXT.test(f) && !f.startsWith('.')).sort();
  if (!files.length) continue;
  fs.mkdirSync(outDir, { recursive: true });

  for (const f of files) {
    const src  = path.join(srcDir, f);
    const base = f.replace(EXT, '');
    if (removedKeys.has(day + '/' + base)) { skippedRemoved++; continue; }
    const outs = Object.fromEntries(Object.keys(SIZES).map(k => [k, path.join(outDir, base + '-' + k + '.jpg')]));
    const fresh = !FORCE && Object.values(outs).every(o =>
      fs.existsSync(o) && fs.statSync(o).mtimeMs >= fs.statSync(src).mtimeMs);

    if (!fresh) {
      let ok = true;
      for (const [k, px] of Object.entries(SIZES)) {
        try {
          execFileSync('sips', ['-s','format','jpeg','-s','formatOptions',QUALITY,'-Z',String(px),
                                src,'--out',outs[k]], { stdio:'ignore' });
        } catch { ok = false; }
      }
      if (!ok) { failed++; console.error('  FAILED ' + day + '/' + f); continue; }
      made++;
    } else skipped++;

    const d = dims(outs.full);
    // 7 edited JPGs carry no EXIF creation date. Fall back to the folder name,
    // which is MMDDYY - right for those files, and better than a null date.
    const shot = shotAt(src) || (function(){
      const m = /^(\d{2})(\d{2})(\d{2})$/.exec(day);
      return m ? { date: '20'+m[3]+'-'+m[1]+'-'+m[2], time: null, fromFolder: true } : null;
    })();
    manifest.push({
      day,
      shot:     shot ? shot.date : null,   // real shoot date - use THIS, not `day`
      shotTime: shot ? shot.time : null,   // orders photos within a day
      dateFromFolder: !!(shot && shot.fromFolder),
      name: base,
      source: f,
      full:  path.relative(WEB, outs.full),
      thumb: path.relative(WEB, outs.thumb),
      w: d ? d.w : null,
      h: d ? d.h : null,
      portrait: d ? d.h > d.w : null,
      bytes: fs.existsSync(outs.full) ? fs.statSync(outs.full).size : 0
    });
  }
  process.stdout.write('  ' + day + ': ' + files.length + ' stills\n');
}

fs.writeFileSync(path.join(WEB, 'manifest.json'), JSON.stringify(manifest, null, 2));
const totalMB = manifest.reduce((s,m) => s + m.bytes, 0) / 1048576;
console.log('\nconverted ' + made + ' · unchanged ' + skipped + ' · failed ' + failed + ' · excluded(removed) ' + skippedRemoved);
console.log('manifest: ' + manifest.length + ' photos, full-size total ' + totalMB.toFixed(1) + ' MB');
console.log('output:   ' + WEB);
if (failed) process.exit(1);
