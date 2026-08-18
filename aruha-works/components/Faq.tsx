const FAQS = [
  {
    q: "Can I use ARUHA WORKS scripts with QBCore, ESX, or Qbox?",
    a: "Yes. Most scripts are built and tested against QBCore, ESX, and Qbox. Each product page lists exact compatibility and any requirements.",
  },
  {
    q: "Do I receive lifetime updates after purchasing a script?",
    a: "Yes — every purchase includes free updates for as long as the script is maintained, no separate renewal fee.",
  },
  {
    q: "How do I receive my scripts after purchase?",
    a: "Delivery is instant. After checkout you'll get access through our Discord, plus a download link and setup docs.",
  },
  {
    q: "Do you offer installation support?",
    a: "Yes. Open a ticket in Discord and we'll help with install issues, conflicts with other resources, and bugs in the script itself.",
  },
  {
    q: "Can I use ARUHA WORKS scripts on multiple servers?",
    a: "Licenses are per-server by default. If you're running multiple communities, message us before buying and we'll sort out a multi-server license.",
  },
  {
    q: "Why choose ARUHA WORKS?",
    a: "Documented code, real support from the people who wrote it, and updates that don't break your server on a random Tuesday.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="border-b border-line py-20">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Reference
          </p>
          <h2 className="mt-2 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tightest md:text-5xl">
            Frequently
            <br />
            Asked Questions
          </h2>
          <p className="mt-6 max-w-sm text-sm text-dim">
            Find answers to the most common questions about ARUHA WORKS,
            including compatibility, updates, support, and installation.
          </p>
        </div>

        <div className="divide-y divide-line border-t border-line">
          {FAQS.map((item, i) => (
            <details key={item.q} className="group py-6" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                <span className="flex gap-4">
                  <span className="font-mono text-xs text-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-lg font-medium text-paper">
                    {item.q}
                  </span>
                </span>
                <span className="mt-1 shrink-0 font-mono text-lg text-dim transition-transform group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <p className="mt-3 max-w-2xl pl-9 text-sm text-dim">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
