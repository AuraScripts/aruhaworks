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

export type BasketPackage = {
  id: number;
  name: string;
  description: string;
  image: string | null;
  type: "single" | "subscription";
  in_basket: { quantity: number; price: number };
};

export type Basket = {
  ident: string;
  base_price: number;
  sales_tax: number;
  total_price: number;
  currency: string;
  packages: BasketPackage[];
  links: { checkout?: string; payment?: string };
};

/** Fetches the current, authoritative contents of a basket from Tebex. */
export async function getBasket(ident: string): Promise<Basket> {
  return tebexFetch<Basket>(`/accounts/${TEBEX_TOKEN}/baskets/${ident}`);
}

export async function removeBasketPackage(
  ident: string,
  packageId: number
): Promise<Basket> {
  return tebexFetch<Basket>(`/baskets/${ident}/packages/remove`, {
    method: "POST",
    body: JSON.stringify({ package_id: packageId }),
  });
}

export async function updateBasketPackageQuantity(
  ident: string,
  packageId: number,
  quantity: number
): Promise<Basket> {
  return tebexFetch<Basket>(`/baskets/${ident}/packages/${packageId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

/** Creates a fresh, empty basket. */
export async function createBasket(
  siteUrl: string
): Promise<{ ident: string }> {
  const basket = await tebexFetch<{ ident: string }>(
    `/accounts/${TEBEX_TOKEN}/baskets`,
    {
      method: "POST",
      body: JSON.stringify({
        complete_url: `${siteUrl}/checkout/success`,
        cancel_url: `${siteUrl}/checkout/cancelled`,
        complete_auto_redirect: true,
      }),
    }
  );
  return basket;
}

/**
 * Fetches the login options for a basket (e.g. "FiveM" via Tebex's
 * ident.tebex.io). Most game-server stores require the customer to
 * authenticate before any package can be added. Returns an empty array
 * for stores that don't require login.
 */
/**
 * Fetches the login options for a basket (e.g. "FiveM" via Tebex's
 * ident.tebex.io). Most game-server stores require the customer to
 * authenticate before any package can be added. Returns an empty array
 * for stores that don't require login.
 *
 * NOTE: unlike every other Headless API endpoint, /auth returns the array
 * directly instead of wrapping it in { data: [...] } — so this can't reuse
 * tebexFetch(), which always unwraps `.data`.
 */
export async function getBasketAuthLinks(
  basketIdent: string,
  returnUrl: string
): Promise<{ name: string; url: string }[]> {
  const res = await fetch(
    `${TEBEX_BASE}/accounts/${TEBEX_TOKEN}/baskets/${basketIdent}/auth?returnUrl=${encodeURIComponent(
      returnUrl
    )}`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Tebex auth lookup failed: ${res.status} ${body}`);
  }

  return res.json();
}

/** Adds a package to an (already-authorized) basket and returns the checkout URL. */
export async function addPackageAndGetCheckout(
  basketIdent: string,
  packageId: number
): Promise<{ checkoutUrl: string }> {
  // Many packages (licenses/scripts) have disable_quantity set, meaning
  // Tebex only allows quantity 1 in the basket ever. POSTing the same
  // package again tries to bump 1 -> 2 and Tebex rejects it with
  // "Quantity cannot be greater than 1". So check first: if it's already
  // in the basket, don't add it again — just hand back the existing
  // checkout link.
  const currentBasket = await getBasket(basketIdent);
  const alreadyInBasket = currentBasket.packages.some(
    (p) => p.id === packageId
  );

  if (alreadyInBasket) {
    return { checkoutUrl: currentBasket.links.checkout! };
  }

  const basket = await tebexFetch<{ links: { checkout: string } }>(
    `/baskets/${basketIdent}/packages`,
    {
      method: "POST",
      body: JSON.stringify({ package_id: packageId, quantity: 1 }),
    }
  );
  return { checkoutUrl: basket.links.checkout };
}

export function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** Best-effort framework tags parsed from a package's name/description. */
export function parseFrameworkTags(pkg: TebexPackage): string[] {
  const haystack = `${pkg.name} ${pkg.description}`.toLowerCase();
  const tags: string[] = [];
  if (/\bqbcore\b|\bqb-core\b|\bqb\b/.test(haystack)) tags.push("QB");
  if (/\besx\b/.test(haystack)) tags.push("ESX");
  if (/\bqbox\b/.test(haystack)) tags.push("QBOX");
  if (/\bstandalone\b/.test(haystack)) tags.push("STANDALONE");
  return tags;
}
