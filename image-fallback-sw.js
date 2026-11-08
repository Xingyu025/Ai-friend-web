/* 纯静态站点的四张可选插图：缺失时返回透明图；不缓存、不接管其他资源。 */
'use strict';
const illustrationNames = new Set(['01-night.webp', '02-windows.webp', '03-dawn.webp', '04-together.webp']);
const scope = new URL(self.registration.scope);
const transparent = () => new Response('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>', {
  headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' }
});
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== scope.origin ||
      !illustrationNames.has(url.pathname.slice((scope.pathname + 'img/').length)) ||
      !url.pathname.startsWith(scope.pathname + 'img/')) return;
  event.respondWith(fetch(event.request, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) return transparent();
      const headers = new Headers(response.headers); headers.set('Cache-Control', 'no-store');
      return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
    }).catch(transparent));
});
