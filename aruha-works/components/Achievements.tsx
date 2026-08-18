const STATS = [
  { value: "10K+", label: "Sales" },
  { value: "50K+", label: "Active Players" },
  { value: "2K+", label: "Active Servers" },
];

export default function Achievements() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Our Achievements
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
          Trusted by servers worldwide for quality FiveM resources.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card px-6 py-10 shadow-card"
            >
              <p className="font-display text-4xl font-bold tracking-tight text-accent sm:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
