"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import type { TebexPackage } from "@/lib/tebex";

export default function BestSelling({ packages }: { packages: TebexPackage[] }) {
  if (packages.length === 0) return null;

  return (
    <section id="scripts" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Top-Selling Products</h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                Carefully crafted resources focused on performance, stability, and seamless server integration.
              </p>
            </div>
            <Link
              href="/scripts"
              className="shrink-0 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition hover:border-borderBright hover:bg-cardHover"
            >
              View All Packages →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {packages.slice(0, 8).map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 60}>
              <ProductCard pkg={pkg} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
