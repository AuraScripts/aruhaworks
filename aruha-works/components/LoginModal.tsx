"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** After login, continue with this package in cart or buy mode */
  packageId: number | null;
  mode: "cart" | "buy";
};

export default function LoginModal({ open, onClose, packageId, mode }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open || packageId == null) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      setAuthUrl(null);
      try {
        // Always create a fresh basket for login (avoids "Basket not found")
        const createRes = await fetch("/api/basket/create", { method: "POST" });
        const createData = await createRes.json();
        if (!createRes.ok) throw new Error(createData.error || "Could not create basket");

        const ident = createData.ident as string;
        localStorage.setItem("aruha_basket_ident", ident);

        const returnUrl = `${window.location.origin}/checkout/continue?ident=${encodeURIComponent(
          ident
        )}&packageId=${packageId}&mode=${mode}`;

        const authRes = await fetch(
          `/api/basket/auth?ident=${encodeURIComponent(ident)}&returnUrl=${encodeURIComponent(
            returnUrl
          )}`
        );
        const authData = await authRes.json();
        if (!authRes.ok) throw new Error(authData.error || "Could not get login link");

        const links = authData.links as { name: string; url: string }[];
        const fivem =
          links?.find((l) => /fivem|cfx/i.test(l.name)) || links?.[0];

        if (!fivem?.url) {
          throw new Error("No FiveM login available for this store.");
        }
        if (!cancelled) setAuthUrl(fivem.url);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Login failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, packageId, mode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-text"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-6 flex items-center justify-center gap-3 text-sm text-muted">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
            AW
          </span>
          <span>×</span>
          <span className="font-semibold text-text">Cfx.re</span>
        </div>

        <h2 className="text-center text-xl font-bold tracking-wide">PLEASE LOG IN</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Enter your credentials to continue
        </p>

        {error && (
          <p className="mt-4 rounded-lg border border-sale/40 bg-sale/10 px-3 py-2 text-center text-sm text-sale">
            {error}
          </p>
        )}

        <div className="mt-8">
          {loading ? (
            <button
              disabled
              className="w-full rounded-xl bg-white/10 py-3.5 text-sm font-semibold text-muted"
            >
              Preparing login…
            </button>
          ) : authUrl ? (
            <a
              href={authUrl}
              className="block w-full rounded-xl bg-white py-3.5 text-center text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Login via FiveM
            </a>
          ) : (
            <button
              disabled
              className="w-full rounded-xl bg-white/10 py-3.5 text-sm font-semibold text-muted"
            >
              Login unavailable
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Secure login powered by your game server
        </p>
      </div>
    </div>
  );
}
