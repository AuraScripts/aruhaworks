const BASKET_KEY = "aruha_basket_ident";
const USER_KEY = "aruha_username";

export function getStoredBasketIdent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(BASKET_KEY);
}

export function storeBasketIdent(ident: string) {
  if (typeof window !== "undefined") localStorage.setItem(BASKET_KEY, ident);
}

export function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_KEY);
}

export function storeUsername(name: string) {
  if (typeof window !== "undefined") localStorage.setItem(USER_KEY, name);
}

export function clearCart() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(BASKET_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
