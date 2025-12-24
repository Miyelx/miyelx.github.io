// service-worker.js
const CACHE_NAME = "mi-pwa-cache-v4"; // cambia versión al actualizar
const URLS_TO_CACHE = [
  "/index.html",
  "/estilos.css",
  "/convertidor.js",
  "img/bs.webp",
  "img/col$.webp",
  "img/dolar.webp",
  "img/eur.webp",
  "img/fondo.webp",
  "img/MIG(copia).png",
  "img/MIG.png"
];

// Instalación: cachear recursos iniciales
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activación: limpiar cachés antiguos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
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
          return res;
        })
        .catch(() => {
          return caches.match(request);
        })
      })
    );
  }
});
