const CACHE_NAME = "cache-v8.4";
const ASSETS = [
  "./",
  "index.html",
  "estilos.css",
  "convertidor.js",
  "tasas.json",
  "img/bs.png",
  "img/col.png",
  "img/dolar.png",
  "img/eur.png",
  "img/fondo.webp",
  "img/MIG.png",
  "img/MIG_inicio.png"
];

// 1. Instalación
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caché abierto correctamente");
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Fuerza al SW nuevo a activarse
  );
});

// 2. Activación
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim()) // Toma control de las pestañas abiertas 
  );
});

const limitarCache = (nombre, max) => {
  caches.open(nombre).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > max) {
        cache.delete(keys[0]).then(() => limitarCache(nombre, max));
      }
    });
  });
};

// 3. Fetch Diferenciado
self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.url.includes("tasas.json")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, resClone));
          return response;
        }).catch(() => caches.match(request)) // Sin red, dar cache
    );
  } else {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(netResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(request, netResponse.clone());
            limitarCache(CACHE_NAME, 48);
            return netResponse;
          });
        });
      }).catch(() => {
      })
    );
  }
});
