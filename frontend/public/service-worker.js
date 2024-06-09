self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    // Pridėti failų į cache'ą
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/logo.png',
                // Pridėti kitus failus į cache'ą
            ]);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    // Pašalinti senus cache'us
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== 'v1') {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
