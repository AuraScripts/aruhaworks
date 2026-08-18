const BASKET_KEY = "aruha_basket_ident";

export function getStoredBasketIdent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BASKET_KEY);
}

export function storeBasketIdent(ident: string) {
  if (typeof window !== "undefined") localStorage.setItem(BASKET_KEY, ident);
}

export function clearCart() {
  if (typeof window !== "undefined") localStorage.removeItem(BASKET_KEY);
}
