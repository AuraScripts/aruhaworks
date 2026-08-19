import { notFound } from "next/navigation";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import CategoryBrowser from "@/components/CategoryBrowser";
import { getCategories } from "@/lib/tebex";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const categories = await getCategories().catch(() => []);
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  return (
    <main>
      <AnnouncementBar />
      <Header />

      <section className="border-b border-line px-6 py-16">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Home / {category.name}
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold uppercase tracking-tightest">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-xl text-sm text-dim">{category.description}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-16">
        <CategoryBrowser packages={category.packages ?? []} />
      </section>

      <Footer />
    </main>
  );
}
