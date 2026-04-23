const CACHE_NAME = "rogveda-shell-v2";
const NAVIGATION_ROUTES = new Set(["/", "/vendor/login"]);
const CACHEABLE_ASSETS = new Set([
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
]);
const STATIC_DESTINATIONS = new Set(["font", "image"]);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll([...NAVIGATION_ROUTES, ...CACHEABLE_ASSETS]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/booking") ||
    url.pathname.startsWith("/vendor/dashboard")
  ) {
    return;
  }

  if (request.mode === "navigate" && NAVIGATION_ROUTES.has(url.pathname)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (STATIC_DESTINATIONS.has(request.destination) || CACHEABLE_ASSETS.has(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return cache.match(request) ?? Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cachedResponse ?? networkResponsePromise ?? Response.error();
}
