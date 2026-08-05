const SW_VERSION = "inspiraarte-sw-v1";
const STATIC_CACHE = `${SW_VERSION}-static`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;

const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/dam/logos/favicon-100.png",
  "/dam/logos/favicon-200.png",
  "/dam/logos/hero.webp",
  "/dam/dafault-image-product.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
	caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
	caches
	  .keys()
	  .then((keys) =>
		Promise.all(
		  keys
			.filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
			.map((key) => caches.delete(key)),
		),
	  )
	  .then(() => self.clients.claim()),
  );
});

function isHttpRequest(request) {
  return request.url.startsWith("http");
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
	const networkResponse = await fetch(request);
	cache.put(request, networkResponse.clone());
	return networkResponse;
  } catch {
	const cachedResponse = await cache.match(request);
	if (cachedResponse) {
	  return cachedResponse;
	}

	return new Response("Offline", {
	  status: 503,
	  statusText: "Offline",
	  headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);

  const networkPromise = fetch(request)
	.then((networkResponse) => {
	  cache.put(request, networkResponse.clone());
	  return networkResponse;
	})
	.catch(() => null);

  return cachedResponse || networkPromise || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (!isHttpRequest(request) || isApiRequest(requestUrl)) {
	return;
  }

  if (request.mode === "navigate") {
	event.respondWith(networkFirst(request));
	return;
  }

  if (
	request.destination === "style" ||
	request.destination === "script" ||
	request.destination === "image" ||
	request.destination === "font"
  ) {
	event.respondWith(staleWhileRevalidate(request));
  }
});

