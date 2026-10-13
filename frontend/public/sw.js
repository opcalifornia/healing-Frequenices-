/* Rooted service worker (hand-written, no build step).
 *
 * - App shell (index.html) is precached on install.
 * - Navigations: network-first, falling back to the cached shell (SPA offline).
 * - Same-origin static assets (/assets/*, /icons/*, /audio/*, fonts, images):
 *   cache-first in a versioned cache.
 * - Never cached: anything under /api/, any other origin, non-GET requests.
 *   Health and account data must never sit in the SW cache.
 *
 * Bump VERSION to invalidate every cache on the next activate.
 */
const VERSION = "v1";
const SHELL_CACHE = `rooted-shell-${VERSION}`;
const ASSET_CACHE = `rooted-assets-${VERSION}`;
const SHELL_URL = "/index.html";
const PRECACHE = [SHELL_URL, "/manifest.webmanifest", "/icons/rooted-192.png", "/icons/rooted.svg"];

const STATIC_EXT = /\.(?:js|mjs|css|woff2?|ttf|otf|png|jpe?g|gif|webp|avif|svg|ico|mp3|m4a|ogg|opus|wav|webmanifest)$/i;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      // cache: "reload" bypasses the HTTP cache so we store a fresh shell.
      cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" }))),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL_CACHE, ASSET_CACHE]);
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.startsWith("rooted-") && !keep.has(n)).map((n) => caches.delete(n)));
      // Remove caches left by the old vite-plugin-pwa / Workbox setup.
      await Promise.all(names.filter((n) => n.startsWith("workbox-") || n === "catalog").map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function isApi(url) {
  return url.pathname === "/api" || url.pathname.startsWith("/api/");
}

function isStaticAsset(url) {
  if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/audio/") || url.pathname.startsWith("/icons/")) return true;
  return STATIC_EXT.test(url.pathname);
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Different origin (incl. a separate API host) or API path: straight to network, never cached.
  if (url.origin !== self.location.origin || isApi(url)) return;
  // Range requests (audio seeking) are passed through; caching partial responses breaks playback.
  if (req.headers.has("range")) return;

  if (req.mode === "navigate") {
    event.respondWith(networkFirstShell(req));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req));
  }
});

async function networkFirstShell(req) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const res = await fetch(req);
    // Every SPA route serves the same index.html, so keep the shell fresh.
    if (res.ok && (res.headers.get("content-type") || "").includes("text/html")) {
      cache.put(SHELL_URL, res.clone());
    }
    return res;
  } catch (err) {
    const cached = await cache.match(SHELL_URL);
    if (cached) return cached;
    throw err;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(req);
  if (cached) return cached;
  const res = await fetch(req);
  // Only store complete, same-origin, successful responses.
  if (res.ok && res.status === 200 && res.type === "basic") {
    cache.put(req, res.clone());
  }
  return res;
}
