const CACHE = 'conexzion-v4';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(res=>{
      return res || fetch(e.request).then(f=>{
        // don't cache api calls
        if(e.request.url.includes('chrome-extension')) return f;
        return f;
      }).catch(()=> caches.match('/index.html'));
    })
  );
});