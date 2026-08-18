"use client";

import { useState } from "react";

const MESSAGE = "PREMIUM FIVEM SCRIPTS — INSTANT DELIVERY — LIFETIME UPDATES";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const items = Array(8).fill(MESSAGE);

  return (
    <div className="relative overflow-hidden border-b border-line bg-raised py-2">
      <div className="flex w-max gap-10 marquee-track font-mono text-[11px] uppercase tracking-widest2 text-dim">
        {[...items, ...items].map((msg, i) => (
          <span key={i} className="flex items-center gap-3 whitespace-nowrap">
            <span className="h-1 w-1 rotate-45 bg-dim" />
            {msg}
          </span>
        ))}
      </div>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-raised px-2 font-mono text-xs text-dim hover:text-paper"
      >
        ×
      </button>
    </div>
  );
}
