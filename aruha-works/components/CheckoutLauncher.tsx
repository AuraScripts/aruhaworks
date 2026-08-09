"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { launchTebexCheckout } from "@/lib/tebexCheckout";

function CheckoutLauncherInner() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const ident = params.get("checkout");
    if (!ident) return;

    launchTebexCheckout(ident);
    // Strip the query param so refreshing the page doesn't relaunch checkout.
    router.replace("/", { scroll: false });
  }, [params, router]);

  return null;
}

export default function CheckoutLauncher() {
  return (
    <Suspense fallback={null}>
      <CheckoutLauncherInner />
    </Suspense>
  );
}
