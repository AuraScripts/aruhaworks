import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import CategoryBrowser from "@/components/CategoryBrowser";
import { getCategories } from "@/lib/tebex";

export const metadata = { title: "Scripts — ARUHA WORKS" };

export default async function ScriptsPage() {
  const categories = await getCategories().catch(() => []);
  const category = categories.find((c) => /script/i.test(c.name)) ?? categories[0];
  const packages = category?.packages ?? [];

  return (
    <main>
      <AnnouncementBar />
      <Header />

      <section className="border-b border-line px-6 py-16">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Home / Scripts
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Category</p>
              <h1 className="mt-2 font-display text-5xl font-semibold uppercase tracking-tightest">
                Scripts
              </h1>
            </div>
            <p className="max-w-md text-sm text-dim">
              Precision-built FiveM scripts, optimized and documented. Trusted
              by servers running QBCore, ESX, and Qbox.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-16">
        <CategoryBrowser packages={packages} />
      </section>

      <Footer />
    </main>
  );
}
