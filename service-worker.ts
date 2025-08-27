// Using a type assertion to treat `self` as a ServiceWorkerGlobalScope
const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_NAME = 'ai-stock-advisor-v1';

// This list should include all the files that make up the app shell.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  '/components/Header.tsx',
  '/components/Footer.tsx',
  '/components/StockInputForm.tsx',
  '/components/AnalysisDisplay.tsx',
  '/components/LoadingSpinner.tsx',
  '/vite.svg',
];

// Install event: Cache the app shell
sw.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Failed to open cache', err);
      })
  );
});

// Fetch event: Serve from cache if available, otherwise fetch from network
sw.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, cache it, and return it.
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response.
            // We don't cache non-GET requests or opaque responses from cross-origin requests.
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event: Clean up old caches
sw.addEventListener('activate', (event: ExtendableEvent) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});