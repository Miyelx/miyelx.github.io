// service-worker.js
const CACHE_NAME = "mi-pwa-cache-v1";
const URLS_TO_CACHE = [
  "/index.html",
  "/estilos.css",
  "/bs.webp",
  "/col$.webp",
  "/dolar.webp",
  "/eur.webp",
  "/fondo.webp",
  "/MIG(copia).png",
  "/MIG.png"
];

// Instalación: cachear HTML y CSS
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Fetch: servir HTML y CSS desde cache, JS siempre desde red
self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.url.endsWith(".js")) {
    // Para JS: siempre pedir de la red
    event.respondWith(fetch(request));
  } else {
    // Para HTML y CSS: cache first
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request);
      })
    );
  }
});

