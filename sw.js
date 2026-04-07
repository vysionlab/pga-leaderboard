const CACHE_NAME = 'pga-live-v4';
const ASSETS = [
  '/pga-leaderboard/',
  '/pga-leaderboard/index.html',
  '/pga-leaderboard/pga_logo.jpg',
  '/pga-leaderboard/manifest.json'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for everything — fall back to cache only when offline
  e.respondWith(
    fetch(e.request).then(resp => {
      // Cache successful responses for offline use
      if (resp.ok) {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
