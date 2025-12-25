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
// límite de entradas en caché
const MAX_ITEMS = 40;
// función auxiliar para limitar tamaño del caché
async function limitCacheSize(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]); // elimina el más antiguo
    await limitCacheSize(cacheName, maxItems); // recursivo hasta cumplir límite
  }
}

// Instalación: cachear recursos iniciales
self.addEventListener("install", event => { 
  self.skipWaiting(); 
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))); 
});

// Activación: limpiar cachés antiguos
self.addEventListener("activate", event => {
  event.waitUntil((async () => { 
    const keys = await caches.keys(); 
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))); 
    await self.clients.claim(); 
  })()); 
});

// Fetch: estrategia diferenciada
self.addEventListener("fetch", event => {
  const request = event.request;
  // Para archivos JSON → Stale‑while‑revalidate	Devuelve rápido lo que haya en caché y actualiza en segundo plano.
  if (request.url.endsWith("tasas.json")) {
    event.respondWith((async () => { 
      const cache = await caches.open(CACHE_NAME); 
      const cached = await cache.match(request); 
      const network = fetch(request).then(res => {
        if (res.ok) {
          cache.put(request, res.clone()); 
          limitCacheSize(CACHE_NAME, MAX_ITEMS); 
        } 
        return res; 
      }).catch(() => null); 
      // entrega rápido lo cacheado, actualiza en segundo plano 
      return cached || (await network); 
    })());
  } else {
    // Para HTML, CSS, imágenes → cache-only
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, clone);
              limitCacheSize(CACHE_NAME, MAX_ITEMS);
             });
          }
            return res;
        }).catch(() => caches.match(request));
      })
    );
 }
