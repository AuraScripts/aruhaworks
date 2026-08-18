"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How do I install ARUHA WORKS scripts?",
    a: "Download the script files from your Tebex purchase page, extract them, and upload them to your server's resources folder. Then add the appropriate start commands to your server.cfg and restart your server.",
  },
  {
    q: "Can I use the scripts with ESX, QBCore, or QBox?",
    a: "Yes. Most scripts are built and tested against ESX, QBCore, and QBox. Each product page lists exact compatibility.",
  },
  {
    q: "Do I receive lifetime updates?",
    a: "Yes — every purchase includes free updates for as long as the script is maintained.",
  },
  {
    q: "What payment methods are accepted?",
    a: "Tebex accepts major credit/debit cards, PayPal, and many local payment methods depending on your region.",
  },
  {
    q: "Do you offer customer support?",
    a: "Yes. You can reach us via our Discord server for installation help, configuration questions, and bug reports.",
  },
  {
    q: "Can I customize the scripts?",
    a: "Absolutely. Our scripts are designed to be flexible. Many include config files and documentation so you can adapt them to your server.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-muted">
            Find answers to common questions about our FiveM resources and Tebex checkout.
          </p>
        </div>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-cardHover"
              >
                <span className="font-medium text-text">{item.q}</span>
                <span className="shrink-0 text-muted">
                  {open === i ? "−" : "+"}
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm leading-relaxed text-muted">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
