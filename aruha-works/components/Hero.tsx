import Image from "next/image";

const KEYWORDS = [
  "ARUHA WORKS",
  "FIVEM SCRIPTS",
  "PREMIUM FIVEM SCRIPTS",
  "QBCORE SCRIPTS",
  "ESX SCRIPTS",
  "QBOX SCRIPTS",
  "FIVEM RESOURCES",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="relative grid min-h-[640px] grid-cols-1 md:grid-cols-2">
        <div className="relative z-10 flex flex-col justify-center px-6 py-16 md:py-0 md:pl-10 md:pr-6">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/95 to-transparent md:hidden" />

          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Spec_No. AW-2026 &mdash; QBCore / ESX / Qbox
          </p>

          <h1 className="mt-6 font-display text-5xl font-semibold uppercase leading-[0.95] tracking-tightest md:text-6xl lg:text-7xl">
            Build your
            <br />
            dream FiveM
            <br />
            server with
            <br />
            <span className="text-stroke">Aruha Works</span>
          </h1>

          <p className="mt-6 max-w-md text-base text-dim">
            Precision-built FiveM scripts with instant delivery, lifetime
            updates, and support that actually answers. Fully optimized for
            QBCore, ESX, Qbox, and more.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#scripts"
              className="border border-paper bg-paper px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink transition-colors hover:bg-transparent hover:text-paper"
            >
              Discover Our Scripts →
            </a>
            <a
              href="https://discord.gg/tT4u7Bbn9q"
              target="_blank"
              rel="noreferrer"
              className="border border-line px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-dim transition-colors hover:border-paper hover:text-paper"
            >
              Join Our Discord
            </a>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest2 text-dim">
            ◆ Trusted by servers running QBCore, ESX &amp; Qbox
          </p>
        </div>

        <div className="relative min-h-[320px] md:min-h-0">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/40 to-transparent md:from-ink/20" />
          <div className="absolute inset-y-0 left-0 hidden w-px bg-paper/40 md:block" />
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-line py-3">
        <div className="flex w-max gap-8 marquee-track font-mono text-[11px] uppercase tracking-widest2 text-dim">
          {[...KEYWORDS, ...KEYWORDS].map((kw, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap">
              <span className="h-1 w-1 rotate-45 bg-dim" />
              {kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
