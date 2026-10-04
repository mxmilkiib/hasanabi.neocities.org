// Service worker: installability plus offline caching.
// - the page and its same-origin files go network-first, so a deploy is
//   picked up on the next load and the cached copy only serves when offline
// - images (emotes, badges, gifs from any origin) go cache-first with a cap,
//   so they stop re-downloading and still paint offline
// - everything else (twitch embed, relay iframe, apis) passes straight through
const SHELL = 'hasan-shell-v1';
const IMAGES = 'hasan-img-v1';
const IMG_CAP = 600;
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== SHELL && k !== IMAGES).map((k) => caches.delete(k))))
      .then(() => clients.claim()));
});

async function trim(cache) {
  const ks = await cache.keys();
  for (const k of ks.slice(0, Math.max(0, ks.length - IMG_CAP))) await cache.delete(k);
}

async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  // keyed by path alone: ?channel= and cache-bust queries share one entry
  const u = new URL(req.url);
  const key = u.origin + u.pathname;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(key, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(key);
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(IMAGES);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') { cache.put(req, res.clone()); trim(cache); }
  return res;
}

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    const c = cs.find((w) => 'focus' in w);
    return c ? c.focus() : clients.openWindow('./');
  }));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.destination === 'image') return e.respondWith(cacheFirst(req));
  const url = new URL(req.url);
  if (url.origin === location.origin) e.respondWith(networkFirst(req));
});
