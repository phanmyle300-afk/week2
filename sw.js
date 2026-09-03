const CACHE_NAME = 'vku-survey-v1';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Cài đặt và cache các tài nguyên tĩnh
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Phục vụ dữ liệu từ cache khi ngoại tuyến (Offline-first)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Fallback nếu mất mạng hoàn toàn
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});