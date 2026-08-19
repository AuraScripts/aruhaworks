import { NextRequest, NextResponse } from "next/server";
import { updateBasketPackageQuantity } from "@/lib/tebex";

export async function POST(req: NextRequest) {
  const { ident, packageId, quantity } = await req.json();
  if (!ident || !packageId || !quantity) {
    return NextResponse.json(
      { error: "ident, packageId, and quantity are required" },
      { status: 400 }
    );
  }
  try {
    const basket = await updateBasketPackageQuantity(ident, packageId, quantity);
    return NextResponse.json({ basket });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not update quantity";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
