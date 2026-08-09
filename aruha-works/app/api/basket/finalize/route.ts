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
    const { checkoutUrl } = await addPackageAndGetCheckout(ident, packageId);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not add package";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
