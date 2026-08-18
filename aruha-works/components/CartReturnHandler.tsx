"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "./CartContext";
import { launchTebexCheckout } from "@/lib/tebexCheckout";

function Inner() {
  const params = useSearchParams();
  const router = useRouter();
  const { refreshAndOpen } = useCart();

  useEffect(() => {
    const checkoutIdent = params.get("checkout");
    const cartOpen = params.get("cartOpen");

    if (checkoutIdent) {
      launchTebexCheckout(checkoutIdent);
      router.replace("/", { scroll: false });
    } else if (cartOpen) {
      refreshAndOpen();
      router.replace("/", { scroll: false });
    }
  }, [params, router, refreshAndOpen]);

  return null;
}

export default function CartReturnHandler() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
