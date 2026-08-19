import { createHash, createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { addPayment } from "@/lib/paymentsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tebex webhook endpoint.
 *
 * Setup in Tebex Creator Panel → Developers → Webhooks → Endpoints:
 *   URL:  https://YOUR_DOMAIN/api/webhooks/tebex
 *   Type: Payment Completed  (+ validation is automatic)
 *
 * Env:
 *   TEBEX_WEBHOOK_SECRET  — from the webhook endpoint page
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — for persistence
 */

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature || !secret) return false;
  const bodyHash = createHash("sha256").update(rawBody, "utf8").digest("hex");
  const expected = createHmac("sha256", secret).update(bodyHash).digest("hex");
  try {
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.TEBEX_WEBHOOK_SECRET || "";

  // Always parse after reading raw body (needed for signature)
  let payload: {
    id?: string;
    type?: string;
    date?: string;
    subject?: Record<string, unknown>;
  };
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validation handshake — Tebex sends this when you add/validate the endpoint
  if (payload.type === "validation.webhook") {
    return NextResponse.json({ id: payload.id });
  }

  // Verify signature when secret is configured
  if (secret) {
    const sig = req.headers.get("x-signature");
    if (!verifySignature(rawBody, sig, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  if (payload.type === "payment.completed") {
    const subject = payload.subject || {};
    // Tebex payment.completed subject shape varies slightly; be defensive
    const customer =
      (subject.customer as { username?: string; first_name?: string }) || {};
    const products = (subject.products as { name?: string }[]) || [];
    const pricePaid =
      (subject.price_paid as { amount?: number; currency?: string }) ||
      (subject.price as { amount?: number; currency?: string }) ||
      {};
    const amount =
      typeof pricePaid.amount === "number"
        ? pricePaid.amount
        : typeof subject.amount === "number"
          ? (subject.amount as number)
          : 0;
    const currency =
      pricePaid.currency ||
      (subject.currency as string) ||
      "EUR";

    const username =
      customer.username ||
      customer.first_name ||
      (subject.username as string) ||
      "Customer";

    const id =
      (subject.transaction_id as string) ||
      payload.id ||
      `${Date.now()}`;

    await addPayment({
      id: String(id),
      user: String(username),
      amount: formatMoney(amount, currency),
      currency: String(currency),
      time: payload.date || new Date().toISOString(),
      timestamp: Date.now(),
    });

    // Optional: log product names for debugging
    if (products.length) {
      console.log(
        "[tebex webhook] payment.completed",
        username,
        formatMoney(amount, currency),
        products.map((p) => p.name).join(", ")
      );
    }

    return NextResponse.json({ success: true });
  }

  // Acknowledge other types so Tebex doesn't retry forever
  return NextResponse.json({ ok: true });
}
