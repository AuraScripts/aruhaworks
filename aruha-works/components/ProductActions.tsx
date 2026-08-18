"use client";

import { useCart } from "./CartContext";

export default function ProductActions({ packageId }: { packageId: number }) {
  const { addToCart, buyNow } = useCart();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => addToCart(packageId)}
        className="flex-1 border border-border py-3.5 font-mono text-xs uppercase tracking-widest2 text-muted transition-colors hover:border-text hover:text-text"
      >
        Add to Cart
      </button>
      <button
        onClick={() => buyNow(packageId)}
        className="flex-1 border border-text bg-text py-3.5 font-mono text-xs uppercase tracking-widest2 text-bg transition-colors hover:bg-transparent hover:text-text"
      >
        Buy Now
      </button>
    </div>
  );
}
