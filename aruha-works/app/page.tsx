import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import ProductGrid from "@/components/ProductGrid";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import { getCategories, type TebexCategory } from "@/lib/tebex";

export default async function Home() {
  let categories: TebexCategory[] = [];
  let loadError = false;

  try {
    categories = await getCategories();
  } catch (err) {
    console.error(err);
    loadError = true;
  }

  return (
    <main>
      <Header />
      <Hero />
      <Testimonials />

      {loadError ? (
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="font-mono text-sm uppercase tracking-widest2 text-dim">
            Couldn&apos;t load the catalog from Tebex. Check that
            NEXT_PUBLIC_TEBEX_TOKEN is set and valid, then reload.
          </p>
        </section>
      ) : (
        <ProductGrid categories={categories} />
      )}

      <Faq />
      <Footer />
    </main>
  );
}
