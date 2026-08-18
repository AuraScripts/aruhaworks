import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* subtle background gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(59,130,246,0.18), transparent), radial-gradient(ellipse 50% 40% at 80% 50%, rgba(99,102,241,0.08), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted">
          <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success" />
          Premium FiveM Resources
        </p>

        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Take your server beyond limits with{" "}
          <span className="gradient-text">ARUHA WORKS</span> Resources
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg">
          Carefully crafted resources focused on performance, stability, and
          seamless server integration. Built for ESX, QBCore &amp; QBox.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/scripts"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-accentHover"
          >
            Browse Scripts
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <a
            href="https://discord.gg/tT4u7Bbn9q"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-text transition hover:border-borderBright hover:bg-cardHover"
          >
            Join Discord
          </a>
        </div>

        {/* mini trust row */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Instant Delivery
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Lifetime Updates
          </span>
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ESX · QBCore · QBox
          </span>
        </div>
      </div>
    </section>
  );
}
