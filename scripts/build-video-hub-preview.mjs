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

const SRC = 'private/video-hub.html';
const OUT = 'design/video-hub-preview.html';
const fragOut = process.argv[2] || null;

if (!fs.existsSync(SRC)) {
  console.error('missing ' + SRC + ' (gitignored - it lives only on the curator machine)');
  process.exit(1);
}
const src = fs.readFileSync(SRC, 'utf8');

const style = /<style>([\s\S]*?)<\/style>/.exec(src)[1];
let body    = /<body>([\s\S]*?)<\/body>/.exec(src)[1];

// the "setting this up" notice is live-only chrome; the preview says it better
body = body.replace(/<div style="background:#f6e3d7;[\s\S]*?<\/div>\n/, '');

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

const chrome = `<div class="pv"><div class="pvin">
  <div class="pvtxt">
    <div class="pvk">Design preview &middot; not published to students</div>
    <div class="pvh">Italy Video Hub &mdash; first pass</div>
    <div class="pvp">The layout is real; every entry is a <b>placeholder</b>. One tile plays an actual video so you can
      see the inline player work &mdash; the rest say &ldquo;no video attached yet&rdquo; rather than faking it.
      Shown at phone width, in the app&rsquo;s existing page styling, because that is exactly how students will see it.</div>
    <div class="pvnote">Tapping a <b>Recently added</b> tile jumps to that video and plays it full size &mdash; a tile
      that small is below the size YouTube reliably plays at.</div>
  </div>
  <div class="pvbtns">
    <button class="pvb on" id="pv-first" type="button">First visit</button>
    <button class="pvb" id="pv-return" type="button">Returning visitor</button>
  </div>
</div></div>`;

const toggleJs = `
/* ---------- preview-only: show BOTH states of the NEW strip ---------- */
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

let fragment = `<title>Italy Video Hub</title>\n<style>\n${style}\n${previewCss}\n</style>\n\n${chrome}\n\n<div class="stage">\n${body}\n</div>\n`;

// the toggle has to sit after SEEN_KEY is defined - append inside the page's own script
const close = fragment.lastIndexOf('</script>');
fragment = fragment.slice(0, close) + toggleJs + fragment.slice(close);

// ---- make it encoding-proof: \u escapes inside <script>, entities outside ----
const escHtml = t => [...t].map(c => c.codePointAt(0) < 128 ? c : `&#${c.codePointAt(0)};`).join('');
const escJs   = t => [...t].map(c => {
  const n = c.codePointAt(0);
  if (n < 128) return c;
  if (n > 0xFFFF) { const x = n - 0x10000;
    return `\\u${(0xD800 + (x >> 10)).toString(16).padStart(4,'0')}\\u${(0xDC00 + (x & 0x3FF)).toString(16).padStart(4,'0')}`; }
  return `\\u${n.toString(16).padStart(4,'0')}`;
}).join('');
{
  const i = fragment.indexOf('<script>'), j = fragment.lastIndexOf('</script>');
  fragment = escHtml(fragment.slice(0,i)) + escJs(fragment.slice(i,j)) + escHtml(fragment.slice(j));
}

const wrapped = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- GENERATED by scripts/build-video-hub-preview.mjs from private/video-hub.html.
     Do not hand-edit: edit the source and re-run. PLACEHOLDER ENTRIES ONLY -
     real video ids and trip specifics never enter this repo. -->
${fragment}</body></html>
`.replace('</style>\n', '</style>\n</head><body>\n');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, wrapped);
console.log('wrote ' + OUT + '  (' + wrapped.length + ' bytes)');
if (fragOut) { fs.writeFileSync(fragOut, fragment); console.log('wrote ' + fragOut + '  (' + fragment.length + ' bytes)'); }

const bad = [...wrapped].filter(c => c.codePointAt(0) > 127).length;
if (bad) { console.error('FAIL: ' + bad + ' non-ASCII bytes survived'); process.exit(1); }
console.log('ok: pure ASCII, no charset dependency');
