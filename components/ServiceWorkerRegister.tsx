"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* échec silencieux — l'app fonctionne quand même sans service worker */
      });
    }
  }, []);

  return null;
}
