// Chef's Kitchen service worker — offline support (built 08-11-2026).
// Strategy: cache name is stamped with APP_VERSION, so every release starts a
// fresh cache and activate() wipes the old ones. (This header used to promise a
// stale SW "can never pin users to an old version for more than one load". It
// could: install needs every CORE file, one dropped download on hotel wifi threw
// the new worker away, and the old one kept running while the page - which loads
// network-first - showed the NEW version number. 2026-09-11, audio broken on a
// device labelled v09-11-2026-1. Now CORE falls back to the previous cache, and
// the worker reports its own version so the label can't claim what isn't
// running.) Navigations and version.js
// are NETWORK-FIRST (the update banner keeps working); everything else is
// cache-first with runtime fill. Convex calls are POSTs and pass through
// untouched — private-page bodies are cached at the app layer (localStorage),
// not here, so access control stays server-side.
importScripts('version.js'); // defines APP_VERSION

var CACHE = 'chef-kitchen-' + APP_VERSION;

// Must-have for the shell to boot offline. install() fails (and the SW retries
// next load) if any of these can't be cached — a partial shell is worse than none.
var CORE = [
  'index.html',
  'version.js',
  'manifest.json',
  'questions.js',
  'questions-original.js',
  'questions-cul105.js',
  'questions-cul105-original.js',
  'questions-cul112.js',
  'questions-cul112-original.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js',
  'https://cdn.tailwindcss.com'
];

// Nice-to-have: UI images. Cached best-effort — a missing mascot must not
// block offline emergency info.
var IMAGES = [
  'assets/chef-celebrate.jpg', 'assets/chef-clipboard.jpg', 'assets/chef-crosscontam.jpg',
  'assets/chef-dangerzone.jpg', 'assets/chef-encourage.jpg', 'assets/chef-fridge.jpg',
  'assets/chef-greeting.jpg', 'assets/chef-handwash.jpg', 'assets/chef-idle.jpg',
  'assets/chef-reading.jpg', 'assets/chef-sanitize.jpg', 'assets/chef-sick.jpg',
  'assets/chef-spoiled.jpg', 'assets/chef-thermometer.jpg', 'assets/chef-thinking.jpg',
  'assets/chef-timer.jpg', 'assets/chef-trophy.jpg', 'assets/headshot_20260210.png',
  'assets/kitchen-bg.jpg', 'assets/snarky/channel-thumbnail-premiere.jpg',
  // Snarky cast — stills + identity only. Loops and audio are deliberately NOT
  // precached: they fill at runtime on first play so first load stays lean and
  // offline emergency info keeps priority (theme assets never outrank it).
  'assets/snarky/qa-wrongston-01.jpg', 'assets/snarky/qa-wrongston-02.jpg',
  'assets/snarky/qa-wrongston-03.jpg', 'assets/snarky/qa-wrongston-04.jpg',
  'assets/snarky/qa-wrongston-05.jpg', 'assets/snarky/qa-alex-01.jpg',
  'assets/snarky/qa-diane-01.jpg', 'assets/snarky/hints-diane-01.jpg',
  'assets/snarky/leaderboard-holly-01.jpg', 'assets/snarky/livetest-chad-01.jpg',
  'assets/snarky/recipes-gaspard-01.jpg', 'assets/snarky/correct-sasha-mark.jpg',
  'assets/snarky/identity-login-hero.jpg', 'assets/snarky/identity-logo-512.png',
  'assets/snarky/identity-logo-192.png', 'assets/snarky/identity-favicon-64.png',
  'assets/snarky/qa-wrongston-loop-01-poster.jpg',
  'assets/snarky/celebrate-holly-loop-01-poster.jpg',
  // Newsroom-wall posters — the monitors must at least show a frame offline
  'assets/snarky/hints-diane-loop-01-poster.jpg',
  'assets/snarky/leaderboard-holly-loop-01-poster.jpg',
  'assets/snarky/recipes-gaspard-loop-01-poster.jpg',
  'assets/snarky/livetest-chad-loop-01-poster.jpg',
  // Transparent cutouts — header flankers, dividers, the bouncing greeter
  'assets/snarky/avatar-wrongston.webp', 'assets/snarky/avatar-holly.webp',
  'assets/snarky/avatar-gaspard.webp', 'assets/snarky/avatar-alex.webp'
];

function putInCache(cache, url) {
  // Cross-origin CDN scripts need no-cors (opaque responses are fine to serve
  // for <script> tags). Only cache a successful/opaque response.
  var req = new Request(url, url.indexOf('https://') === 0 ? { mode: 'no-cors' } : undefined);
  return fetch(req).then(function (res) {
    if (res && (res.ok || res.type === 'opaque')) return cache.put(url, res);
    throw new Error('bad response for ' + url);
  });
}

// A CORE file that fails to download is taken from the copy an earlier version
// cached (old caches still exist until activate() clears them). Without this a
// single dropped fetch discarded the whole new worker and left the old one in
// charge. version.js is the exception: it IS the version, so it must be fresh.
function putCore(cache, url) {
  return putInCache(cache, url).catch(function (err) {
    if (url === 'version.js') throw err;
    return caches.match(url).then(function (hit) {
      if (hit) return cache.put(url, hit);
      throw err;
    });
  });
}

// The page asks which version this worker is, so the label reports what is
// actually running rather than what the server offers.
self.addEventListener('message', function (e) {
  if (e.data === 'ck-version' && e.ports && e.ports[0]) e.ports[0].postMessage({ ckVersion: APP_VERSION });
});

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      var core = Promise.all(CORE.map(function (u) { return putCore(cache, u); }));
      var images = Promise.all(IMAGES.map(function (u) {
        return putInCache(cache, u).catch(function () {}); // best-effort
      }));
      return core.then(function () { return images; });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE && k.indexOf('chef-kitchen-') === 0) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return; // Convex POSTs etc. pass through

  var url = new URL(req.url);

  // STAND ASIDE FOR CROSS-ORIGIN MEDIA. The trip audio streams from Convex
  // storage; the browser asks for it in byte RANGES, and this worker used to
  // answer with its own no-cors fetch - an OPAQUE response. WebKit (Safari, and
  // every browser on iOS) refuses to stream media from an opaque response a
  // service worker hands it, so every recording failed instantly with
  // MediaError 4 ("source not supported") - while Chrome, which tolerates it,
  // played fine. Serving a cached whole file in reply to a Range request breaks
  // streaming too. Not calling respondWith() lets the browser go to the network
  // itself, which is what media needs.
  // Scoped deliberately: cross-origin only, so the app's own sounds and loops are
  // untouched, and Convex PHOTOS (destination "image", no Range) are still cached
  // for the offline gallery.
  if (url.origin !== self.location.origin &&
      (req.headers.has('range') || req.destination === 'audio' || req.destination === 'video')) {
    return;
  }

  var isNavigation = req.mode === 'navigate';
  var isVersion = url.pathname.indexOf('version.js') !== -1;

  if (isNavigation || isVersion) {
    // Network-first: updates always win when online; cache only saves offline.
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put(isNavigation ? 'index.html' : 'version.js', copy);
          });
        }
        return res;
      }).catch(function () {
        return caches.match(isNavigation ? 'index.html' : 'version.js');
      })
    );
    return;
  }

  // Everything else: cache-first, fill the cache from the network on miss.
  // Match ignoring query strings (the app cache-busts with ?nc=).
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.ok || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
