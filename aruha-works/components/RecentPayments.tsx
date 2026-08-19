"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";

type Payment = { user: string; time: string; amount: string };

export default function RecentPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [source, setSource] = useState<"live" | "demo" | "loading">("loading");

  useEffect(() => {
    fetch("/api/recent-payments")
      .then((r) => r.json())
      .then((data) => {
        setPayments(data.payments || []);
        setSource(data.source === "live" ? "live" : "demo");
      })
      .catch(() => {
        setPayments([]);
        setSource("demo");
      });
  }, []);

  return (
    <section className="border-b border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                Recent Payments
              </h2>
              <p className="mt-1 text-sm text-muted">
                {source === "live"
                  ? "Live purchases from your store."
                  : source === "loading"
                    ? "Loading…"
                    : "Demo data — connect Tebex webhooks + Redis for live feed."}
              </p>
            </div>
            {source === "live" && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-success">
                <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-success" />
                Live
              </span>
            )}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="divide-y divide-border">
              {(payments.length ? payments : []).map((p, i) => (
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
              {source === "loading" && (
                <div className="px-5 py-8 text-center text-sm text-muted">Loading payments…</div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
