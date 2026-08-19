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
import LoginModal from "./LoginModal";

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
  /** Open FiveM login modal (optional package to add after login) */
  requireLogin: (packageId?: number, mode?: "cart" | "buy") => void;
};

const CartContext = createContext<CartContextType | null>(null);

async function ensureFreshBasket(): Promise<string> {
  // Prefer existing only if it still exists on Tebex
  const existing = getStoredBasketIdent();
  if (existing) {
    try {
      const res = await fetch(`/api/basket/get?ident=${encodeURIComponent(existing)}`);
      if (res.ok) return existing;
    } catch {
      /* create new below */
    }
    clearCart();
  }

  const res = await fetch("/api/basket/create", { method: "POST" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not start your cart");
  storeBasketIdent(data.ident);
  return data.ident as string;
}

async function addPackage(ident: string, packageId: number) {
  const res = await fetch("/api/basket/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ident, packageId }),
  });
  const data = await res.json();
  if (!res.ok && !data.alreadyInBasket) {
    throw new Error(data.error || "Could not add item to cart");
  }
  return data;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [basket, setBasket] = useState<Basket | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Login modal state
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginPackageId, setLoginPackageId] = useState<number | null>(null);
  const [loginMode, setLoginMode] = useState<"cart" | "buy">("cart");

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
        if (name && String(name) !== "null") {
          storeUsername(String(name));
          setUsername(String(name));
        }
      } else {
        // Stale basket
        clearCart();
        setBasket(null);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setUsername(getStoredUsername());
    refreshBasket();
  }, [refreshBasket]);

  const requireLogin = useCallback((packageId?: number, mode: "cart" | "buy" = "cart") => {
    setLoginPackageId(packageId ?? null);
    setLoginMode(mode);
    setLoginOpen(true);
  }, []);

  const addToCart = useCallback(
    async (packageId: number) => {
      // Not logged in → show FiveM login modal first (0Resmon-style)
      if (!getStoredUsername() && !username) {
        requireLogin(packageId, "cart");
        return;
      }

      setLoading(true);
      try {
        const ident = await ensureFreshBasket();
        await addPackage(ident, packageId);
        await refreshBasket(ident);
        setIsOpen(true);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        // Auth required or bad basket → login modal
        if (
          msg.includes("Basket not found") ||
          msg.includes("401") ||
          msg.includes("auth") ||
          msg.includes("login")
        ) {
          requireLogin(packageId, "cart");
          return;
        }
        console.error(err);
        alert(msg);
      } finally {
        setLoading(false);
      }
    },
    [refreshBasket, requireLogin, username]
  );

  const buyNow = useCallback(
    async (packageId: number) => {
      if (!getStoredUsername() && !username) {
        requireLogin(packageId, "buy");
        return;
      }

      setLoading(true);
      try {
        const ident = await ensureFreshBasket();
        await addPackage(ident, packageId);
        await refreshBasket(ident);
        await launchTebexCheckout(ident);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.includes("Basket not found") ||
          msg.includes("401") ||
          msg.includes("auth") ||
          msg.includes("login")
        ) {
          requireLogin(packageId, "buy");
          return;
        }
        console.error(err);
        alert(msg);
      } finally {
        setLoading(false);
      }
    },
    [refreshBasket, requireLogin, username]
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
        requireLogin,
      }}
    >
      {children}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        packageId={loginPackageId}
        mode={loginMode}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
