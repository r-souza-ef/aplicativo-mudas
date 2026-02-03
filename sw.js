
const CACHE_NAME = 'mudas-pwa-v4';
const OFFLINE_URL = 'index.html';

// Arquivos básicos para o "esqueleto" do app
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn-icons-png.flaticon.com/512/628/628283.png'
];

// Instalação: Cacheia o básico
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Apenas métodos GET
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Se está no cache, entrega e tenta atualizar em background
      if (cachedResponse) {
        // Tenta atualizar o cache em background (estratégia Stale-While-Revalidate)
        event.waitUntil(
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          }).catch(() => {/* Silencia erros offline */})
        );
        return cachedResponse;
      }

      // Se não está no cache, busca na rede
      return fetch(event.request)
        .then((networkResponse) => {
          // Se a resposta for válida, salva no cache dinamicamente
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // FALLBACK OFFLINE: Se falhar a rede e for uma navegação (abrir o app)
          if (event.request.mode === 'navigate') {
            return caches.match('./') || caches.match('./index.html');
          }
          return null;
        });
    })
  );
});
