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
  getStoredBasketIdent,
  storeBasketIdent,
  getStoredUsername,
  storeUsername,
  clearCart,
} from "@/lib/cart";
import type { Basket } from "@/lib/tebex";

type CartContextType = {
  basket: Basket | null;
  itemCount: number;
  isOpen: boolean;
  loading: boolean;
  username: string | null;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (packageId: number) => Promise<void>;
  buyNow: (packageId: number) => Promise<void>;
  removeItem: (packageId: number) => Promise<void>;
  updateQuantity: (packageId: number, quantity: number) => Promise<void>;
  checkout: () => Promise<void>;
  refreshAndOpen: () => Promise<void>;
  logout: () => void;
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
  const [username, setUsername] = useState<string | null>(null);

  const refreshBasket = useCallback(async (ident?: string) => {
    const targetIdent = ident ?? getStoredBasketIdent();
    if (!targetIdent) return;
    try {
      const res = await fetch(`/api/basket/get?ident=${encodeURIComponent(targetIdent)}`);
      const data = await res.json();
      if (res.ok && data.basket) {
        setBasket(data.basket);
        const name =
          data.basket.username ||
          data.basket.username_id ||
          getStoredUsername();
        if (name) {
          storeUsername(String(name));
          setUsername(String(name));
        }
      }
    } catch {
      // Non-fatal
    }
  }, []);

  useEffect(() => {
    setUsername(getStoredUsername());
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
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Could not add to cart");
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
        await refreshBasket(ident);
        await launchTebexCheckout(ident);
      } catch (err) {
        console.error(err);
        alert(err instanceof Error ? err.message : "Could not start checkout");
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
    // Most FiveM packages only allow qty 1 — skip bumping past 1
    if (quantity > 1) return;
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

  const logout = useCallback(() => {
    clearCart();
    setBasket(null);
    setUsername(null);
    setIsOpen(false);
  }, []);

  const itemCount =
    basket?.packages.reduce((sum, p) => sum + (p.in_basket?.quantity ?? 1), 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        basket,
        itemCount,
        isOpen,
        loading,
        username,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
        addToCart,
        buyNow,
        removeItem,
        updateQuantity,
        checkout,
        refreshAndOpen,
        logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
