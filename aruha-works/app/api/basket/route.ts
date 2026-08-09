import { NextRequest, NextResponse } from "next/server";
import { createBasketWithPackage } from "@/lib/tebex";

export async function POST(req: NextRequest) {
  const { packageId } = await req.json();

  if (!packageId || typeof packageId !== "number") {
    return NextResponse.json({ error: "packageId is required" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const { ident, checkoutUrl } = await createBasketWithPackage(packageId, siteUrl);
    return NextResponse.json({ ident, checkoutUrl });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not create basket";
    // TEMP: exposing the real Tebex error for debugging. Safe to narrow this
    // back down to a generic message once checkout is confirmed working.
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
