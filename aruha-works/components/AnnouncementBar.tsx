"use client";

import { useEffect, useState } from "react";

// Hardcoded sale for demo — replace with real dates / API later
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
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hrs, mins, secs, ended: diff <= 0 };
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
    <div className="relative z-50 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-2.5 text-sm sm:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="font-semibold tracking-wide">
            Summer Discount — {DISCOUNT} off everything
          </span>
          <span className="hidden text-white/80 sm:inline">·</span>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 rounded bg-white/15 px-2.5 py-0.5 font-mono text-xs font-medium backdrop-blur transition hover:bg-white/25"
          >
            Code: <span className="font-bold tracking-wider">{CODE}</span>
            {copied ? " ✓" : ""}
          </button>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs tabular-nums">
          <TimeUnit value={days} label="Days" />
          <TimeUnit value={hrs} label="Hrs" />
          <TimeUnit value={mins} label="Mins" />
          <TimeUnit value={secs} label="Secs" />
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className="text-base font-bold">{String(value).padStart(2, "0")}</span>
      <span className="mt-0.5 text-[10px] uppercase tracking-wider text-white/70">
        {label}
      </span>
    </div>
  );
}
