import { NextRequest, NextResponse } from "next/server";
import { getBasketAuthLinks } from "@/lib/tebex";

export async function GET(req: NextRequest) {
  const ident = req.nextUrl.searchParams.get("ident");
  const returnUrl = req.nextUrl.searchParams.get("returnUrl");

  if (!ident || !returnUrl) {
    return NextResponse.json(
      { error: "ident and returnUrl are required" },
      { status: 400 }
    );
  }

  try {
    const links = await getBasketAuthLinks(ident, returnUrl);
    return NextResponse.json({ links });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Could not fetch auth links";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
