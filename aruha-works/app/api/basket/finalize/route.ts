import { NextRequest, NextResponse } from "next/server";
import { addPackageAndGetCheckout } from "@/lib/tebex";

export async function POST(req: NextRequest) {
  const { ident, packageId } = await req.json();

  if (!ident || !packageId) {
    return NextResponse.json(
      { error: "ident and packageId are required" },
      { status: 400 }
    );
  }

  try {
    const result = await addPackageAndGetCheckout(ident, Number(packageId));
    return NextResponse.json({
      checkoutUrl: result.checkoutUrl,
      alreadyInBasket: result.alreadyInBasket ?? false,
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not add package";
    // Surface a cleaner message for the quantity error
    if (message.includes("Quantity cannot be greater than 1")) {
      return NextResponse.json({
        checkoutUrl: null,
        alreadyInBasket: true,
        error: "This item is already in your cart.",
      });
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
