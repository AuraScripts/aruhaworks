import Link from "next/link";
import { GITBOOK_URL } from "@/lib/config";

const FEATURES = [
  {
    title: "Support & Community",
    body: "We're all about support. Join our friendly community for help, tips, and a warm welcome. Count on us for personalized assistance.",
    cta: "Join our Discord",
    href: "https://discord.gg/tT4u7Bbn9q",
  },
  {
    title: "Quality & Performance",
    body: "Quality and performance drive everything we do. We're dedicated to continuous improvement, guaranteeing top-notch experiences.",
    cta: "Read our Docs",
    href: GITBOOK_URL,
  },
  {
    title: "Easy to Use",
    body: "Our products are designed for ease of use. Comprehensive guides ensure smooth installation. Need assistance? We've got your back.",
    cta: "View Scripts",
    href: "/scripts",
  },
  {
    title: "Tebex Security",
    body: "Our products are encrypted by Cfx.re and undergo additional ownership validation via Tebex, ensuring your utmost security.",
    cta: null,
    href: null,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            We deliver optimized, reliable solutions that integrate smoothly and perform consistently on your server.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
              {f.cta && f.href && (
                <Link
                  href={f.href}
                  className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
                  {...(f.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {f.cta} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
