"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ContinueContent() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ident = params.get("ident");
    const packageId = params.get("packageId");

    if (!ident || !packageId) {
      setError("Missing checkout info. Please go back and click Buy again.");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/basket/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ident, packageId: Number(packageId) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not complete checkout");
        window.location.href = data.checkoutUrl;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    })();
  }, [params]);

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
        {error ? "Order_Status: Error" : "Order_Status: Finishing up"}
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold uppercase tracking-tightest">
        {error ? "Something went wrong" : "Taking you to checkout…"}
      </h1>
      {error ? (
        <>
          <p className="mt-4 max-w-md text-dim">{error}</p>
          <Link
            href="/"
            className="mt-8 border border-paper px-6 py-3 font-mono text-xs uppercase tracking-widest2 hover:bg-paper hover:text-ink"
          >
            Back to store
          </Link>
        </>
      ) : (
        <p className="mt-4 max-w-md text-dim">
          You're logged in — hang tight while we finish setting up your order.
        </p>
      )}
    </>
  );
}

export default function CheckoutContinue() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Suspense
        fallback={
          <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
            Loading…
          </p>
        }
      >
        <ContinueContent />
      </Suspense>
    </main>
  );
}
