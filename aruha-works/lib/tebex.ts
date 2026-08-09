// Thin wrapper around Tebex's Headless (Checkout) API.
// Docs: https://docs.tebex.io/developers/headless-api/overview
//
// The webstore token below is a PUBLIC identifier — Tebex's Headless API is
// designed to be called straight from the browser with it. Never put your
// Tebex secret/private API key in this file or in NEXT_PUBLIC_* env vars.

const TEBEX_BASE = "https://headless.tebex.io/api";

export const TEBEX_TOKEN = process.env.NEXT_PUBLIC_TEBEX_TOKEN ?? "";

export type TebexPackage = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  type: "single" | "subscription";
  category: { id: number; name: string };
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  discount: number;
  disable_quantity: boolean;
  disable_gifting: boolean;
};

export type TebexCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  packages?: TebexPackage[];
};

async function tebexFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const isGet = !init?.method || init.method === "GET";

  const res = await fetch(`${TEBEX_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
    // Only cache read (GET) calls — never cache basket writes.
    ...(isGet ? { next: { revalidate: 120 } } : { cache: "no-store" as const }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Tebex API ${path} failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  return json.data as T;
}

/** All categories, with their packages nested inline. */
export async function getCategories(): Promise<TebexCategory[]> {
  return tebexFetch<TebexCategory[]>(
    `/accounts/${TEBEX_TOKEN}/categories?includePackages=1`
  );
}

/** Flat list of every package in the store. */
export async function getPackages(): Promise<TebexPackage[]> {
  return tebexFetch<TebexPackage[]>(`/accounts/${TEBEX_TOKEN}/packages`);
}

export async function getPackage(id: number): Promise<TebexPackage> {
  return tebexFetch<TebexPackage>(`/accounts/${TEBEX_TOKEN}/packages/${id}`);
}

/**
 * Creates a fresh basket and immediately adds one package to it.
 * Returns the basket ident, which the client hands to Tebex's checkout.js
 * widget (see components/BuyButton.tsx) or a hosted checkout redirect.
 */
export async function createBasketWithPackage(
  packageId: number,
  siteUrl: string
): Promise<{ ident: string; checkoutUrl: string }> {
  const basket = await tebexFetch<{
    ident: string;
    links: { checkout: string };
  }>(`/accounts/${TEBEX_TOKEN}/baskets`, {
    method: "POST",
    body: JSON.stringify({
      complete_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancelled`,
      complete_auto_redirect: true,
    }),
  });

  await tebexFetch(`/accounts/${TEBEX_TOKEN}/baskets/${basket.ident}/packages`, {
    method: "POST",
    body: JSON.stringify({ package_id: packageId, quantity: 1 }),
  });

  return { ident: basket.ident, checkoutUrl: basket.links.checkout };
}

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
