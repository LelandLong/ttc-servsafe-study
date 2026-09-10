#!/usr/bin/env node
/**
 * Turn a list of YouTube links into ready-made entries for the video hub.
 *
 * WHY THIS NEEDS NO OAUTH: YouTube's oEmbed endpoint returns a video's TITLE
 * without any authentication, and an unlisted video is reachable by link - so a
 * link is enough to learn its title. Studio titles an upload after its FILENAME,
 * which is the join key back to the file on disk. Everything else - shoot date,
 * time of day, duration - is then read from the file itself rather than typed.
 *
 * The YouTube Data API would do this too, but it costs a Google Cloud project,
 * an OAuth client and a consent flow. For matching ids to files, that is a lot of
 * setup to learn something a public endpoint already tells us.
 *
 *   node scripts/link-videos.mjs <url-or-id> [more...]
 *   pbpaste | node scripts/link-videos.mjs        # paste a list, one per line
 */
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const ROOT = '/Volumes/Andromeda/Screenflow/Italy';

function idOf(s) {
  s = String(s).trim();
  if (!s) return null;
  let m = /(?:v=|youtu\.be\/|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/.exec(s);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return null;
}

async function title(id) {
  const r = await fetch('https://www.youtube.com/oembed?url=' +
    encodeURIComponent('https://www.youtube.com/watch?v=' + id) + '&format=json');
  if (!r.ok) return null;
  return (await r.json()).title;
}

// Index every source file by basename, so a title can be matched back to disk.
const byName = {};
for (const day of fs.readdirSync(ROOT).filter(d => /^\d{6}$/.test(d))) {
  const dir = path.join(ROOT, day);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(mov|mp4)$/i.test(f)) continue;
    const base = f.replace(/\.[^.]+$/, '');
    // prefer the ORIGINAL for metadata: same content, and it carries the capture time
    if (!byName[base] || /\.mov$/i.test(f)) byName[base] = path.join(dir, f);
  }
}

function meta(file) {
  try {
    const out = execFileSync('ffprobe', ['-v','error','-show_entries',
      'format=duration:format_tags=creation_time','-of','default=nw=1', file], {encoding:'utf8'});
    const d = /duration=([\d.]+)/.exec(out);
    const c = /creation_time=(\S+)/.exec(out);
    const secs = d ? Math.round(parseFloat(d[1])) : 0;
    const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), s = secs%60;
    return {
      dur: h ? h + 'h' + String(m).padStart(2,'0') + 'm' : m + 'm' + String(s).padStart(2,'0') + 's',
      shot: c ? c[1].slice(0,10) : null,
      time: c ? c[1].slice(11,16) : null,
    };
  } catch { return { dur: '', shot: null, time: null }; }
}

const args = process.argv.slice(2);
const input = args.length ? args : fs.readFileSync(0, 'utf8').split(/\s+/);
const ids = [...new Set(input.map(idOf).filter(Boolean))];
if (!ids.length) { console.error('no YouTube links or ids found'); process.exit(1); }

const rows = [];
for (const id of ids) {
  const t = await title(id);
  if (!t) { console.error('  ' + id + ': could not read title (private? wrong id?)'); continue; }
  const base = t.trim();
  const file = byName[base];
  if (!file) { console.error('  ' + id + ': title "' + base + '" matches no file on disk'); continue; }
  const day = path.basename(path.dirname(file));
  const shotFromDay = '20' + day.slice(4,6) + '-' + day.slice(0,2) + '-' + day.slice(2,4);
  const mm = meta(file);
  rows.push({ id, base, day, date: mm.shot || shotFromDay, time: mm.time || '', dur: mm.dur });
  console.error('  matched ' + id + '  ->  ' + base + '  (' + day + ', ' + mm.dur + ')');
}

rows.sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time));
const today = new Date().toISOString().slice(0,10);
console.log('\n// paste into the VIDEOS list in private/video-hub.html');
for (const r of rows) {
  console.log('  { id:' + JSON.stringify(r.id) + ', kind:"raw", date:' + JSON.stringify(r.date) +
    ', place:"", what:' + JSON.stringify(r.base) + ',');
  console.log('    dur:' + JSON.stringify(r.dur) + ', added:' + JSON.stringify(today) + ' },');
}
