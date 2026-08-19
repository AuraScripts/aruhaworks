import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ProductActions from "@/components/ProductActions";
import { getPackage, formatPrice, parseFrameworkTags } from "@/lib/tebex";

function renderDescription(raw: string) {
  const withoutTags = raw.replace(/<\/?[^>]+(>|$)/g, " ");
  const withBold = withoutTags.replace(/\*\*(.+?)\*\*/g, "<strong class='text-text'>$1</strong>");
  return { __html: withBold.replace(/\s+/g, " ").trim() };
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const pkg = await getPackage(id).catch(() => null);
  if (!pkg) notFound();

  const tags = parseFrameworkTags(pkg);
  const hasDiscount = pkg.discount > 0;

  return (
    <main>
      <AnnouncementBar />
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <nav className="mb-8 text-xs uppercase tracking-wider text-muted">
          <Link href="/" className="hover:text-text">Home</Link>
          <span className="mx-2 opacity-40">/</span>
          <Link href="/scripts" className="hover:text-text">Packages</Link>
          <span className="mx-2 opacity-40">/</span>
          <span className="text-text/70">{pkg.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[16/10] w-full bg-bg">
              {pkg.image ? (
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  priority
                  className="object-contain p-2"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                  No preview
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              {pkg.category?.name ?? "Packages"}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {pkg.name}
            </h1>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span key={t} className="framework-tag">{t}</span>
                ))}
              </div>
            )}

            <div
              className="mt-6 text-[15px] leading-relaxed text-muted"
              dangerouslySetInnerHTML={renderDescription(pkg.description)}
            />

            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                {pkg.type === "subscription" ? "Subscription" : "One-time"}
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight">
                  {formatPrice(pkg.total_price, pkg.currency)}
                </span>
                {hasDiscount && (
                  <span className="rounded bg-sale px-2 py-0.5 text-xs font-bold text-white">
                    -{Math.round(pkg.discount)}%
                  </span>
                )}
              </div>

              <div className="mt-6">
                <ProductActions packageId={pkg.id} />
              </div>

              <ul className="mt-6 space-y-2 text-xs text-muted">
                <li className="flex items-center gap-2">
                  <span className="text-white">⚡</span> Instant delivery after purchase
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-white">∞</span> Support &amp; lifetime updates
                </li>
              </ul>
            </div>

            <p className="mt-6 text-xs text-muted">
              SKU {pkg.id} · Category {pkg.category?.name ?? "—"}
            </p>

            <Link
              href="/scripts"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-text"
            >
              ← Back to catalog
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
