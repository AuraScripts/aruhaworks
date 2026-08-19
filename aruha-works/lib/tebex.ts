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
  /** Present after the player authenticates via FiveM / CFX login */
  username?: string | null;
  username_id?: string | null;
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
  if (!TEBEX_TOKEN) {
    throw new Error("NEXT_PUBLIC_TEBEX_TOKEN is not set on the server");
  }
  const res = await fetch(`${TEBEX_BASE}/accounts/${TEBEX_TOKEN}/baskets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      complete_url: `${siteUrl}/checkout/success`,
      cancel_url: `${siteUrl}/checkout/cancelled`,
      complete_auto_redirect: true,
    }),
    cache: "no-store",
  });
  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Tebex create basket failed: ${res.status} ${raw}`);
  }
  const json = JSON.parse(raw);
  const basket = json.data ?? json;
  if (!basket?.ident) {
    throw new Error(`Tebex create basket: no ident in response ${raw.slice(0, 300)}`);
  }
  return { ident: basket.ident };
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
  const url = `${TEBEX_BASE}/accounts/${TEBEX_TOKEN}/baskets/${encodeURIComponent(
    basketIdent
  )}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const body = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`Tebex auth lookup failed: ${res.status} ${body}`);
  }

  const json = body ? JSON.parse(body) : [];
  // Endpoint returns the array directly, or sometimes { data: [...] }
  const links = Array.isArray(json) ? json : json.data ?? [];
  return links;
}

/** Adds a package to an (already-authorized) basket and returns the checkout URL. */
export async function addPackageAndGetCheckout(
  basketIdent: string,
  packageId: number
): Promise<{ checkoutUrl: string; alreadyInBasket?: boolean }> {
  // Packages with disable_quantity only allow qty 1. If already in basket,
  // Tebex returns "Quantity cannot be greater than 1" on a second POST.
  const currentBasket = await getBasket(basketIdent);
  const alreadyInBasket = currentBasket.packages.some(
    (p) => Number(p.id) === Number(packageId)
  );

  if (alreadyInBasket) {
    return {
      checkoutUrl: currentBasket.links.checkout || "",
      alreadyInBasket: true,
    };
  }

  try {
    // Basket package routes live under /api/baskets/{ident}/... (no account token)
    // Docs: POST https://headless.tebex.io/api/baskets/{basketIdent}/packages
    const res = await fetch(
      `${TEBEX_BASE}/baskets/${basketIdent}/packages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ package_id: Number(packageId), quantity: 1 }),
        cache: "no-store",
      }
    );
    const raw = await res.text();
    if (!res.ok) {
      throw new Error(`Tebex API /baskets/${basketIdent}/packages failed: ${res.status} ${raw}`);
    }
    let json: any = {};
    try {
      json = JSON.parse(raw);
    } catch {
      /* empty */
    }
    // Some basket endpoints return { data: Basket }, others return Basket at root
    const basket = json.data ?? json;
    const checkoutUrl =
      basket?.links?.checkout ||
      basket?.links?.payment ||
      "";
    return { checkoutUrl };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Race: package was added between our GET and POST
    if (msg.includes("Quantity cannot be greater than 1")) {
      const refreshed = await getBasket(basketIdent);
      return {
        checkoutUrl: refreshed.links.checkout || "",
        alreadyInBasket: true,
      };
    }
    throw err;
  }
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
