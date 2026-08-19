import { createHash, createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { addPayment } from "@/lib/paymentsStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Tebex webhook endpoint
 * URL: https://YOUR-DOMAIN/api/webhooks/tebex
 *
 * Env: TEBEX_WEBHOOK_SECRET, UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
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

/** GET — helps confirm the route is live (Tebex uses POST only) */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Tebex webhook endpoint is live. Use POST from Tebex.",
  });
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  let payload: Record<string, unknown> = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    // Some validation pings may be empty or non-JSON — still try to recover
    console.warn("[tebex webhook] non-JSON body", rawBody?.slice(0, 200));
  }

  const type = String(payload.type || payload.Type || "");
  const id = payload.id ?? payload.Id;

  // ---- Validation handshake (must succeed for Tebex to enable the endpoint)
  // Tebex docs: respond 200 with { "id": "<webhook id>" }
  if (
    type === "validation.webhook" ||
    type === "validation" ||
    type.includes("validation")
  ) {
    console.log("[tebex webhook] validation", id);
    return NextResponse.json({ id: id ?? "ok" }, { status: 200 });
  }

  // If body is empty but looks like a validation probe, acknowledge
  if (!rawBody || Object.keys(payload).length === 0) {
    return NextResponse.json({ id: "ok" }, { status: 200 });
  }

  const secret = process.env.TEBEX_WEBHOOK_SECRET || "";

  // Verify signature when secret is set (skip if not configured yet)
  if (secret) {
    const sig =
      req.headers.get("x-signature") ||
      req.headers.get("X-Signature") ||
      req.headers.get("x-tebex-signature");
    if (!verifySignature(rawBody, sig, secret)) {
      console.warn("[tebex webhook] invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  if (type === "payment.completed") {
    const subject = (payload.subject as Record<string, unknown>) || {};
    const customer =
      (subject.customer as { username?: string; first_name?: string }) || {};
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
      pricePaid.currency || (subject.currency as string) || "EUR";
    const username =
      customer.username ||
      customer.first_name ||
      (subject.username as string) ||
      "Customer";
    const paymentId =
      (subject.transaction_id as string) || String(id || Date.now());

    try {
      await addPayment({
        id: String(paymentId),
        user: String(username),
        amount: formatMoney(amount, String(currency)),
        currency: String(currency),
        time: String(payload.date || new Date().toISOString()),
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("[tebex webhook] store failed", err);
      // Still 200 so Tebex doesn't keep retrying forever
    }

    return NextResponse.json({ success: true }, { status: 200 });
  }

  // Acknowledge unknown types
  return NextResponse.json({ ok: true }, { status: 200 });
}
