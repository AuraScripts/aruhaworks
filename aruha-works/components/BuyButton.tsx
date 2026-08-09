"use client";

import { useState } from "react";

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

let checkoutScriptPromise: Promise<void> | null = null;

function loadCheckoutScript(): Promise<void> {
  if (window.Tebex) return Promise.resolve();
  if (checkoutScriptPromise) return checkoutScriptPromise;

  checkoutScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.tebex.io/v/1.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Tebex checkout"));
    document.head.appendChild(script);
  });

  return checkoutScriptPromise;
}

export default function BuyButton({
  packageId,
  className,
  children,
}: {
  packageId: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const res = await fetch("/api/basket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "basket creation failed");
      const { ident } = data;

      await loadCheckoutScript();
      window.Tebex?.checkout.init({ ident, popup: true });
      window.Tebex?.checkout.launch();
      setStatus("idle");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <button onClick={handleClick} disabled={status === "loading"} className={className}>
      {status === "loading" ? "Loading…" : status === "error" ? "Try again" : children}
    </button>
  );
}
