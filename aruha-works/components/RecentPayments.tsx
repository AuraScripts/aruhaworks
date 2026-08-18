"use client";

import Reveal from "./Reveal";

/**
 * Recent payments feed.
 * Tebex Headless API does NOT expose a public recent-payments endpoint.
 * Options for real data:
 *  1. Tebex Payment Completed webhooks → store in your DB → fetch here
 *  2. Keep static/demo list (current)
 * Until you wire webhooks, this is demo data that looks live.
 */
const PAYMENTS = [
  { user: "bepeterh", time: "Today 21:12", amount: "€24.00" },
  { user: "Officer_Rogue", time: "Today 21:12", amount: "€18.99" },
  { user: "pronews", time: "Today 21:03", amount: "€17.00" },
  { user: "dopu_090", time: "Today 20:56", amount: "€4.20" },
  { user: "Bulldog90", time: "Today 20:12", amount: "€137.16" },
  { user: "xNightOwl", time: "Today 19:48", amount: "€42.00" },
];

export default function RecentPayments() {
  return (
    <section className="border-b border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Recent Payments</h2>
            <p className="mt-1 text-sm text-muted">Trusted by customers worldwide.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="divide-y divide-border">
              {PAYMENTS.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition hover:bg-cardHover"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                      {p.user.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-medium text-text">{p.user}</p>
                      <p className="text-xs text-muted">{p.time}</p>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-white">{p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
