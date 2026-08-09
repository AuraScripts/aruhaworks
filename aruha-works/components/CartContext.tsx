"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { launchTebexCheckout } from "@/lib/tebexCheckout";
import {
  getCartCount,
  getStoredBasketIdent,
  setCartCount,
  storeBasketIdent,
} from "@/lib/cart";

type CartContextType = {
  cartCount: number;
  /** Adds a package to the basket without opening checkout. */
  addToCart: (packageId: number) => Promise<void>;
  /** Adds a package and immediately opens the checkout overlay. */
  buyNow: (packageId: number) => Promise<void>;
  /** Opens the checkout overlay for whatever's already in the basket. */
  openCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

async function ensureBasket(): Promise<string> {
  const existing = getStoredBasketIdent();
  if (existing) return existing;

  const res = await fetch("/api/basket/create", { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not start your cart");
  storeBasketIdent(data.ident);
  return data.ident;
}

/**
 * Checks whether this basket needs the customer to log in (e.g. FiveM)
 * before anything can be added. If so, redirects the whole page there and
 * resolves `true` — the caller should stop, since we're navigating away.
 */
async function requiresLoginRedirect(
  ident: string,
  mode: "cart" | "buy",
  packageId: number
): Promise<boolean> {
  const returnUrl = `${window.location.origin}/checkout/continue?ident=${encodeURIComponent(
    ident
  )}&packageId=${packageId}&mode=${mode}`;

  const res = await fetch(
    `/api/basket/auth?ident=${encodeURIComponent(ident)}&returnUrl=${encodeURIComponent(
      returnUrl
    )}`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not verify login");

  if (data.links && data.links.length > 0) {
    window.location.href = data.links[0].url;
    return true;
  }
  return false;
}

async function addPackage(ident: string, packageId: number) {
  const res = await fetch("/api/basket/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ident, packageId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not add item to cart");
  return data;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());
  }, []);

  const bumpCount = useCallback(() => {
    const next = getCartCount() + 1;
    setCartCount(next);
    setCount(next);
  }, []);

  const addToCart = useCallback(
    async (packageId: number) => {
      const ident = await ensureBasket();
      const redirected = await requiresLoginRedirect(ident, "cart", packageId);
      if (redirected) return;
      await addPackage(ident, packageId);
      bumpCount();
    },
    [bumpCount]
  );

  const buyNow = useCallback(
    async (packageId: number) => {
      const ident = await ensureBasket();
      const redirected = await requiresLoginRedirect(ident, "buy", packageId);
      if (redirected) return;
      await addPackage(ident, packageId);
      bumpCount();
      await launchTebexCheckout(ident);
    },
    [bumpCount]
  );

  const openCart = useCallback(async () => {
    const ident = getStoredBasketIdent();
    if (!ident) return;
    await launchTebexCheckout(ident);
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, addToCart, buyNow, openCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
