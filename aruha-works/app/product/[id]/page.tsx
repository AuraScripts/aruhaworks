import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import ProductActions from "@/components/ProductActions";
import { getPackage, formatPrice, parseFrameworkTags } from "@/lib/tebex";

/**
 * Tebex package descriptions can come through as raw HTML/Markdown
 * (e.g. wrapped in a stray <p> tag with **bold** markers left in). Strip
 * the HTML tags and convert basic **bold** markers to <strong> so it
 * renders cleanly instead of showing the literal tags/asterisks.
 */
function renderDescription(raw: string) {
  const withoutTags = raw.replace(/<\/?[^>]+(>|$)/g, "");
  const withBold = withoutTags.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );
  return { __html: withBold.trim() };
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

  return (
    <main>
      <AnnouncementBar />
      <Header />

      <section className="mx-auto max-w-[1600px] px-6 py-12">
        <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
          Home / {pkg.category?.name ?? "Scripts"} / {pkg.name}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="bracket-frame border border-line bg-raised">
            <span className="bracket-bl" aria-hidden />
            <span className="bracket-br" aria-hidden />
            <div className="relative aspect-[16/9] w-full bg-ink">
              {pkg.image ? (
                <Image src={pkg.image} alt={pkg.name} fill className="object-cover" sizes="50vw" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-mono text-xs text-dim">
                  NO_PREVIEW
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
              {pkg.category?.name ?? "Scripts"}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold uppercase tracking-tightest md:text-5xl">
              {pkg.name}
            </h1>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest2 text-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <p
              className="mt-6 max-w-lg text-base leading-relaxed text-dim"
              dangerouslySetInnerHTML={renderDescription(pkg.description)}
            />

            <div className="mt-8 border border-line bg-raised p-6">
              <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
                {pkg.type === "subscription" ? "Membership" : "One-Time"}
              </p>
              <p className="mt-2 font-display text-4xl font-semibold">
                {formatPrice(pkg.total_price, pkg.currency)}
                {pkg.type === "subscription" && (
                  <span className="text-base font-normal text-dim">/mo</span>
                )}
              </p>

              <div className="mt-6">
                <ProductActions packageId={pkg.id} />
              </div>

              <ul className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-widest2 text-dim">
                <li>⚡ Instant delivery after purchase</li>
                <li>⚙ Support &amp; lifetime updates</li>
              </ul>
            </div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest2 text-dim">
              SKU {pkg.id} &nbsp;·&nbsp; Category {pkg.category?.name ?? "—"}
            </p>

            <Link
              href="/scripts"
              className="mt-8 inline-block font-mono text-xs uppercase tracking-widest2 text-dim hover:text-paper"
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
