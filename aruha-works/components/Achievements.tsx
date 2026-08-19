import Reveal from "./Reveal";
import CountUp from "./CountUp";

const STATS = [
  { end: 10000, suffix: "+", label: "Sales" },
  { end: 50000, suffix: "+", label: "Active Players" },
  { end: 2000, suffix: "+", label: "Active Servers" },
];

export default function Achievements() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Our Achievements</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
            Trusted by servers worldwide for quality FiveM resources.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="rounded-2xl border border-border bg-card px-6 py-10 shadow-card">
                <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
