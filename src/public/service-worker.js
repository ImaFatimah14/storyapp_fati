
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  workbox.core.setCacheNameDetails({ prefix: 'story-app' });

  // Precache manifest
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: null },
    { url: '/index.html', revision: null },
    { url: '/offline.html', revision: null },
    { url: '/app.bundle.js', revision: null },
    { url: '/icons/icon-192x192.png', revision: null },
    { url: '/icons/icon-512x512.png', revision: null },
    { url: '/manifest.json', revision: null },
  ]);

  // Cache images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'story-app-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
      ],
    })
  );

  // Cache API responses
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://story-api.dicoding.dev',
    new workbox.strategies.NetworkFirst({
      cacheName: 'story-app-api',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 24 * 60 * 60 }),
      ],
    })
  );

  // Fallback offline page
  workbox.routing.setCatchHandler(async ({ event }) => {
    if (event.request.destination === 'document') {
      return caches.match('/offline.html');
    }
    return Response.error();
  });
}

// Push Notification
self.addEventListener('push', function (event) {
  let notificationData = {};
  if (event.data) notificationData = event.data.json();

  const title = notificationData.title || 'Notifikasi Baru!';
  const options = {
    body: notificationData.body || 'Ada update terbaru di Story App.',
    icon: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
