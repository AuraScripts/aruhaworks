"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./CartContext";
import { formatPrice, parseFrameworkTags, type TebexPackage } from "@/lib/tebex";

export default function BestSelling({ packages }: { packages: TebexPackage[] }) {
  const [paused, setPaused] = useState(false);
  const { addToCart, buyNow } = useCart();

  if (packages.length === 0) return null;

  const loop = [...packages, ...packages];

  return (
    <section className="border-b border-line py-16">
      <div className="mx-auto mb-10 flex max-w-[1600px] items-end justify-between gap-4 px-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Catalog_Index
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest md:text-4xl">
            Best-Selling Scripts
          </h2>
          <p className="mt-3 max-w-xl text-sm text-dim">
            The systems most servers reach for first — built for QBCore, ESX,
            and Qbox, with instant delivery and real support after you buy.
          </p>
        </div>
        <Link
          href="/scripts"
          className="hidden shrink-0 border border-line px-5 py-2.5 font-mono text-xs uppercase tracking-widest2 text-dim transition-colors hover:border-paper hover:text-paper sm:block"
        >
          Browse all
        </Link>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex w-max gap-5 px-6"
          style={{
            animation: "marquee 42s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((pkg, i) => {
            const tags = parseFrameworkTags(pkg);
            return (
              <div
                key={`${pkg.id}-${i}`}
                className="group w-[280px] shrink-0 border border-line bg-raised transition-all duration-200 hover:-translate-y-1 hover:border-paper/50"
              >
                <Link href={`/product/${pkg.id}`} className="block">
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-ink">
                    {pkg.image ? (
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                        sizes="280px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-dim">
                        NO_PREVIEW
                      </div>
                    )}
                    {tags.length > 0 && (
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="border border-line bg-ink/80 px-1.5 py-0.5 font-mono text-[9px] text-dim"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link href={`/product/${pkg.id}`}>
                    <h3 className="font-display text-base font-semibold leading-tight hover:text-dim">
                      {pkg.name}
                    </h3>
                  </Link>
                  <p className="mt-2 font-mono text-sm text-paper">
                    {formatPrice(pkg.total_price, pkg.currency)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => addToCart(pkg.id)}
                      className="flex-1 border border-line py-2 font-mono text-[10px] uppercase tracking-widest2 text-dim transition-colors hover:border-paper hover:text-paper"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => buyNow(pkg.id)}
                      className="flex-1 border border-paper bg-paper py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink transition-colors hover:bg-transparent hover:text-paper"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
