"use client";

import Image from "next/image";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/tebex";

const DISCOUNT_TIERS = [
  { threshold: 100, pct: 5 },
  { threshold: 200, pct: 10 },
  { threshold: 300, pct: 15 },
];

export default function CartDrawer() {
  const { basket, itemCount, isOpen, closeDrawer, removeItem, updateQuantity, checkout } =
    useCart();

  if (!isOpen) return null;

  const subtotal = basket?.total_price ?? 0;
  const currency = basket?.currency ?? "USD";
  const nextTier = DISCOUNT_TIERS.find((t) => subtotal < t.threshold);
  const highestTier = [...DISCOUNT_TIERS].reverse().find((t) => subtotal >= t.threshold);
  const progressPct = nextTier
    ? Math.min(100, (subtotal / nextTier.threshold) * 100)
    : 100;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        aria-label="Close cart"
        onClick={closeDrawer}
        className="absolute inset-0 bg-bg/80 backdrop-blur-sm"
      />

      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-bg">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-muted">
              Basket / {String(itemCount).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold uppercase tracking-tightest">
              Your Cart
            </h2>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center border border-border text-muted hover:border-text hover:text-text"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!basket || basket.packages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-mono text-sm text-muted">Your cart is empty.</p>
              <button
                onClick={closeDrawer}
                className="mt-4 border border-text px-5 py-2.5 font-mono text-xs uppercase tracking-widest2 hover:bg-text hover:text-bg"
              >
                Keep Shopping
              </button>
            </div>
          ) : (
            <>
              {DISCOUNT_TIERS.length > 0 && (
                <div className=" mb-6 border border-border bg-card p-5">
                  <p className="font-mono text-xs uppercase tracking-widest2 text-muted">
                    Volume Discount
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    The more you spend, the bigger the discount you unlock.
                  </p>
                  {nextTier ? (
                    <p className="mt-3 text-sm">
                      Spend{" "}
                      <span className="text-text">
                        {formatPrice(nextTier.threshold - subtotal, currency)}
                      </span>{" "}
                      more to unlock <span className="text-text">{nextTier.pct}% off</span>.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-text">
                      You've unlocked {highestTier?.pct}% off. Nice.
                    </p>
                  )}
                  <div className="mt-3 h-1 w-full bg-border">
                    <div
                      className="h-full bg-text transition-all"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {DISCOUNT_TIERS.map((t) => (
                      <div
                        key={t.pct}
                        className={`border px-2 py-2 text-center font-mono text-[10px] uppercase tracking-widest2 ${
                          subtotal >= t.threshold
                            ? "border-text text-text"
                            : "border-border text-muted"
                        }`}
                      >
                        <p className="text-sm">{t.pct}%</p>
                        <p className="mt-0.5">at {t.threshold}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">
                    Note: illustrative — ask us in Discord about active promo codes.
                  </p>
                </div>
              )}

              <p className="mb-3 font-mono text-xs uppercase tracking-widest2 text-muted">
                Items <span className="text-text">{itemCount}</span>
              </p>

              <div className="space-y-4">
                {basket.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex gap-3 border border-border bg-card p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border bg-bg">
                      {pkg.image ? (
                        <Image src={pkg.image} alt={pkg.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-mono text-[9px] text-muted">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-semibold uppercase leading-tight">
                          {pkg.name}
                        </h3>
                        <button
                          onClick={() => removeItem(pkg.id)}
                          aria-label={`Remove ${pkg.name}`}
                          className="shrink-0 text-muted hover:text-text"
                        >
                          🗑
                        </button>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted">{pkg.description}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {pkg.type === "subscription" ? (
                            <span className="border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest2 text-muted">
                              Membership
                            </span>
                          ) : (
                            <div className="flex items-center border border-border">
                              <button
                                onClick={() =>
                                  updateQuantity(pkg.id, Math.max(1, pkg.in_basket.quantity - 1))
                                }
                                className="px-2 py-1 text-muted hover:text-text"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="px-2 font-mono text-xs">
                                {pkg.in_basket.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(pkg.id, pkg.in_basket.quantity + 1)}
                                className="px-2 py-1 text-muted hover:text-text"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                        <span className="font-mono text-sm text-text">
                          {formatPrice(pkg.in_basket.price * pkg.in_basket.quantity, currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {basket && basket.packages.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs uppercase tracking-widest2 text-muted">Total</span>
              <span className="font-display text-2xl font-semibold">
                {formatPrice(subtotal, currency)}
              </span>
            </div>

            <p className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest2 text-muted">
              🔒 Secure checkout on Tebex's hosted page
            </p>

            <div className="mt-4 flex gap-3">
              <button
                onClick={closeDrawer}
                className="flex-1 border border-border py-3 font-mono text-xs uppercase tracking-widest2 text-muted hover:border-text hover:text-text"
              >
                Keep Shopping
              </button>
              <button
                onClick={checkout}
                className="flex-1 border border-text bg-text py-3 font-mono text-xs uppercase tracking-widest2 text-bg hover:bg-transparent hover:text-text"
              >
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
