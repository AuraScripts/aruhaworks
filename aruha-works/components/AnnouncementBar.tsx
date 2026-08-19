"use client";

import { useEffect, useState } from "react";

const SALE_END = new Date("2026-08-25T23:59:59Z").getTime();
const CODE = "SUMMER40";
const DISCOUNT = "40%";

function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hrs: Math.floor((diff / 3600000) % 24),
    mins: Math.floor((diff / 60000) % 60),
    secs: Math.floor((diff / 1000) % 60),
    ended: diff <= 0,
  };
}

export default function AnnouncementBar() {
  const { days, hrs, mins, secs, ended } = useCountdown(SALE_END);
  const [copied, setCopied] = useState(false);
  if (ended) return null;

  function copyCode() {
    navigator.clipboard.writeText(CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative z-50 border-b border-border bg-white text-black">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 text-sm sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span className="font-semibold">Summer Discount — {DISCOUNT} off everything</span>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded bg-black px-2.5 py-0.5 font-mono text-xs font-medium text-white transition hover:bg-black/80"
          >
            Code: <span className="font-bold tracking-wider">{CODE}</span>
            {copied ? " ✓" : ""}
          </button>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
          {[
            [days, "Days"],
            [hrs, "Hrs"],
            [mins, "Mins"],
            [secs, "Secs"],
          ].map(([v, l]) => (
            <div key={l as string} className="flex flex-col items-center leading-none">
              <span className="text-base font-bold">{String(v as number).padStart(2, "0")}</span>
              <span className="mt-0.5 text-[10px] uppercase tracking-wider text-black/60">{l as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
