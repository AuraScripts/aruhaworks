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
    const mode = params.get("mode") === "cart" ? "cart" : "buy";

    if (!ident || !packageId) {
      setError("Missing checkout info. Please go back and try again.");
      return;
    }

    // Persist basket after CFX login
    localStorage.setItem("aruha_basket_ident", ident);

    (async () => {
      try {
        // Pull basket to capture username from Tebex after auth
        const getRes = await fetch(`/api/basket/get?ident=${encodeURIComponent(ident)}`);
        if (getRes.ok) {
          const getData = await getRes.json();
          const name = getData.basket?.username || getData.basket?.username_id;
          if (name && String(name) !== "null") {
            localStorage.setItem("aruha_username", String(name));
          }
        }

        const res = await fetch("/api/basket/finalize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ident, packageId: Number(packageId) }),
        });
        const data = await res.json();
        if (!res.ok && !data.alreadyInBasket) {
          throw new Error(data.error || "Could not complete checkout");
        }

        if (mode === "cart") {
          window.location.href = "/?cartOpen=1";
          return;
        }

        window.location.href = `/?checkout=${encodeURIComponent(ident)}`;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    })();
  }, [params]);

  return (
    <>
      <p className="text-xs uppercase tracking-wider text-muted">
        {error ? "Order status: Error" : "Order status: Finishing up"}
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-tight">
        {error ? "Something went wrong" : "Taking you back to the shop…"}
      </h1>
      {error ? (
        <>
          <p className="mt-4 max-w-md text-sm text-muted">{error}</p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black"
          >
            Back to store
          </Link>
        </>
      ) : (
        <p className="mt-4 max-w-md text-sm text-muted">
          You&apos;re logged in — hang tight while we finish setting things up.
        </p>
      )}
    </>
  );
}

export default function CheckoutContinue() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <ContinueContent />
      </Suspense>
    </main>
  );
}
