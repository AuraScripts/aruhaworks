"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import type { TebexPackage } from "@/lib/tebex";

type Sort = "featured" | "price-asc" | "price-desc" | "name";

function BrowserInner({ packages }: { packages: TebexPackage[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    let list = packages;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.total_price - b.total_price);
    if (sort === "price-desc") sorted.sort((a, b) => b.total_price - a.total_price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [packages, query, sort]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search this category…"
          className="w-full border border-border bg-card px-4 py-3 font-mono text-sm text-text placeholder:text-muted focus:border-text focus:outline-none sm:max-w-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="border border-border bg-card px-4 py-3 font-mono text-xs uppercase tracking-widest2 text-muted focus:border-text focus:outline-none"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      <p className="mb-6 font-mono text-xs uppercase tracking-widest2 text-muted">
        {filtered.length} product{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-mono text-sm text-muted">
          No products match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((pkg, i) => (
            <ProductCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      )}
    </>
  );
}

export default function CategoryBrowser({ packages }: { packages: TebexPackage[] }) {
  return (
    <Suspense fallback={null}>
      <BrowserInner packages={packages} />
    </Suspense>
  );
}
