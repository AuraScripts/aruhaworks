"use client";

import { useCart } from "./CartContext";

export default function ProductActions({ packageId }: { packageId: number }) {
  const { addToCart, buyNow } = useCart();

  return (
    <div className="flex gap-3">
      <button
        onClick={() => addToCart(packageId)}
        className="flex-1 border border-line py-3.5 font-mono text-xs uppercase tracking-widest2 text-dim transition-colors hover:border-paper hover:text-paper"
      >
        Add to Cart
      </button>
      <button
        onClick={() => buyNow(packageId)}
        className="flex-1 border border-paper bg-paper py-3.5 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-transparent hover:text-paper"
      >
        Buy Now
      </button>
    </div>
  );
}
