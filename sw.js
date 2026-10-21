// Service worker: installability plus offline caching.
// - the page and its same-origin files go network-first, so a deploy is
//   picked up on the next load and the cached copy only serves when offline
// - cross-origin images (emotes, badges, gifs) paint from a capped cache
//   and refresh in the background daily - the urls are near-immutable,
//   so updates are rare anyway and appear on the next load
// - google fonts (the css2 sheet and its woff2 payloads) go cache-first in a
//   small uncapped bucket, so offline keeps the same faces
// - everything else (twitch embed, relay iframe, apis) passes straight through
const SHELL = 'hasan-shell-v1';
const IMAGES = 'hasan-img-v1';
const IMAGE_STAMPS = 'hasan-img-stamps-v1';
const FONTS = 'hasan-fonts-v1';
const IMG_CAP = 600;
const IMAGE_REFRESH_MS = 24 * 60 * 60 * 1000;
const imageRefresh = new Map();
// gif cdns serve content-addressed media - it can never change, so those
// hits skip revalidation entirely; emote hosts keep the daily window for
// seasonal swaps and the odd in-place edit
const STATIC_IMG = /(^|\.)giphy\.com$|(^|\.)tenor\.com$/;
const PRECACHE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== SHELL && k !== IMAGES && k !== IMAGE_STAMPS && k !== FONTS).map((k) => caches.delete(k))))
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

async function cacheFirst(req, e) {
  const cache = await caches.open(IMAGES);
  const hit = await cache.match(req);
  const stamps = await caches.open(IMAGE_STAMPS);
  const refresh = async () => {
    const res = await fetch(req);
    if (res.ok || res.type === 'opaque') try {
      await cache.put(req, res.clone());
      await trim(cache);
      await stamps.put(req, new Response(String(Date.now())));
      await trim(stamps);
    } catch {}
    return res;
  };
  if (hit) {
    if (STATIC_IMG.test(new URL(req.url).host)) return hit;
    const now = Date.now();
    const recent = imageRefresh.get(req.url) || 0;
    if (now - recent < IMAGE_REFRESH_MS) return hit;
    const stamp = await stamps.match(req);
    const last = stamp ? Number(await stamp.text()) || 0 : 0;
    if (now - last >= IMAGE_REFRESH_MS) {
      imageRefresh.delete(req.url);
      imageRefresh.set(req.url, now);
      if (imageRefresh.size > IMG_CAP) imageRefresh.delete(imageRefresh.keys().next().value);
      e.waitUntil(refresh().catch(() => {}));
    }
    return hit;
  }
  return refresh();
}

async function fontFirst(req) {
  const cache = await caches.open(FONTS);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
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
  const url = new URL(req.url);
  if (url.origin === location.origin) return e.respondWith(networkFirst(req));
  if (req.destination === 'image') return e.respondWith(cacheFirst(req, e));
  if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') e.respondWith(fontFirst(req));
});
