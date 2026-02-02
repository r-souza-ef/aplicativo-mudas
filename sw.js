
const CACHE_NAME = 'avaliacao-mudas-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.tsx',
  './manifest.json',
  './components/SetupScreen.tsx',
  './components/EvaluationScreen.tsx',
  './components/ResultsScreen.tsx',
  './components/HistoryScreen.tsx',
  './components/StatCard.tsx',
  './components/ProgressBar.tsx',
  './components/DistanceEvaluationScreen.tsx',
  './utils/storage.ts',
  './utils/export.ts',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/',
  'https://esm.sh/react-dom@^19.2.4/client',
  'https://cdn-icons-png.flaticon.com/512/628/628283.png'
];

// Instalação: Armazena o App Shell no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Cacheando recursos para uso offline');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação: Limpa caches de versões anteriores
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Prioriza o cache e atualiza em segundo plano (Stale-While-Revalidate)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      }).catch(() => {
        // Silencia erro se estiver offline, o cachedResponse já será retornado
      });

      return cachedResponse || fetchPromise;
    })
  );
});
