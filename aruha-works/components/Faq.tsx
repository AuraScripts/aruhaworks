const FAQS = [
  {
    q: "Which frameworks are supported?",
    a: "Every script on ARUHA WORKS is built and tested against QBCore, ESX, and Qbox. The product page for each script lists exact compatibility.",
  },
  {
    q: "How do I receive my script after buying?",
    a: "Delivery is instant. After checkout you'll get access through our Discord via a keyed role, plus a download link and setup docs.",
  },
  {
    q: "Do updates cost extra?",
    a: "No. Every purchase includes free updates for as long as the script is maintained — no separate renewal fee.",
  },
  {
    q: "Can I use a script on more than one server?",
    a: "Licenses are per-server by default. If you're running multiple communities, message us before buying and we'll sort out a multi-server license.",
  },
  {
    q: "What if something breaks after install?",
    a: "Open a ticket in Discord. Support covers install issues, conflicts with other resources, and bugs in the script itself.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-4xl border-b border-line px-6 py-20">
      <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
        Reference
      </p>
      <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-tightest">
        Frequently Asked
      </h2>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-medium">
              {item.q}
              <span className="font-mono text-lg text-dim transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm text-dim">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
