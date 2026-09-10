#!/usr/bin/env node
/**
 * Sort the trip stills into the gallery's three sections, fast.
 *
 * The gallery needs cooking / food / out per photo, and a place. Neither can be
 * derived from a file - only the DATE can. Typing 283 entries is exactly the
 * chore Leland said he did not want, so this is one keypress per photo instead:
 *
 *     1 = restaurant / food     2 = out & about
 *     0 = skip (leave it out of the gallery)
 *     left arrow = go back        (progress saves after every keypress)
 *
 * PLACE is set ONCE PER DAY and applies to every photo of that day, because a
 * day is almost always one place - override it per photo only when it differs.
 * CAPTION is optional; the gallery reads fine with date + place alone.
 *
 * Everything is local: thumbnails are served off the drive, nothing is uploaded,
 * and assignments are written to <root>/_web/sections.json after every change,
 * so closing the tab loses nothing.
 *
 *   node scripts/sort-stills.mjs [root]   ->  http://localhost:8787
 */
import fs from 'fs';
import path from 'path';
import http from 'http';

const ARGS = process.argv.slice(2);
const ROOT = ARGS.find(a => a.startsWith('/')) || '/Volumes/Andromeda/Screenflow/Italy';
const WEB  = path.join(ROOT, '_web');
const PORT = 8787;

const manifest = JSON.parse(fs.readFileSync(path.join(WEB, 'manifest.json'), 'utf8'));
const secPath  = path.join(WEB, 'sections.json');
let sections   = fs.existsSync(secPath) ? JSON.parse(fs.readFileSync(secPath, 'utf8')) : { photos:{}, places:{} };

const photos = manifest
  .map(m => ({ key: m.day + '/' + m.name, day: m.day, shot: m.shot, shotTime: m.shotTime,
               thumb: m.thumb, full: m.full }))
  .sort((a,b) => (a.shot + (a.shotTime||'')).localeCompare(b.shot + (b.shotTime||'')));

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>Sort stills</title><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,'Helvetica Neue',sans-serif;background:#17130f;color:#f5efe6;height:100vh;display:flex;flex-direction:column}
header{padding:10px 16px;background:#241c17;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
h1{font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#f0b26a}
.bar{flex:1 1 240px;height:8px;background:#3a2c25;border-radius:99px;overflow:hidden;min-width:160px}
.bar i{display:block;height:100%;background:#f0b26a;width:0}
.stat{font-size:13px;font-weight:700;color:#c9bcb2;font-variant-numeric:tabular-nums}
main{flex:1 1 auto;display:flex;align-items:center;justify-content:center;padding:12px;overflow:hidden}
img{max-width:100%;max-height:100%;object-fit:contain;border-radius:10px}
footer{padding:12px 16px 18px;background:#241c17;display:flex;gap:10px;flex-wrap:wrap;align-items:center}
button{font-family:inherit;font-size:14px;font-weight:800;border:0;border-radius:10px;padding:12px 16px;cursor:pointer;background:#3a2c25;color:#f5efe6}
button.k1{background:#8f3a20}button.k2{background:#6b7b3a}button.k3{background:#3c5570}button.k0{background:#4a3f38}
button:hover{filter:brightness(1.15)}
input{font-family:inherit;font-size:14px;padding:10px 12px;border-radius:10px;border:1px solid #4d3b32;background:#17130f;color:#f5efe6}
.meta{font-size:13px;color:#c9bcb2;font-weight:700}
.done{font-size:15px;font-weight:800;color:#f0b26a}
kbd{background:#17130f;border:1px solid #4d3b32;border-radius:5px;padding:1px 6px;font-size:11px}
</style></head><body>
<header>
  <h1>Sort stills</h1>
  <div class="bar"><i id="bar"></i></div>
  <div class="stat" id="stat"></div>
  <div class="meta" id="meta"></div>
</header>
<main><img id="img" alt=""><div class="done" id="done" style="display:none"></div></main>
<footer>
  <button class="k2" data-s="food">1 &middot; Restaurant / food</button>
  <button class="k3" data-s="out">2 &middot; Out &amp; about</button>
  <button class="k0" data-s="skip">0 &middot; Skip</button>
  <button id="back">&larr; Back</button>
  <input id="place" placeholder="Place for this day (applies to the whole day)" size="34">
  <input id="cap" placeholder="Caption (optional)" size="26">
  <span class="meta">keys <kbd>1</kbd><kbd>2</kbd><kbd>0</kbd> &middot; <kbd>&larr;</kbd> back</span>
</footer>
<script>
var P=[],S={photos:{},places:{}},i=0;
function cur(){ return P[i]; }
function save(body){ return fetch('/api/assign',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); }
function firstUnsorted(){ for(var j=0;j<P.length;j++){ if(!S.photos[P[j].key]) return j; } return P.length; }
function render(){
  var n=Object.keys(S.photos).length;
  document.getElementById('stat').textContent=n+' / '+P.length;
  document.getElementById('bar').style.width=(100*n/P.length)+'%';
  if(i>=P.length){
    document.getElementById('img').style.display='none';
    var d=document.getElementById('done'); d.style.display='block';
    d.textContent='All '+P.length+' sorted. Tell Claude to build the gallery.';
    document.getElementById('meta').textContent='';
    return;
  }
  var p=cur();
  document.getElementById('img').style.display='block';
  document.getElementById('done').style.display='none';
  document.getElementById('img').src='/thumb/'+encodeURIComponent(p.key);
  document.getElementById('meta').textContent=p.shot+(p.shotTime?' '+p.shotTime:'')+'  ·  '+p.key;
  document.getElementById('place').value=S.places[p.shot]||'';
  document.getElementById('cap').value=(S.photos[p.key]&&S.photos[p.key].what)||'';
}
function assign(sec){
  var p=cur(); if(!p) return;
  var place=document.getElementById('place').value.trim();
  var what=document.getElementById('cap').value.trim();
  S.photos[p.key]={section:sec,what:what};
  if(place) S.places[p.shot]=place;
  save({key:p.key,section:sec,what:what,shot:p.shot,place:place});
  document.getElementById('cap').value='';
  i++; render();
}
document.querySelectorAll('button[data-s]').forEach(function(b){ b.onclick=function(){ assign(b.dataset.s); }; });
document.getElementById('back').onclick=function(){ if(i>0){ i--; render(); } };
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'&&e.key!=='Enter') return;
  if(e.key==='1')assign('food'); else if(e.key==='2')assign('out');
  else if(e.key==='0')assign('skip');
  else if(e.key==='ArrowLeft'&&i>0){i--;render();}
});
fetch('/api/photos').then(r=>r.json()).then(function(d){ P=d.photos; S=d.sections; i=firstUnsorted(); render(); });
</script></body></html>`;

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/') { res.writeHead(200, {'Content-Type':'text/html'}); return res.end(PAGE); }
  if (u.pathname === '/api/photos') {
    res.writeHead(200, {'Content-Type':'application/json'});
    return res.end(JSON.stringify({ photos, sections }));
  }
  if (u.pathname === '/api/assign' && req.method === 'POST') {
    let b=''; req.on('data', c => b += c);
    return req.on('end', () => {
      try {
        const d = JSON.parse(b);
        sections.photos[d.key] = { section: d.section, what: d.what || '' };
        if (d.place) sections.places[d.shot] = d.place;
        fs.writeFileSync(secPath, JSON.stringify(sections, null, 2));   // save every keypress
        res.writeHead(200, {'Content-Type':'application/json'}); res.end('{"ok":true}');
      } catch (e) { res.writeHead(400); res.end('{"ok":false}'); }
    });
  }
  if (u.pathname.startsWith('/thumb/')) {
    const key = decodeURIComponent(u.pathname.slice(7));
    const m = manifest.find(x => x.day + '/' + x.name === key);
    if (!m) { res.writeHead(404); return res.end(); }
    const f = path.join(WEB, m.full);          // full size: judging a photo needs to see it
    if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {'Content-Type':'image/jpeg'});
    return fs.createReadStream(f).pipe(res);
  }
  res.writeHead(404); res.end();
}).listen(PORT, () => {
  const n = Object.keys(sections.photos).length;
  console.log('Sort stills:  http://localhost:' + PORT);
  console.log(photos.length + ' photos, ' + n + ' already sorted' + (n ? ' (resuming where you left off)' : ''));
  console.log('keys: 1 restaurant/food · 2 out & about · 0 skip · left arrow back');
  console.log('saves to ' + secPath + ' after every keypress. Ctrl-C when done.');
});
