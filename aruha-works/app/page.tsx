import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BestSelling from "@/components/BestSelling";
import RecentPayments from "@/components/RecentPayments";
import Reviews from "@/components/Reviews";
import WhyChooseUs from "@/components/WhyChooseUs";
import Achievements from "@/components/Achievements";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CartReturnHandler from "@/components/CartReturnHandler";
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
      <CartReturnHandler />
      <AnnouncementBar />
      <Header />
      <Hero />

      {loadError ? (
        <section className="mx-auto max-w-2xl px-6 py-24 text-center">
          <p className="text-sm text-muted">
            Couldn&apos;t load the catalog from Tebex. Check that
            NEXT_PUBLIC_TEBEX_TOKEN is set and valid, then reload.
          </p>
        </section>
      ) : (
        <BestSelling packages={allPackages} />
      )}

      <RecentPayments />
      <Reviews />
      <WhyChooseUs />
      <Achievements />
      <Faq />
      <Footer />
    </main>
  );
}
