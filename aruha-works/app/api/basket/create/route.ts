import { NextResponse } from "next/server";
import { createBasket } from "@/lib/tebex";

export async function POST() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const basket = await createBasket(siteUrl);
    return NextResponse.json(basket);
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not create basket";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
