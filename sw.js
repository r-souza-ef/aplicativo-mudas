const CACHE_NAME = "app-cache-v2";

const APP_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/index.tsx"
];

// Instala
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
});

// Ativa
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch (estratégia SPA)
self.addEventListener("fetch", (event) => {
  // Para requisições de navegação (mudança de página)
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("/index.html").then((response) => {
        return response || fetch(event.request);
      }).catch(() => {
        return caches.match("/index.html");
      })
    );
    return;
  }

  // Para outros recursos (JS, CSS, Imagens)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});