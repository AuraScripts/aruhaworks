# ARUHA WORKS — Storefront

A custom Next.js storefront for your FiveM scripts, wired to your Tebex store
through Tebex's **Headless API**. Same general idea as quasar-store.com (a
fully custom site talking to Tebex on the backend), but with its own visual
identity: a black-and-white "engineering workshop" look — blueprint grid,
corner-bracket frames on cards, monospace spec labels — instead of a copy of
theirs.

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## 2. Configuration

Your Tebex webstore token is already set in `.env.local`:

```
NEXT_PUBLIC_TEBEX_TOKEN=13rm1-fde51708cf7cf9c71cbb982668dc8f6e477202c1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

This token is **public** (Tebex's Headless API is meant to be called from the
browser with it) — it's fine that it's visible in client code. Do **not** put
your Tebex *secret* API key anywhere in this project.

When you deploy, update `NEXT_PUBLIC_SITE_URL` to your real domain — it's used
to build the checkout's return URLs (`/checkout/success`, `/checkout/cancelled`).

### Categories & packages

The homepage (`app/page.tsx`) fetches your **categories with packages**
directly from Tebex on every request (cached 2 minutes) — no product data is
hardcoded. To control what shows up:

- Create/organize categories in your Tebex dashboard (Store → Categories).
- Each category needs at least one package assigned to it to appear.
- Product images come from the image you set on each package in Tebex.

If nothing shows up, double check the token and that your categories actually
have packages in them — the page will tell you if the Tebex fetch itself failed.

## 3. How checkout works

1. Clicking **Buy Now** (`components/BuyButton.tsx`) calls `POST /api/basket`.
2. That route (`app/api/basket/route.ts`) creates a Tebex basket and adds the
   package to it via the Headless API (`lib/tebex.ts`).
3. The browser loads Tebex's `checkout.js` widget and opens a popup checkout
   for that basket — the customer never leaves your site.
4. On success/cancel, Tebex redirects to `/checkout/success` or
   `/checkout/cancelled`.

## 4. Structure

```
app/
  layout.tsx          fonts + metadata
  page.tsx             homepage — fetches categories, renders everything
  api/basket/route.ts  creates Tebex basket
  checkout/success/    post-purchase page
  checkout/cancelled/  cancelled-checkout page
components/
  Header, Hero, Testimonials, ProductGrid, ProductCard,
  BuyButton, Faq, Footer
lib/
  tebex.ts             all Tebex Headless API calls
```

## 5. Design notes

- **Palette**: pure black/off-white/gray only, per the brief — no accent color.
- **Type**: Space Grotesk (display), Inter (body), JetBrains Mono (labels,
  prices, spec codes) — a technical/schematic pairing rather than a generic
  gaming-store look.
- **Signature element**: the corner-bracket frame (see `.bracket-frame` in
  `globals.css`), used on the hero and every product card — a blueprint /
  spec-sheet motif that fits "WORKS" as an engineering shop for scripts.
- Swap the placeholder testimonials in `components/Testimonials.tsx` and the
  FAQ copy in `components/Faq.tsx` for your real ones whenever you have them.

## 6. Deploying

Any Next.js host works (Vercel is the path of least resistance — free tier is
enough for this). Set the two env vars in your host's dashboard, connect your
domain, done.
