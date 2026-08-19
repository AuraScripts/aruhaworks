import { NextRequest, NextResponse } from "next/server";
import { createBasket } from "@/lib/tebex";

export async function POST(req: NextRequest) {
  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://aruhaworks.vercel.app";

  try {
    const basket = await createBasket(origin);
    if (!basket?.ident) {
      return NextResponse.json(
        { error: "Basket created but no ident returned" },
        { status: 502 }
      );
    }
    return NextResponse.json({ ident: basket.ident });
  } catch (err) {
    console.error("[basket/create]", err);
    const message = err instanceof Error ? err.message : "Could not create basket";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
