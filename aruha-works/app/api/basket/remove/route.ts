import { NextRequest, NextResponse } from "next/server";
import { removeBasketPackage } from "@/lib/tebex";

export async function POST(req: NextRequest) {
  const { ident, packageId } = await req.json();
  if (!ident || !packageId) {
    return NextResponse.json({ error: "ident and packageId are required" }, { status: 400 });
  }
  try {
    const basket = await removeBasketPackage(ident, packageId);
    return NextResponse.json({ basket });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not remove item";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
