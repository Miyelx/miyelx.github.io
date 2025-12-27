const CACHE_NAME = "cache-pwa-v5.4"; // cambiar versión al actualizar

// Instalación: cachear recursos iniciales
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
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
      ]);
    })
  );
});

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
  // Para archivos JSON → network-first
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
          return caches.match(request);// Si no hay red, usar versión cacheada
        })
    );
  } else {
    // Para HTML, CSS, imágenes → cache-first 
    event.respondWith(
      caches.match(request).then(response => {
         if (response) { // Si ya está en caché se usa 
           return response;
         } // Si no está, pide a la red y guarda en caché 
           return fetch(request).then(networkResponse => { 
             const clone = networkResponse.clone(); 
             caches.open(CACHE_NAME).then(cache => { 
               cache.put(request, clone); 
             }); 
             return networkResponse;
          });
      })
    );
  }
});
