const CACHE_NAME = "cache-v7.24"; //version del cache
// Instalación de recursos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
       "/index.html",
       "/estilos.css",
       "/convertidor.js",
       "img/bs.png",
       "img/col.png",
       "img/dolar.png",
       "img/eur.png",
       "img/fondo.webp",
       "img/MIG.png",
       "img/MIG_inicio.png"]);
    })
  );
});

const limitarCache = (nombre, max) =>
  caches.open(nombre).then(c => c.keys().then(keys => {
      if (keys.length > max) { c.delete(keys[0]).then(() => limitarCache(nombre, max)); }
    })
  );

// Activación:limpiar cache antiguo
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  //.json se buscan en red
  if (request.url.endsWith("tasas.json")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Guardar nueva versión en cache
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          // Si no hay red, usar cache antiguo
          return caches.match(request);
        })
    );
  } else {
    // Para el resto usar primero caché
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response;
        }
        return fetch(request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          limitarCache(CACHE_NAME, 45);
        });
          return res;
      })
    );
  }
});
