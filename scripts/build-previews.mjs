#!/usr/bin/env node
/**
 * Build the PUBLIC design preview of the Italy video hub from the private source.
 *
 * WHY THIS EXISTS
 *   The hub lives on three surfaces and they drifted by hand once already:
 *     1. private/video-hub.html   - the source. Gitignored, because the live page
 *                                   carries real (unlisted) video ids. Pushed to
 *                                   Convex privatePages as `hos190-video-hub`.
 *     2. design/video-hub-preview.html - committed + served by GitHub Pages, so the
 *                                   layout is reviewable from a phone or a cloud
 *                                   session. Placeholder entries only.
 *     3. a Claude artifact        - same fragment, no <html> wrapper.
 *   Shipping to one location is not shipping (XFD-050). One source, one command.
 *
 * WHAT IT STRIPS AND ADDS
 *   - drops the live-only "setting this up, these are samples" notice
 *   - adds preview chrome + a first-visit / returning-visitor toggle, so both
 *     states of the "new since you last looked" strip can actually be seen
 *   - frames it at phone width, because that is how students read it
 *   - escapes every non-ASCII byte, so the page cannot depend on a charset
 *     header being set by whatever happens to serve it
 *
 * USAGE
 *   node scripts/build-video-hub-preview.mjs [fragment-out.html]
 *     writes design/video-hub-preview.html always;
 *     also writes the wrapper-less artifact fragment if a path is given.
 *
 * The DATA never leaves private/ - only the LAYOUT is published.
 */
import fs from 'fs';
import path from 'path';

const PAGES = [
  { key:'video-hub', src:'private/video-hub.html', out:'design/video-hub-preview.html',
    title:'Italy Video Hub &mdash; first pass',
    blurb:'Real content: 6 videos and 3 audio recordings from Sept 10. Media URLs are stripped from this '
        + 'public preview, so tiles here show placeholders &mdash; in the app they play.',
    note:'Sept 10 shows the audio-only case: video either side of the rehearsal, audio through the middle, '
       + 'where filming was not permitted. Labels are capture times until real descriptions are written.' },
  { key:'photos', src:'private/photos.html', out:'design/photos-preview.html',
    title:'Italy Photo Gallery &mdash; first pass',
    blurb:'242 real photos in two sections, with a full-image viewer. Media URLs are stripped from this public '
        + 'preview, so the coloured squares stand in for them &mdash; in the app they are the photographs.',
    note:'Tap any thumbnail to open the viewer, then use the arrows, swipe, or the left/right keys. '
       + 'The &ldquo;Videos&rdquo; button top-right is the cross-link to the other page.' }
];
const fragDir = process.argv[2] || null;

const previewCss = `
/* ---------- preview chrome (NOT part of the shipped page) ---------- */
.pv{background:#171210;color:#f5efe6;padding:16px 18px 15px;font-family:-apple-system,'Helvetica Neue',sans-serif}
.pvin{max-width:760px;margin:0 auto;display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start}
.pvtxt{flex:1 1 320px;min-width:260px}
.pvk{font-size:11px;font-weight:800;letter-spacing:.18em;color:#f0b26a;text-transform:uppercase}
.pvh{font-size:16px;font-weight:800;margin-top:5px;line-height:1.3}
.pvp{font-size:13px;color:#c9bcb2;margin-top:6px;line-height:1.5;max-width:62ch}
.pvbtns{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.pvb{font-family:inherit;font-size:12.5px;font-weight:800;background:#3a2c25;color:#f5efe6;border:1px solid #5c4034;border-radius:999px;padding:8px 14px;cursor:pointer}
.pvb:hover{background:#4a382f}
.pvb.on{background:#f0b26a;color:#2b2320;border-color:#f0b26a}
.pvb:focus-visible{outline:2px solid #f0b26a;outline-offset:2px}
.pvnote{font-size:11.5px;color:#8a7f76;margin-top:9px}
.stage{max-width:440px;margin:0 auto;background:#faf6f0;box-shadow:0 10px 40px rgba(0,0,0,.28);min-height:100vh}
@media(min-width:760px){ .stage{margin:22px auto 40px;border-radius:20px;overflow:hidden;min-height:0} }
body{background:#241c19}
`;

const chromeFor = (pg) => `<div class="pv"><div class="pvin">
  <div class="pvtxt">
    <div class="pvk">Design preview &middot; not published to students</div>
    <div class="pvh">${pg.title}</div>
    <div class="pvp">${pg.blurb}
      Shown at phone width, in the app&rsquo;s existing page styling, because that is exactly how students will see it.</div>
    <div class="pvnote">${pg.note}</div>
  </div>
  <div class="pvbtns">
    <button class="pvb on" id="pv-first" type="button">First visit</button>
    <button class="pvb" id="pv-return" type="button">Returning visitor</button>
  </div>
</div></div>`;

/* preview-only: let both states of the "new since you last looked" strip be seen.
   SEEN_KEY differs per page, and each page defines its own - so this reads it
   from the page rather than hard-coding either key. */
const toggleJs = `
(function(){
  var first = document.getElementById('pv-first'), ret = document.getElementById('pv-return');
  if(!first || !ret) return;
  function reload(stamp){
    try { if(stamp) localStorage.setItem(SEEN_KEY, stamp); else localStorage.removeItem(SEEN_KEY); } catch(e){}
    location.reload();
  }
  first.addEventListener('click', function(){ reload(null); });
  ret.addEventListener('click',   function(){ reload('2026-09-09'); });
  try {
    var s = localStorage.getItem(SEEN_KEY), returning = s && s < '2026-09-10';
    first.classList.toggle('on', !returning);
    ret.classList.toggle('on', !!returning);
  } catch(e){}
})();
`;

const escHtml = t => [...t].map(c => c.codePointAt(0) < 128 ? c : `&#${c.codePointAt(0)};`).join('');
const escJs   = t => [...t].map(c => {
  const n = c.codePointAt(0);
  if (n < 128) return c;
  if (n > 0xFFFF) { const x = n - 0x10000;
    return `\\u${(0xD800 + (x >> 10)).toString(16).padStart(4,'0')}\\u${(0xDC00 + (x & 0x3FF)).toString(16).padStart(4,'0')}`; }
  return `\\u${n.toString(16).padStart(4,'0')}`;
}).join('');

function build(pg){
  if (!fs.existsSync(pg.src)) {
    console.error('missing ' + pg.src + ' (gitignored - lives only on the curator machine)');
    process.exit(1);
  }
  const src   = fs.readFileSync(pg.src, 'utf8');
  const style = /<style>([\s\S]*?)<\/style>/.exec(src)[1];
  let   body  = /<body>([\s\S]*?)<\/body>/.exec(src)[1];

  // 🛑 THE PUBLIC PREVIEW MUST NEVER CARRY REAL MEDIA URLS.
  // private/photos.html holds the LIVE gallery: 226 Convex storage URLs that are
  // UNAUTHENTICATED - anyone holding one fetches the photo. This repo is public
  // and serves Pages, so committing them would publish the whole gallery to the
  // world. Strip every src/thumb here, and cap the entry count so the committed
  // file stays a layout preview rather than a copy of the data.
  // (Caught before the first commit: the generated preview had jumped to 82 KB.)
  {
    const before = (body.match(/convex\.cloud/g) || []).length;
    body = body.replace(/src:"https?:\/\/[^"]*"/g, 'src:""')
               .replace(/thumb:"https?:\/\/[^"]*"/g, 'thumb:""');
    const m = /var PHOTOS = \[([\s\S]*?)\n\];/.exec(body);
    if (m) {
      const entries = m[1].split(/\},\s*\n/).filter(Boolean);
      if (entries.length > 30) {
        const trimmed = entries.slice(0, 30).map(e => e.trim().replace(/\}$/, '') + ' }').join(',\n');
        body = body.replace(m[0], 'var PHOTOS = [\n' + trimmed + '\n];');
      }
    }
    // 🛑 AND THE TRANSCRIPTS. They contain other people's speech - classmates,
    // the guide - and this repo is public. build-hub-data puts them in ONE block
    // between /*TX*/ markers, so it is removed by position, not by parsing text
    // that could contain anything. Then refuse to build if transcript STRUCTURE
    // survives anywhere, in case the text ever arrives by another route.
    {
      const o = body.indexOf('/*TX*/'), c = body.indexOf('/*/TX*/');
      if (o > -1 && c > o) body = body.slice(0, o) + '/*TX*/var TRANSCRIPTS = {};/*/TX*/' + body.slice(c + 7);
      if (/"paras"\s*:\s*\[\s*\{/.test(body)) {
        console.error('FAIL: transcript text survived into ' + pg.out); process.exit(1);
      }
    }

    // 🛑 AND THE YOUTUBE IDS. An unlisted video is private only while its id is
    // unknown - an id in this public repo IS a link anyone can watch. The guard
    // above only knew about Convex URLs, so six real ids sat in the public preview
    // from b6b3ad7 until this was added. Strip them, then refuse to build if one
    // survives in any form: a bare id field, a watch/embed/youtu.be URL, or a
    // thumbnail host that embeds the id.
    body = body.replace(/\bid:"[A-Za-z0-9_-]{11}"/g, 'id:""');
    const ytLeaks = (body.match(/\bid:"[A-Za-z0-9_-]{11}"|youtu\.be\/[A-Za-z0-9_-]{11}|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/)[A-Za-z0-9_-]{11}|ytimg\.com\/vi\/[A-Za-z0-9_-]{11}/g) || []).length;
    if (ytLeaks) { console.error('FAIL: ' + ytLeaks + ' YouTube ids survived into ' + pg.out); process.exit(1); }

    const after = (body.match(/convex\.cloud/g) || []).length;
    if (after) { console.error('FAIL: ' + after + ' media URLs survived into ' + pg.out); process.exit(1); }
    if (before) console.log('  stripped ' + before + ' live media URLs from the public preview');
  }

  // the "setting this up" notice is live-only chrome; the preview says it better
  body = body.replace(/<div style="background:#f6e3d7;[\s\S]*?<\/div>\n/, '');

  let fragment = `<title>${/<title>(.*?)<\/title>/.exec(src)[1]}</title>\n<style>\n${style}\n${previewCss}\n</style>\n\n${chromeFor(pg)}\n\n<div class="stage">\n${body}\n</div>\n`;

  const close = fragment.lastIndexOf('</script>');
  fragment = fragment.slice(0, close) + toggleJs + fragment.slice(close);

  {
    const i = fragment.indexOf('<script>'), j = fragment.lastIndexOf('</script>');
    fragment = escHtml(fragment.slice(0,i)) + escJs(fragment.slice(i,j)) + escHtml(fragment.slice(j));
  }

  const wrapped = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- GENERATED by scripts/build-previews.mjs from ${pg.src}.
     Do not hand-edit: edit the source and re-run. PLACEHOLDER ENTRIES ONLY -
     real media URLs and trip specifics never enter this repo. -->
${fragment}</body></html>
`.replace('</style>\n', '</style>\n</head><body>\n');

  fs.mkdirSync(path.dirname(pg.out), { recursive: true });
  fs.writeFileSync(pg.out, wrapped);
  console.log('wrote ' + pg.out + '  (' + wrapped.length + ' bytes)');

  if (fragDir) {
    const f = path.join(fragDir, pg.key + '.html');
    fs.writeFileSync(f, fragment);
    console.log('wrote ' + f + '  (' + fragment.length + ' bytes)');
  }

  const bad = [...wrapped].filter(c => c.codePointAt(0) > 127).length;
  if (bad) { console.error('FAIL: ' + bad + ' non-ASCII bytes survived in ' + pg.out); process.exit(1); }
}

PAGES.forEach(build);
console.log('ok: pure ASCII, no charset dependency');
