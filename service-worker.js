const CACHE_NAME = "cache-v7.9";//version de cache

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll([
  "/index.html","/estilos.css","/convertidor.js","img/bs.webp","img/col.webp",
  "img/dolar.webp","img/eur.webp","img/fondo.webp","img/MIG(copia).png","img/MIG.png"])))
});
  
const limitarCache = (nombre, max) =>
  caches.open(nombre).then(c => c.keys().then(keys => {
      if (keys.length > max) { c.delete(keys[0]).then(() => limitarCache(nombre, max)); }
    })
  );

self.addEventListener("activate", e => e.waitUntil(//ejecuta el cache actual
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
);

self.addEventListener("fetch", e => {
  const req = e.request;
  e.respondWith(
    req.url.endsWith("tasas.json")
      ? fetch(req).then(res => {
          caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
          return res;
        }).catch(() => caches.match(req))
      : caches.match(req).then(res =>
          res || fetch(req).then(red => {//devuelve cache si hay(res) si no busca en la red.
            caches.open(CACHE_NAME).then(c => {
              c.put(req, red.clone());
              limitarCache(CACHE_NAME, 45);
            });
            return red;
          })
        )
  );
});
