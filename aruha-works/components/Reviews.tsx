"use client";

import Reveal from "./Reveal";

const REVIEWS = [
  {
    text: "Aruha made me a few works already and they look amazing. For the price they are very great. Hard work done right.",
    from: "pasiklydez",
    role: "Server Owner",
  },
  {
    text: "High-quality resources, clean code, and modern design. Everything runs smoothly and is well-optimized.",
    from: "enolizmas",
    role: "Server Owner",
  },
  {
    text: "Good developer—skilled, knows what he's doing. Great job and fast support.",
    from: "Anonymous",
    role: "FiveM Admin",
  },
  {
    text: "High-quality FiveM resources and a polite person. I highly recommend Aruha Works.",
    from: "tripertriper",
    role: "Server Owner",
  },
];

export default function Reviews() {
  return (
    <section className="border-b border-border py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Customer Reviews</h2>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex gap-0.5 text-white">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-2xl font-bold">4.8</span>
              <span className="text-muted">Based on real feedback</span>
            </div>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
              Real feedback from our community after installing and using our FiveM resources.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.from} delay={i * 70}>
              <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="mb-3 flex gap-0.5 text-white">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                    {r.from.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{r.from}</p>
                    <p className="text-xs text-muted">{r.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
