const BASKET_KEY = "aruha_basket_ident";
const COUNT_KEY = "aruha_cart_count";

export function getStoredBasketIdent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BASKET_KEY);
}

export function storeBasketIdent(ident: string) {
  if (typeof window !== "undefined") localStorage.setItem(BASKET_KEY, ident);
}

export function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(COUNT_KEY) || "0");
}

export function setCartCount(n: number) {
  if (typeof window !== "undefined") localStorage.setItem(COUNT_KEY, String(n));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BASKET_KEY);
  localStorage.removeItem(COUNT_KEY);
}
