const CACHE_NAME = 'cache-pwa-v2';

// Lista de archivos a cachear
const urlsToCache = [
  '/',
  '/index.html',
  '/estilos.css',
  '/convertidor.js',
  '/MIG.png',
  '/bs.png',
  '/eur.png',
  '/dolar.png',
  '/col$.png',
  '/fondo2.png',
  '/MIG(copia).png',
  '/tasas.json'
];

// Instalación: cachea todos los recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cacheando recursos iniciales');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activación: limpiar caches viejos si cambias versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Actualiza el caché con la nueva versión
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Si falla la red, al menos devolvemos lo cacheado
          return cachedResponse;
        });

        // Devuelve inmediatamente lo cacheado (si existe), mientras la red se actualiza
        return cachedResponse || fetchPromise;
      });
    })
  );
});
