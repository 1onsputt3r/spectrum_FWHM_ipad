const CACHE_NAME = "fwhm-pwa-v1";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
  // 你有外部CDN，但PWA只能緩本地和同網域檔案
];

// 安裝時快取靜態檔
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// 取用時優先緩存
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// 新版時自動清快取
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});
