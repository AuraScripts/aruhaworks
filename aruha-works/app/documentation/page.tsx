import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";

export const metadata = { title: "Documentation — ARUHA WORKS" };

export default function DocumentationPage() {
  return (
    <main>
      <AnnouncementBar />
      <Header />

      <section className="mx-auto max-w-3xl px-6 py-20">
        <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Reference</p>
        <h1 className="mt-2 font-display text-4xl font-semibold uppercase tracking-tightest">
          Documentation
        </h1>
        <p className="mt-6 text-dim">
          Setup guides for each script ship inside the download after
          purchase. General install steps:
        </p>
        <ol className="mt-6 space-y-4 border-t border-line pt-6 font-mono text-sm text-dim">
          <li>1. Drop the resource folder into your server's <code>resources</code> directory.</li>
          <li>2. Add <code>ensure your-resource-name</code> to <code>server.cfg</code>.</li>
          <li>3. Run any included SQL file against your database.</li>
          <li>4. Restart the resource and check your server console for errors.</li>
        </ol>
        <p className="mt-8 text-dim">
          Stuck on something specific? Open a ticket in our Discord and
          we'll help you get it running.
        </p>
      </section>

      <Footer />
    </main>
  );
}
