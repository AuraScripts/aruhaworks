import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BestSelling from "@/components/BestSelling";
import Showcase from "@/components/Showcase";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CheckoutLauncher from "@/components/CheckoutLauncher";
import { getCategories, type TebexCategory, type TebexPackage } from "@/lib/tebex";

export default async function Home() {
  let categories: TebexCategory[] = [];
  let loadError = false;

  try {
    categories = await getCategories();
  } catch (err) {
    console.error(err);
    loadError = true;
  }

  const allPackages: TebexPackage[] = categories.flatMap((c) => c.packages ?? []);

  return (
    <main>
      <CheckoutLauncher />
      <AnnouncementBar />
      <Header />
      <Hero />

      {loadError ? (
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="font-mono text-sm uppercase tracking-widest2 text-dim">
            Couldn&apos;t load the catalog from Tebex. Check that
            NEXT_PUBLIC_TEBEX_TOKEN is set and valid, then reload.
          </p>
        </section>
      ) : (
        <>
          <BestSelling packages={allPackages.slice(0, 8)} />
          <Showcase packages={allPackages.slice(0, 5)} />
        </>
      )}

      <Reviews />
      <Faq />
      <Footer />
    </main>
  );
}
