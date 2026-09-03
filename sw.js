const CACHE_NAME = 'vku-survey-shell-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// 1. Cài đặt và lưu trữ App Shell vào Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Kích hoạt và dọn dẹp cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Chiến lược Cache-First: Phục vụ tài nguyên từ cache để khởi động dưới 1 giây
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});