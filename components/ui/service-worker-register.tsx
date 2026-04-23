"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) {
      return;
    }

    const isLocalhost =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister())),
        )
        .catch(() => {});

      if ("caches" in window) {
        void caches
          .keys()
          .then((cacheKeys) =>
            Promise.all(
              cacheKeys
                .filter((cacheKey) => cacheKey.startsWith("rogveda-shell-"))
                .map((cacheKey) => caches.delete(cacheKey)),
            ),
          )
          .catch(() => {});
      }

      return;
    }

    const registerServiceWorker = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
    };

    if (document.readyState === "complete") {
      registerServiceWorker();
      return;
    }

    window.addEventListener("load", registerServiceWorker, { once: true });
    return () => window.removeEventListener("load", registerServiceWorker);
  }, []);

  return null;
}
