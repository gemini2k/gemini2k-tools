/* 빛의여행(gemini2k) 도구 — 서비스워커
   원칙: 온라인이면 항상 최신(네트워크 우선). 오프라인일 때만 캐시로 폴백.
   - HTML/네비게이션 : network-first → 캐시 → 오프라인 페이지
   - 버전쿼리 자산·vendor·폰트·이미지 : stale-while-revalidate (캐시 우선 + 백그라운드 갱신)
   - 외부(광고·애널리틱스 등 타 출처) : 가로채지 않음
   캐시 staleness 재발 방지를 위해 페이지는 절대 캐시를 먼저 주지 않는다. */
var VERSION = 'g2k-pwa-v1';
var CORE = 'core-' + VERSION;
var RUNTIME = 'rt-' + VERSION;
var OFFLINE_URL = '/offline.html';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CORE).then(function (c) { return c.addAll([OFFLINE_URL, '/favicon.svg']); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CORE && k !== RUNTIME) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;           // 외부 출처는 손대지 않음(광고·GA 등)

  var isPage = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isPage) {
    // 페이지: 네트워크 우선 → (실패시) 캐시 → 오프라인 페이지
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match(OFFLINE_URL); });
      })
    );
    return;
  }

  // 정적 자산: 캐시 우선 + 백그라운드 갱신(stale-while-revalidate)
  e.respondWith(
    caches.match(req).then(function (cached) {
      var network = fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(RUNTIME).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
