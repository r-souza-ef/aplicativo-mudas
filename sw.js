
const CACHE_NAME = 'avaliacao-mudas-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/constants.tsx',
  '/components/SetupScreen.tsx',
  '/components/EvaluationScreen.tsx',
  '/components/ResultsScreen.tsx',
  '/components/HistoryScreen.tsx',
  '/components/StatCard.tsx',
  '/components/ProgressBar.tsx',
  '/utils/storage.ts',
  '/utils/export.ts',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://esm.sh/react@^19.2.4',
  'https://esm.sh/react-dom@^19.2.4/',
  'https://esm.sh/react@^19.2.4/',
];

// Instala o service worker e armazena em cache todos os recursos do aplicativo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// Serve o conteúdo do cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Encontrado no cache - retorna a resposta
        if (response) {
          return response;
        }
        // Não está no cache - busca na rede
        return fetch(event.request);
      }
    )
  );
});

// Opcional: Limpa caches antigos
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
