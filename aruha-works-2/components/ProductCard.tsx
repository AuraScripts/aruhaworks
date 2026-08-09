import Image from "next/image";
import { formatPrice, type TebexPackage } from "@/lib/tebex";
import BuyButton from "./BuyButton";

export default function ProductCard({
  pkg,
  index,
}: {
  pkg: TebexPackage;
  index: number;
}) {
  const code = `AW_${String(index + 1).padStart(3, "0")}`;

  return (
    <article className="bracket-frame group flex flex-col border border-line bg-raised transition-colors hover:border-paper/40">
      <span className="bracket-bl" aria-hidden />
      <span className="bracket-br" aria-hidden />

      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-ink">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.name}
            fill
            className="object-cover opacity-90 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-dim">
            NO_PREVIEW
          </div>
        )}
        <span className="absolute left-3 top-3 border border-line bg-ink/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest2 text-dim">
          {code}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {pkg.name}
          </h3>
          <span className="whitespace-nowrap font-mono text-sm text-paper">
            {formatPrice(pkg.total_price, pkg.currency)}
          </span>
        </div>

        <p className="line-clamp-3 flex-1 text-sm text-dim">{pkg.description}</p>

        <BuyButton
          packageId={pkg.id}
          className="mt-2 w-full border border-paper py-2.5 font-mono text-xs uppercase tracking-widest2 text-paper transition-colors hover:bg-paper hover:text-ink disabled:opacity-50"
        >
          Buy Now
        </BuyButton>
      </div>
    </article>
  );
}
