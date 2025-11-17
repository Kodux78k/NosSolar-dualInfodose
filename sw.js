/* Dual HTML Lab — Service Worker */
const VERSION = 'v1.0.0';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.map(k=>k!==VERSION?caches.delete(k):null)))
  );
});
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  const url = new URL(req.url);
  // Runtime caching for cross-origin (CDNs & fetched HTML)
  if(req.method === 'GET'){
    e.respondWith(
      caches.match(req).then(cached=>{
        const net = fetch(req).then(res=>{
          const copy = res.clone();
          caches.open(VERSION).then(c=>c.put(req, copy)).catch(()=>{});
          return res;
        }).catch(()=>cached);
        return cached || net;
      })
    );
  }
});
