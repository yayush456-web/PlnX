// ═══════════════════════════════════════════════════
//  PlnX Service Worker
//  Cache-first for app shell, network-first for data
// ═══════════════════════════════════════════════════

const CACHE_NAME = 'plnx-v1';

// App shell — everything needed to run offline
const PRECACHE_URLS = [
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  // Google Fonts (cached on first load)
  'https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Figtree:wght@300;400;500;600;700;800;900&display=swap'
];

// ── INSTALL: pre-cache the app shell ──────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Cache core files; don't fail install if font CDN is unreachable
      return cache.addAll([
        '/index.html',
        '/manifest.json',
        '/icon-192.png',
        '/icon-512.png',
        '/apple-touch-icon.png'
      ]).then(() => {
        // Attempt to cache fonts separately (non-blocking)
        return cache.add(PRECACHE_URLS[PRECACHE_URLS.length - 1]).catch(() => {});
      });
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ─────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for app shell, network-first for everything else ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and browser-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  // ── Cache-first: app shell & icons ──
  const isAppShell =
    url.origin === self.location.origin ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (isAppShell) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request)
          .then(response => {
            // Only cache valid responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
            return response;
          })
          .catch(() => {
            // If offline and it's the HTML page, serve the cached index
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
    );
    return;
  }

  // ── Network-first: everything else (API calls, etc.) ──
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// ── BACKGROUND SYNC placeholder (for future use) ──
self.addEventListener('sync', event => {
  if (event.tag === 'plnx-sync') {
    // Reserved for future background data sync
    console.log('[PlnX SW] Background sync triggered');
  }
});

// ── PUSH NOTIFICATIONS placeholder (for future use) ──
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'PlnX';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [50, 100, 50],
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
