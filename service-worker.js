const CACHE_NAME = "cache-v7.32";

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

const limiteCache = (nombre, max) =>
  caches.open(nombre).then(c => c.keys().then(keys => {
      if (keys.length > max) { c.delete(keys[0]).then(() => limiteCache(nombre, max)); }
    })
  );

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.url.endsWith("tasas.json")) { 
    event.respondWith(fetch(request).then(response => {
        const response = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request,response));
        return response;
      }).catch(() => {
        return caches.match(request);
      })
    );
   }else{
     event.respondWith(caches.match(request).then(response => {
        if (response) { 
          return response; 
        }
        return fetch(request).then(res => {
          const res = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request,res));
          limiteCache(CACHE_NAME,46); });
          return res;
      })
    );
  }
});
