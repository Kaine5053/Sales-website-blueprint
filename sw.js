/* ============================================================================
   SERVICE WORKER — lightweight offline support for the blueprint.
   Strategy:
     • HTML  → network-first (so content stays fresh), fall back to cache.
     • Assets (css/js/img/svg) → cache-first (fast, offline-friendly).
   Bump CACHE when you change cached assets to invalidate the old cache.
   ============================================================================ */
const CACHE = 'northwind-v1';
const CORE = [
  '/',
  '/index.html',
  '/404.html',
  '/assets/css/theme.css',
  '/assets/css/base.css',
  '/assets/css/components.css',
  '/assets/css/layout.css',
  '/assets/css/features.css',
  '/assets/js/config.js',
  '/assets/js/products.js',
  '/assets/js/questionnaire.js',
  '/assets/js/presets.js',
  '/assets/js/app.js',
  '/assets/img/icon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) return; // don't touch cross-origin (fonts, analytics)

  const isHTML = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    e.respondWith(
      fetch(request)
        .then((res) => { cachePut(request, res.clone()); return res; })
        .catch(() => caches.match(request).then((r) => r || caches.match('/index.html')))
    );
  } else {
    e.respondWith(
      caches.match(request).then((cached) =>
        cached || fetch(request).then((res) => { cachePut(request, res.clone()); return res; }))
    );
  }
});

function cachePut(request, res) {
  if (res && res.status === 200) caches.open(CACHE).then((c) => c.put(request, res)).catch(() => {});
}
