const CACHE_NAME = "cache-v7.25";

self.addEventListener("install", event => { 
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
       "/index.html","/estilos.css","/convertidor.js",
       "/sw.js","img/bs.png","img/col.png","img/dolar.png",
       "img/eur.png","img/fondo.webp","img/MIG.png",
       "img/MIG_inicio.png"]);
    })
  );
});

const limitarCache = (nombre, max) =>
  caches.open(nombre).then(c => c.keys().then(keys => {
      keys.length > max ? c.delete(keys[0]).then(() => limitarCache(nombre, max)) : null;
    })
  );

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  request.url.endsWith("tasas.json") ?
    event.respondWith(fetch(request).then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(request,response.clone()));
          return response;
        }).catch(() => {
          return caches.match(request);
        })
    );
  :
    event.respondWith(caches.match(request).then(response => {
        if (response) { 
          return response; 
        }
        return fetch(request).then(res => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, res.clone()));
          limitarCache(CACHE_NAME, 45); });
          return res;
      })
    );
});
