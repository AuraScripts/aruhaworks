"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "./icons";

const REVIEWS = [
  {
    text: "Aruha made me a few works already and they look amazing, I really didn't expect them to be that good, but for the price that he made them, they are very great, I reccomend ordering something from him, the job is fast, well fixed and finished with no flaws. Hard work done right.",
    from: "pasiklydez",
    role: "Server Owner",
  },
  {
    text: "Good developer—skilled, knows what he's doing. Great job.",
    from: "Anonymous",
    role: "Fivem Admin",
  },
  {
    text: "High-quality resources, fast support, and a polite person.",
    from: "tripertriper",
    role: "Server Owner",
  },
  {
    text: "High-quality FiveM resources, clean code, and modern design. Everything runs smoothly, is well-optimized, and is user-friendly. It is evident that great attention is paid to detail and quality. I highly recommend Aruha Works—the work is done professionally, and the results speak for themselves. I wish you continued success in expanding your projects and reaching even more people.",
    from: "enolizmas",
    role: "Server Owner",
  },
];

export default function Reviews() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const prev = REVIEWS[(index - 1 + REVIEWS.length) % REVIEWS.length];
  const current = REVIEWS[index];
  const next = REVIEWS[(index + 1) % REVIEWS.length];

  return (
    <section className="border-b border-line py-20">
      <div className="mx-auto max-w-[1600px] px-6">
        <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
          Field_Reports
        </p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold uppercase tracking-tightest md:text-5xl">
          Trusted by real servers
        </h2>
        <p className="mt-4 max-w-xl text-sm text-dim">
          Every review here is from someone who actually installed the thing
          and ran it in production.
        </p>

        <div className="relative mt-14 flex items-center justify-center gap-4">
          <button
            onClick={() => setIndex((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)}
            aria-label="Previous review"
            className="hidden h-10 w-10 shrink-0 items-center justify-center border border-line text-dim transition-colors hover:border-paper hover:text-paper md:flex"
          >
            ←
          </button>

          <div className="hidden max-w-xs shrink-0 flex-col gap-3 border border-line bg-raised p-6 opacity-40 lg:flex">
            <div className="flex gap-1 text-dim">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-3.5 w-3.5" />
              ))}
            </div>
            <p className="line-clamp-3 text-sm text-dim">&ldquo;{prev.text}&rdquo;</p>
          </div>

          <div className="bracket-frame w-full max-w-xl border border-paper/40 bg-raised p-8 md:p-10">
            <span className="bracket-bl" aria-hidden />
            <span className="bracket-br" aria-hidden />
            <div className="flex gap-1 text-paper">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </div>
            <p className="mt-4 font-display text-lg leading-snug md:text-xl">
              &ldquo;{current.text}&rdquo;
            </p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-paper font-mono text-sm">
                {current.from.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-body text-sm font-medium">{current.from}</p>
                <p className="font-mono text-xs text-dim">{current.role}</p>
              </div>
            </div>
          </div>

          <div className="hidden max-w-xs shrink-0 flex-col gap-3 border border-line bg-raised p-6 opacity-40 lg:flex">
            <div className="flex gap-1 text-dim">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="h-3.5 w-3.5" />
              ))}
            </div>
            <p className="line-clamp-3 text-sm text-dim">&ldquo;{next.text}&rdquo;</p>
          </div>

          <button
            onClick={() => setIndex((i) => (i + 1) % REVIEWS.length)}
            aria-label="Next review"
            className="hidden h-10 w-10 shrink-0 items-center justify-center border border-line text-dim transition-colors hover:border-paper hover:text-paper md:flex"
          >
            →
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-1.5 w-6 transition-colors ${i === index ? "bg-paper" : "bg-line"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
