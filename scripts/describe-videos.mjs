#!/usr/bin/env node
/**
 * Write a short description for each video/audio in the hub - one at a time,
 * the way sort-stills does photos.
 *
 * The clip plays LOCALLY from the drive, not from YouTube: instant, full
 * quality, and immune to the hotel wifi that kept collapsing to 15 KB/s.
 *
 *   type a line  ->  Enter saves and moves on
 *   Esc          ->  skip this one for now
 *   Back / list  ->  revisit anything, it is all editable
 *
 * Saves to private/video-hub.json after EVERY Enter, so closing the tab loses
 * nothing, and reopening resumes at the first clip without a description.
 * Nothing is published until Claude runs build-hub-data + push.
 *
 *   node scripts/describe-videos.mjs     ->  http://localhost:8788
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { readHub, writeHub, HUB_JSON } from './lib/media.mjs';

const PORT = +(process.env.PORT || 8788);
const MAX = 140;
let hub = readHub();
if (!hub) { console.error('no ' + HUB_JSON + ' - run: node scripts/build-hub-data.mjs --import'); process.exit(1); }

const TYPES = { mp4: 'video/mp4', mov: 'video/quicktime', m4a: 'audio/mp4', mp3: 'audio/mpeg', aac: 'audio/aac', wav: 'audio/wav' };

function items() {
  return hub.entries.map((e, i) => ({
    i, audio: e.media === 'audio', id: e.id || null,
    date: e.date, time: e.time || '', dur: e.dur || '', place: e.place || '',
    what: e.what || '', note: e.note || '',
    file: e.file ? path.basename(e.file) : '',
    hasFile: !!(e.file && fs.existsSync(e.file)),
  }));
}

// Video elements SEEK with Range requests, and Safari will not play at all without
// them - so this has to answer 206 Partial Content, not just stream the file.
function stream(req, res, file) {
  const total = fs.statSync(file).size;
  const type = TYPES[path.extname(file).slice(1).toLowerCase()] || 'application/octet-stream';
  const r = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
  if (!r) {
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': total, 'Accept-Ranges': 'bytes' });
    return fs.createReadStream(file).pipe(res);
  }
  let start = r[1] ? +r[1] : 0, end = r[2] ? +r[2] : total - 1;
  if (!r[1] && r[2]) { start = Math.max(0, total - +r[2]); end = total - 1; }   // "last N bytes"
  end = Math.min(end, total - 1);
  if (start > end || start >= total) {
    res.writeHead(416, { 'Content-Range': 'bytes */' + total }); return res.end();
  }
  res.writeHead(206, { 'Content-Type': type, 'Accept-Ranges': 'bytes',
    'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Content-Length': end - start + 1 });
  fs.createReadStream(file, { start, end }).pipe(res);
}

const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>Describe videos</title><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,'Helvetica Neue',sans-serif;background:#17130f;color:#f5efe6;min-height:100vh;display:flex;flex-direction:column}
header{padding:10px 16px;background:#241c17;display:flex;gap:16px;align-items:center;flex-wrap:wrap}
h1{font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#f0b26a}
.bar{flex:1 1 220px;height:8px;background:#3a2c25;border-radius:99px;overflow:hidden;min-width:140px}
.bar i{display:block;height:100%;background:#f0b26a;width:0}
.stat{font-size:13px;font-weight:700;color:#c9bcb2;font-variant-numeric:tabular-nums}
main{flex:1 1 auto;display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:14px;padding:14px}
@media(max-width:820px){main{grid-template-columns:1fr}}
.stage{display:flex;flex-direction:column;gap:12px;min-width:0}
.player{background:#000;border-radius:10px;overflow:hidden;display:flex;align-items:center;justify-content:center;min-height:240px}
video{width:100%;max-height:58vh;display:block}
audio{width:92%;margin:40px 0}
.miss{color:#c9bcb2;font-size:14px;padding:40px 20px;text-align:center;line-height:1.5}
.info{font-size:13px;color:#c9bcb2;font-weight:700;font-variant-numeric:tabular-nums}
.info b{color:#f5efe6}
.note{font-size:12px;color:#bda99c;border-left:3px solid #5c4034;padding:4px 10px}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
input{flex:1 1 320px;font-family:inherit;font-size:16px;padding:12px 14px;border-radius:10px;border:1px solid #5c4034;background:#0f0c0a;color:#f5efe6}
input:focus{outline:2px solid #f0b26a;outline-offset:1px}
.count{font-size:12px;color:#8a7f76;font-variant-numeric:tabular-nums;min-width:52px;text-align:right}
button{font-family:inherit;font-size:14px;font-weight:800;border:0;border-radius:10px;padding:12px 16px;cursor:pointer;background:#3a2c25;color:#f5efe6}
button.go{background:#8f3a20}
button:hover{filter:brightness(1.15)}
button:focus-visible{outline:2px solid #f0b26a;outline-offset:2px}
.hint{font-size:12px;color:#8a7f76}
kbd{background:#0f0c0a;border:1px solid #4d3b32;border-radius:5px;padding:1px 6px;font-size:11px}
aside{background:#1f1814;border-radius:10px;padding:8px;overflow:auto;max-height:78vh}
aside div{font-size:12.5px;padding:7px 8px;border-radius:7px;cursor:pointer;display:flex;gap:7px;line-height:1.3}
aside div:hover{background:#2c221d}
aside div.cur{background:#3a2c25}
aside .tick{flex:0 0 14px;color:#6b7b3a;font-weight:900}
aside .t{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
aside .t.empty{color:#8a7f76;font-style:italic}
.done{font-size:17px;font-weight:800;color:#f0b26a;padding:40px 10px;text-align:center}
</style></head><body>
<header><h1>Describe videos</h1><div class="bar"><i id="bar"></i></div><div class="stat" id="stat"></div></header>
<main>
  <section class="stage" id="stage">
    <div class="player" id="player"></div>
    <div class="info" id="info"></div>
    <div class="note" id="note" hidden></div>
    <div class="row">
      <input id="what" maxlength="${MAX}" placeholder="A short description, e.g. Walking into the rehearsal hall" autocomplete="off">
      <span class="count" id="count"></span>
    </div>
    <div class="row">
      <button id="back" type="button">&larr; Back</button>
      <button id="skip" type="button">Skip</button>
      <button class="go" id="save" type="button">Save &amp; next &#9166;</button>
      <span class="hint"><kbd>Enter</kbd> save &amp; next &middot; <kbd>Esc</kbd> skip &middot; click any clip on the right to revisit it</span>
    </div>
  </section>
  <aside id="list"></aside>
</main>
<script>
var ITEMS=[], i=0;
var $=function(id){return document.getElementById(id);};
function firstUndescribed(){ for(var k=0;k<ITEMS.length;k++){ if(!ITEMS[k].what) return k; } return ITEMS.length; }
function label(it){ return it.what || (it.time ? it.time : it.date); }
function renderList(){
  var box=$('list'); box.innerHTML='';
  ITEMS.forEach(function(it,k){
    var d=document.createElement('div'); if(k===i) d.className='cur';
    var tk=document.createElement('span'); tk.className='tick'; tk.textContent=it.what?'\\u2713':'';
    var t=document.createElement('span'); t.className='t'+(it.what?'':' empty');
    t.textContent=(it.audio?'\\u{1F3A7} ':'')+(it.what || ((it.time||it.date)+' \\u00b7 '+it.dur));
    d.appendChild(tk); d.appendChild(t);
    d.onclick=function(){ i=k; render(); };
    box.appendChild(d);
  });
  var n=ITEMS.filter(function(x){return x.what;}).length;
  $('stat').textContent=n+' / '+ITEMS.length+' described';
  $('bar').style.width=(ITEMS.length?100*n/ITEMS.length:0)+'%';
}
function render(){
  renderList();
  var p=$('player'); p.innerHTML='';
  if(i>=ITEMS.length){
    $('stage').querySelectorAll('.row,.info,.note').forEach(function(x){x.style.display='none';});
    p.innerHTML='<div class="done">All '+ITEMS.length+' have a description.<br>Tell Claude to publish them.</div>';
    return;
  }
  $('stage').querySelectorAll('.row,.info').forEach(function(x){x.style.display='';});
  var it=ITEMS[i];
  if(it.hasFile){
    var m=document.createElement(it.audio?'audio':'video');
    m.src='/media/'+i; m.controls=true; m.preload='metadata';
    if(!it.audio){ m.muted=true; m.autoplay=true; m.playsInline=true; }
    p.appendChild(m);
  } else if(it.id){
    p.innerHTML='<div class="miss">Local file not found (is the drive plugged in?)<br>Showing the YouTube copy instead.</div>';
    var f=document.createElement('iframe'); f.style.cssText='width:100%;aspect-ratio:16/9;border:0';
    f.src='https://www.youtube-nocookie.com/embed/'+it.id+'?rel=0&playsinline=1';
    p.innerHTML=''; p.appendChild(f);
  } else {
    p.innerHTML='<div class="miss">Local file not found - is the drive plugged in?<br>You can still write the description.</div>';
  }
  $('info').innerHTML='';
  var bits=[it.date, it.time, it.dur, it.place, it.file].filter(Boolean);
  $('info').textContent=(i+1)+' of '+ITEMS.length+'   \\u00b7   '+bits.join('  \\u00b7  ');
  if(it.note){ $('note').hidden=false; $('note').textContent=it.note; } else { $('note').hidden=true; }
  $('what').value=it.what; count(); $('what').focus();
}
function count(){ $('count').textContent=$('what').value.length+' / ${MAX}'; }
function stopMedia(){ var m=$('player').querySelector('video,audio'); if(m){ try{m.pause();}catch(e){} } }
function save(){
  if(i>=ITEMS.length) return;
  var v=$('what').value.trim();
  ITEMS[i].what=v;
  fetch('/api/save',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({i:i,what:v})})
    .then(function(r){ if(!r.ok) alert('Save failed - nothing was lost from this page; try again.'); });
  stopMedia(); i++; render();
}
$('what').addEventListener('input',count);
$('what').addEventListener('keydown',function(e){
  if(e.key==='Enter'){ e.preventDefault(); save(); }
  else if(e.key==='Escape'){ e.preventDefault(); stopMedia(); i++; render(); }
});
$('save').onclick=save;
$('skip').onclick=function(){ stopMedia(); i++; render(); };
$('back').onclick=function(){ if(i>0){ stopMedia(); i--; render(); } };
fetch('/api/items').then(function(r){return r.json();}).then(function(d){ ITEMS=d; i=firstUndescribed(); render(); });
</script></body></html>`;

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(PAGE); }
  if (u.pathname === '/api/items') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(items())); }
  if (u.pathname === '/api/save' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c);
    return req.on('end', () => {
      try {
        const d = JSON.parse(b);
        const e = hub.entries[d.i];
        if (!e) throw new Error('no entry ' + d.i);
        e.what = String(d.what || '').trim().slice(0, MAX);
        writeHub(hub);                                    // every Enter hits the disk
        res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"ok":true}');
      } catch (err) { res.writeHead(400); res.end(JSON.stringify({ ok: false, error: err.message })); }
    });
  }
  const mm = /^\/media\/(\d+)$/.exec(u.pathname);
  if (mm) {
    const e = hub.entries[+mm[1]];
    if (!e || !e.file || !fs.existsSync(e.file)) { res.writeHead(404); return res.end(); }
    return stream(req, res, e.file);
  }
  res.writeHead(404); res.end();
}).listen(PORT, () => {
  const n = hub.entries.filter(e => e.what).length;
  console.log('Describe videos:  http://localhost:' + PORT);
  console.log(hub.entries.length + ' clips, ' + n + ' already described' + (n ? ' (resuming at the first one without)' : ''));
  console.log('Enter saves & moves on · Esc skips · saves to ' + HUB_JSON + ' after every Enter. Ctrl-C when done.');
});
