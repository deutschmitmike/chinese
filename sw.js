// Offline cache for the app (copied from vietnamesisch-phuong on 5 Nov 2026): practise without a connection, progress
// syncs later. The page: network first, the cached copy only when offline. version.json and Firebase always go to the
// network. The Vietnamese app lives on the same origin, so this worker only ever deletes its own caches ("chinese-…").
const CACHE = "chinese-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("chinese-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.endsWith("version.json")) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.open(CACHE).then(c => c.match(e.request).then(hit => hit || c.match(new URL("./", self.registration.scope).href)))));
});
