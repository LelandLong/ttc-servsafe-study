// Chef's Kitchen service worker — offline support (built 08-11-2026).
// Strategy: cache name is stamped with APP_VERSION, so every release starts a
// fresh cache and activate() wipes the old ones — a stale SW can never pin
// users to an old version for more than one load. Navigations and version.js
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
  'assets/snarky/celebrate-holly-loop-01-poster.jpg'
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

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      var core = Promise.all(CORE.map(function (u) { return putInCache(cache, u); }));
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
