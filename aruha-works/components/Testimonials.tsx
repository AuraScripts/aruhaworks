const QUOTES = [
  { text: "Cleanest install docs I've seen for a FiveM script.", from: "server owner, 400+ pop" },
  { text: "Support actually answers instead of pointing at a wiki.", from: "community dev" },
  { text: "Swapped three scripts for one ARUHA system, zero regrets.", from: "roleplay admin" },
  { text: "Every update note is a changelog, not a surprise.", from: "framework maintainer" },
];

export default function Testimonials() {
  const loop = [...QUOTES, ...QUOTES];

  return (
    <section className="overflow-hidden border-b border-line bg-raised py-10">
      <div className="flex w-max gap-0 marquee-track">
        {loop.map((q, i) => (
          <div
            key={i}
            className="flex min-w-[420px] items-center gap-4 border-r border-line px-8"
          >
            <span className="font-mono text-xs text-dim">&ldquo;</span>
            <p className="font-body text-sm text-paper">
              {q.text}{" "}
              <span className="font-mono text-xs uppercase tracking-widest2 text-dim">
                &mdash; {q.from}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
