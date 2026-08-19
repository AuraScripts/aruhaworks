"use client";

import Image from "next/image";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/tebex";

export default function CartDrawer() {
  const { basket, itemCount, isOpen, closeDrawer, removeItem, checkout, loading } =
    useCart();

  if (!isOpen) return null;

  const total = basket?.total_price ?? 0;
  const currency = basket?.currency ?? "EUR";
  const packages = basket?.packages ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <button
        aria-label="Close cart"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="relative flex h-full w-full max-w-[420px] flex-col bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.4.4-.1 1.1.4 1.1H17M17 13v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6" />
              </svg>
            </span>
            <div>
              <p className="text-[15px] font-semibold text-white">Shopping Cart</p>
              <p className="text-xs text-white/50">
                {itemCount} item{itemCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close"
            className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {packages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/30">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.4.4-.1 1.1.4 1.1H17" />
                </svg>
              </span>
              <p className="text-sm text-white/50">Your cart is empty</p>
              <button
                onClick={closeDrawer}
                className="mt-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {packages.map((pkg) => (
                <li
                  key={pkg.id}
                  className="flex items-center gap-3 rounded-2xl bg-[#141414] p-3"
                >
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-black">
                    {pkg.image ? (
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-white/30">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-snug text-white">
                      {pkg.name}
                    </p>
                    <p className="mt-1 text-sm text-white/60">
                      {formatPrice(pkg.in_basket?.price ?? 0, currency)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(pkg.id)}
                    aria-label={`Remove ${pkg.name}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e11d48] text-white transition hover:bg-[#be123c]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {packages.length > 0 && (
          <div className="border-t border-white/10 px-5 pb-6 pt-4">
            <div className="mb-1 flex items-center justify-between text-sm text-white/50">
              <span>Subtotal</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
            <div className="mb-5 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-base font-semibold text-white">Total</span>
              <span className="text-base font-semibold text-white">
                {formatPrice(total, currency)}
              </span>
            </div>

            <button
              onClick={() => checkout()}
              disabled={loading}
              className="mb-2.5 w-full rounded-xl bg-white py-3.5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              {loading ? "Please wait…" : "Secure Checkout"}
            </button>
            <button
              onClick={closeDrawer}
              className="w-full rounded-xl bg-white/10 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
