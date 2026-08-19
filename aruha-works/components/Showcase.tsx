"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice, type TebexPackage } from "@/lib/tebex";

export default function Showcase({ packages }: { packages: TebexPackage[] }) {
  const [active, setActive] = useState(0);
  if (packages.length === 0) return null;

  const featured = packages[active];
  const others = packages.filter((_, i) => i !== active).slice(0, 2);

  return (
    <section className="relative overflow-hidden border-b border-border py-16">
      <div
        className="absolute inset-0 bg-blueprint bg-grid opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1600px] px-6">
        <p className="font-mono text-xs uppercase tracking-widest2 text-muted">
          The_Latest_Batch
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest md:text-4xl">
          New &amp; Featured
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <div className=" border border-border bg-card">
            <span className="bracket-bl" aria-hidden />
            <span className="bracket-br" aria-hidden />
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-border bg-bg">
              {featured.image ? (
                <Image
                  key={featured.id}
                  src={featured.image}
                  alt={featured.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
                  NO_PREVIEW
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold">{featured.name}</h3>
              <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-muted">
                {featured.description}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <span className="font-mono text-sm text-text">
                  {formatPrice(featured.total_price, featured.currency)}
                </span>
                <Link
                  href={`/product/${featured.id}`}
                  className="border border-text px-4 py-2 font-mono text-xs uppercase tracking-widest2 hover:bg-text hover:text-bg"
                >
                  View script
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 lg:flex-col">
            {others.map((pkg) => {
              const idx = packages.findIndex((p) => p.id === pkg.id);
              return (
                <button
                  key={pkg.id}
                  onClick={() => setActive(idx)}
                  className="group relative flex-1 overflow-hidden border border-border bg-card text-left transition-colors hover:border-text/50"
                >
                  <div className="relative aspect-[16/10] w-full">
                    {pkg.image ? (
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover opacity-70 transition-opacity group-hover:opacity-100"
                        sizes="300px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-mono text-xs text-muted">
                        NO_PREVIEW
                      </div>
                    )}
                  </div>
                  <p className="p-3 font-display text-sm font-medium">{pkg.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
