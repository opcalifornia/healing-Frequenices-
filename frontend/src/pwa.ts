/**
 * Registers the hand-written service worker (public/sw.js).
 *
 * Skipped when:
 * - running the dev server (only production builds register);
 * - building the single-file artifact (VITE_HASH_ROUTER), which runs inside
 *   claude.ai where a service worker must never register;
 * - the browser has no service worker support;
 * - the page is not served over https or from localhost.
 */
export function shouldRegisterServiceWorker(): boolean {
  if (!import.meta.env.PROD) return false;
  if (import.meta.env.VITE_HASH_ROUTER) return false;
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  if (!("serviceWorker" in navigator)) return false;
  const { protocol, hostname } = window.location;
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  return protocol === "https:" || (protocol === "http:" && isLocalhost);
}

export function registerServiceWorker(): void {
  if (!shouldRegisterServiceWorker()) return;

  const register = () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        // A new worker finished installing while an old one controls the page:
        // let it take over right away so the next navigation gets the new shell.
        const promote = (worker: ServiceWorker | null) => {
          if (worker && navigator.serviceWorker.controller) worker.postMessage({ type: "SKIP_WAITING" });
        };
        promote(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed") promote(worker);
          });
        });
      })
      .catch((err) => {
        console.warn("Service worker registration failed", err);
      });
  };

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
