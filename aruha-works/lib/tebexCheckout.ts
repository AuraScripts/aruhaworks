"use client";

declare global {
  interface Window {
    Tebex?: {
      checkout: {
        init: (opts: { ident: string; popup?: boolean }) => void;
        launch: () => void;
        on: (event: string, cb: (...args: unknown[]) => void) => void;
      };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTebexCheckoutScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Tebex) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.tebex.io/v/1.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Tebex checkout"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Opens Tebex's official embedded checkout overlay (cross-sells, creator
 * code, coupon field, totals — all rendered by Tebex, same as the modal
 * shown on other Tebex-powered stores) for an already-authorized,
 * already-populated basket.
 */
export async function launchTebexCheckout(ident: string) {
  await loadTebexCheckoutScript();
  window.Tebex?.checkout.init({ ident, popup: true });
  window.Tebex?.checkout.launch();
}
