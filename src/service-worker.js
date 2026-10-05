/* eslint-disable no-restricted-globals */
/**
 * Offline support and instant repeat visits.
 * - App files are precached (versioned by the build).
 * - Pages always open, even offline, from the cached app shell.
 * - Public API: network first (4 s), then the last good copy.
 * - Photos: served from cache, refreshed in the background.
 */
import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// SPA navigation → index.html (but never for API, media or files with an extension).
registerRoute(
  new NavigationRoute(createHandlerBoundToURL(`${process.env.PUBLIC_URL}/index.html`), {
    denylist: [/^\/api\//, /^\/media\//, /\/[^/?]+\.[^/]+$/],
  })
);

registerRoute(
  ({ url, request }) => request.method === 'GET' && url.pathname.startsWith('/api/public/'),
  new NetworkFirst({
    cacheName: 'public-api',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/media/') && /\.(webp|jpe?g|png|gif)$/i.test(url.pathname),
  new StaleWhileRevalidate({
    cacheName: 'media-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 24 * 60 * 60, purgeOnQuotaError: true }),
    ],
  })
);

registerRoute(
  ({ url }) => url.hostname === 'i.ytimg.com',
  new StaleWhileRevalidate({
    cacheName: 'youtube-thumbnails',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 150, maxAgeSeconds: 14 * 24 * 60 * 60, purgeOnQuotaError: true }),
    ],
  })
);
