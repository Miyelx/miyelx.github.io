const CACHE_NAME = "cache-v7.15"; // cambia versión al actualizar

// Instalación: cachear recursos iniciales
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
       "/index.html",
       "/estilos.css",
       "/convertidor.js",
       "img/bs.webp",
       "img/col.webp",
       "img/dolar.webp",
       "img/eur.webp",
       "img/fondo.webp",
       "img/MIG(copia).png",
       "img/MIG.png"
     ]);
    })
  );
});

const limitarCache = (nombre, max) =>
  caches.open(nombre).then(c => c.keys().then(keys => {
      if (keys.length > max) { c.delete(keys[0]).then(() => limitarCache(nombre, max)); }
    })
  );

// Activación: limpiar cachés antiguos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
});

// Fetch: estrategia diferenciada
self.addEventListener("fetch", event => {
  const request = event.request;

  // Para archivos JSON → network-first con fallback a cache
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
          // Si no hay red, usar versión cacheada
          return caches.match(request);
        })
    );
  } else {
    // Para HTML, CSS, imágenes → cache-first con actualización dinámica
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
