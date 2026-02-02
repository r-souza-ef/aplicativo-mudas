
const CACHE_NAME = 'mudas-offline-v3';

// Recursos críticos que DEVEM estar no cache para o app abrir
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/manifest.json',
  '/components/SetupScreen.tsx',
  '/components/EvaluationScreen.tsx',
  '/components/ResultsScreen.tsx',
  '/components/HistoryScreen.tsx',
  '/components/StatCard.tsx',
  '/components/ProgressBar.tsx',
  '/components/DistanceEvaluationScreen.tsx',
  '/utils/storage.ts',
  '/utils/export.ts',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/',
  'https://esm.sh/react-dom@^19.2.4/client'
];

// Instalação: Salva tudo o que é essencial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Instalando e cacheando ativos fixos');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação: Limpa versões velhas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

// Estratégia: Cache First, Network Fallback (com atualização de cache em background)
self.addEventListener('fetch', event => {
  // Ignora requisições que não sejam GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Se está no cache, entrega imediatamente
      if (cachedResponse) {
        // Tenta atualizar o cache em background se houver rede
        fetch(event.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {}); // Ignora erro se estiver offline
        
        return cachedResponse;
      }

      // Se não está no cache, tenta a rede
      return fetch(event.request).then(networkResponse => {
        // Salva no cache para a próxima vez
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Se a rede falhar (offline) e for uma navegação de página, entrega o index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return null;
      });
    })
  );
});
