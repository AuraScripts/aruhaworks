"use client";

import { useState } from "react";

export default function BuyButton({
  packageId,
  className,
  children,
}: {
  packageId: number;
  className?: string;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    setStatus("loading");
    setErrorMsg(null);
    try {
      // 1. Create an empty basket.
      const createRes = await fetch("/api/basket/create", { method: "POST" });
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error || "Could not start checkout");
      const { ident } = createData;

      // 2. Where the customer should land after (optionally) logging in.
      const returnUrl = `${window.location.origin}/checkout/continue?ident=${encodeURIComponent(
        ident
      )}&packageId=${packageId}`;

      // 3. Check whether this store requires login (e.g. FiveM) before checkout.
      const authRes = await fetch(
        `/api/basket/auth?ident=${encodeURIComponent(ident)}&returnUrl=${encodeURIComponent(
          returnUrl
        )}`
      );
      const authData = await authRes.json();
      if (!authRes.ok) throw new Error(authData.error || "Could not start checkout");

      if (authData.links && authData.links.length > 0) {
        // Store requires login — send the customer to Tebex's hosted login
        // (e.g. FiveM/CFX). They'll be sent back to /checkout/continue after.
        window.location.href = authData.links[0].url;
        return;
      }

      // No login required — add the package and go straight to checkout.
      const finalizeRes = await fetch("/api/basket/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ident, packageId }),
      });
      const finalizeData = await finalizeRes.json();
      if (!finalizeRes.ok) throw new Error(finalizeData.error || "Could not add item");

      window.location.href = finalizeData.checkoutUrl;
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div>
      <button onClick={handleClick} disabled={status === "loading"} className={className}>
        {status === "loading" ? "Loading…" : status === "error" ? "Try again" : children}
      </button>
      {status === "error" && errorMsg && (
        <p className="mt-2 font-mono text-[11px] text-dim">{errorMsg}</p>
      )}
    </div>
  );
}
