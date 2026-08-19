"use client";

import { useState } from "react";
import { useCart } from "./CartContext";

export default function ProductActions({ packageId }: { packageId: number }) {
  const { addToCart, buyNow, loading } = useCart();
  const [busy, setBusy] = useState<"cart" | "buy" | null>(null);

  async function onCart() {
    if (busy || loading) return;
    setBusy("cart");
    try {
      await addToCart(packageId);
    } finally {
      setBusy(null);
    }
  }

  async function onBuy() {
    if (busy || loading) return;
    setBusy("buy");
    try {
      await buyNow(packageId);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={onCart}
        disabled={!!busy || loading}
        className="flex-1 rounded-xl border border-border py-3.5 text-sm font-semibold uppercase tracking-wide text-text transition hover:border-white hover:bg-cardHover disabled:opacity-50"
      >
        {busy === "cart" ? "Adding…" : "Add to Cart"}
      </button>
      <button
        onClick={onBuy}
        disabled={!!busy || loading}
        className="flex-1 rounded-xl bg-white py-3.5 text-sm font-semibold uppercase tracking-wide text-black transition hover:bg-white/90 disabled:opacity-50"
      >
        {busy === "buy" ? "Please wait…" : "Buy Now"}
      </button>
    </div>
  );
}
