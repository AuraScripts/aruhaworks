export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        className="absolute inset-0 bg-blueprint bg-grid opacity-60"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-paper/30 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 md:pt-24">
        <div className="bracket-frame mx-auto max-w-4xl border border-line px-6 py-12 md:px-14 md:py-16">
          <span className="bracket-bl" aria-hidden />
          <span className="bracket-br" aria-hidden />

          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Spec_No. AW-2026 &mdash; QBCore / ESX / Qbox
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold uppercase leading-[0.95] tracking-tightest md:text-7xl">
            Scripts, built
            <br />
            like <span className="text-stroke">blueprints.</span>
          </h1>

          <p className="mt-6 max-w-xl font-body text-base text-dim md:text-lg">
            ARUHA WORKS is a workshop, not a warehouse. Every system is documented,
            version-controlled, and supported after you buy it &mdash; not just before.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#scripts"
              className="border border-paper bg-paper px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-transparent hover:text-paper"
            >
              View Catalog
            </a>
            <a
              href="#docs"
              className="border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-dim transition-colors hover:border-paper hover:text-paper"
            >
              Read the Docs
            </a>
          </div>
        </div>

        <dl className="mx-auto mt-10 grid max-w-4xl grid-cols-3 divide-x divide-line border border-line font-mono text-xs uppercase tracking-widest2 text-dim">
          {[
            ["Frameworks", "3 supported"],
            ["Delivery", "Instant"],
            ["Support", "Direct"],
          ].map(([label, value]) => (
            <div key={label} className="px-4 py-4 text-center">
              <dt>{label}</dt>
              <dd className="mt-1 font-body text-sm normal-case tracking-normal text-paper">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
