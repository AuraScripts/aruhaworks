import { NextRequest, NextResponse } from "next/server";
import { getBasket } from "@/lib/tebex";

export async function GET(req: NextRequest) {
  const ident = req.nextUrl.searchParams.get("ident");
  if (!ident) {
    return NextResponse.json({ error: "ident is required" }, { status: 400 });
  }
  try {
    const basket = await getBasket(ident);
    return NextResponse.json({ basket });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not load cart";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
