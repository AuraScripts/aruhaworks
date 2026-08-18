"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice, parseFrameworkTags, type TebexPackage } from "@/lib/tebex";
import { useCart } from "./CartContext";

export default function ProductCard({ pkg }: { pkg: TebexPackage; index?: number }) {
  const { addToCart, loading } = useCart();
  const [busy, setBusy] = useState(false);
  const tags = parseFrameworkTags(pkg);
  const hasDiscount = pkg.discount > 0;

  async function handleAdd() {
    if (busy || loading) return;
    setBusy(true);
    try {
      await addToCart(pkg.id);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not add to cart. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card-hover group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <Link href={`/product/${pkg.id}`} className="block">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg">
          {pkg.image ? (
            <Image
              src={pkg.image}
              alt={pkg.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted">No preview</div>
          )}
          {hasDiscount && (
            <span className="sale-badge absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-bold text-white">
              -{Math.round(pkg.discount)}%
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span key={t} className="framework-tag">{t}</span>
            ))}
          </div>
        )}

        <Link href={`/product/${pkg.id}`}>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-text transition group-hover:text-white">
            {pkg.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-text">
              {formatPrice(pkg.total_price, pkg.currency)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted line-through">
                {formatPrice(pkg.base_price / (1 - pkg.discount / 100), pkg.currency)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={busy || loading}
            className="rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
          >
            {busy ? "Adding…" : "Add to Basket"}
          </button>
        </div>
      </div>
    </article>
  );
}
