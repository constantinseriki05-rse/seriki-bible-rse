/* SERIKI BIBLE RSE : service worker.
   Il rend l'application installable sur Android et PC et la fait fonctionner hors ligne.
   Stratégie « réseau d'abord » : avec Internet, on obtient toujours la dernière version, qui est aussitôt
   gardée en réserve ; sans Internet, l'application s'ouvre avec la dernière version enregistrée. */
const CACHE = 'seriki-v22';
const CORE = ['./', './index.html', './css/app.css', './js/app.js', './manifest.webmanifest',
  './data/bible.json', './data/terrain.json', './data/labo.json', './data/metiers.json', './data/entreprises.json',
  './data/actualites.json', './data/offres.json', './data/sources-actualites.json', './data/cours/exemple-csrd.json',
  './icons/logo-complet.webp', './icons/logo-embleme.webp', './icons/favicon-48.png', './icons/icon-192.png', './icons/icon-512.png',
  './lib/jszip.min.js', './lib/xlsx.full.min.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(new Request(u, {cache: 'reload'})).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(K => Promise.all(K.filter(k => k.startsWith('seriki-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;
  e.respondWith(fetch(r).then(res => {
    if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)).catch(() => {}); }
    return res;
  }).catch(() => caches.match(r, {ignoreSearch: true}).then(m => m || (r.mode === 'navigate' ? caches.match('./index.html') : undefined)).then(m => m || new Response('Hors ligne', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}}))));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const cible = new URL('./#actualites', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type: 'window', includeUncontrolled: true}).then(l => {
    for (const c of l) { if ('focus' in c) { c.navigate ? c.navigate(cible) : null; return c.focus(); } }
    return self.clients.openWindow(cible);
  }));
});
