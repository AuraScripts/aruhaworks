"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { launchTebexCheckout } from "@/lib/tebexCheckout";
import { getStoredBasketIdent, storeBasketIdent } from "@/lib/cart";
import type { Basket } from "@/lib/tebex";

type CartContextType = {
  basket: Basket | null;
  itemCount: number;
  isOpen: boolean;
  loading: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (packageId: number) => Promise<void>;
  buyNow: (packageId: number) => Promise<void>;
  removeItem: (packageId: number) => Promise<void>;
  updateQuantity: (packageId: number, quantity: number) => Promise<void>;
  checkout: () => Promise<void>;
  /** Re-fetches the basket and opens the drawer — used after returning from FiveM login. */
  refreshAndOpen: () => Promise<void>;
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
  const [basket, setBasket] = useState<Basket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshBasket = useCallback(async (ident?: string) => {
    const targetIdent = ident ?? getStoredBasketIdent();
    if (!targetIdent) return;
    try {
      const res = await fetch(`/api/basket/get?ident=${encodeURIComponent(targetIdent)}`);
      const data = await res.json();
      if (res.ok) setBasket(data.basket);
    } catch {
      // Non-fatal — badge/drawer just won't reflect the latest state.
    }
  }, []);

  useEffect(() => {
    refreshBasket();
  }, [refreshBasket]);

  const addToCart = useCallback(
    async (packageId: number) => {
      setLoading(true);
      try {
        const ident = await ensureBasket();
        const redirected = await requiresLoginRedirect(ident, "cart", packageId);
        if (redirected) return;
        await addPackage(ident, packageId);
        await refreshBasket(ident);
        setIsOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [refreshBasket]
  );

  const buyNow = useCallback(
    async (packageId: number) => {
      setLoading(true);
      try {
        const ident = await ensureBasket();
        const redirected = await requiresLoginRedirect(ident, "buy", packageId);
        if (redirected) return;
        await addPackage(ident, packageId);
        refreshBasket(ident);
        await launchTebexCheckout(ident);
      } finally {
        setLoading(false);
      }
    },
    [refreshBasket]
  );

  const removeItem = useCallback(async (packageId: number) => {
    const ident = getStoredBasketIdent();
    if (!ident) return;
    const res = await fetch("/api/basket/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ident, packageId }),
    });
    const data = await res.json();
    if (res.ok) setBasket(data.basket);
  }, []);

  const updateQuantity = useCallback(async (packageId: number, quantity: number) => {
    const ident = getStoredBasketIdent();
    if (!ident || quantity < 1) return;
    const res = await fetch("/api/basket/quantity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ident, packageId, quantity }),
    });
    const data = await res.json();
    if (res.ok) setBasket(data.basket);
  }, []);

  const checkout = useCallback(async () => {
    const ident = getStoredBasketIdent();
    if (!ident) return;
    setIsOpen(false);
    await launchTebexCheckout(ident);
  }, []);

  const refreshAndOpen = useCallback(async () => {
    await refreshBasket();
    setIsOpen(true);
  }, [refreshBasket]);

  const itemCount =
    basket?.packages.reduce((sum, p) => sum + p.in_basket.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        basket,
        itemCount,
        isOpen,
        loading,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
        addToCart,
        buyNow,
        removeItem,
        updateQuantity,
        checkout,
        refreshAndOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
