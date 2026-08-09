import type { TebexCategory } from "@/lib/tebex";
import ProductCard from "./ProductCard";

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ProductGrid({ categories }: { categories: TebexCategory[] }) {
  const populated = categories.filter((c) => (c.packages?.length ?? 0) > 0);

  if (populated.length === 0) {
    return (
      <section id="scripts" className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="font-mono text-sm uppercase tracking-widest2 text-dim">
          No packages found &mdash; check NEXT_PUBLIC_TEBEX_TOKEN and that your
          categories have packages assigned in the Tebex dashboard.
        </p>
      </section>
    );
  }

  return (
    <>
      {populated.map((category, i) => (
        <section
          key={category.id}
          id={i === 0 ? "scripts" : slugify(category.name)}
          className="mx-auto max-w-7xl scroll-mt-20 border-b border-line px-6 py-16"
        >
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
                Category_{String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest">
                {category.name}
              </h2>
            </div>
            <span className="font-mono text-xs text-dim">
              {category.packages?.length} item{category.packages?.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.packages!.map((pkg, idx) => (
              <ProductCard key={pkg.id} pkg={pkg} index={idx} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
