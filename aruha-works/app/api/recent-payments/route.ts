import { NextResponse } from "next/server";
import { getPayments, formatRelativeTime } from "@/lib/paymentsStore";

export const dynamic = "force-dynamic";

const DEMO = [
  { user: "bepeterh", time: "Today 21:12", amount: "€24.00" },
  { user: "Officer_Rogue", time: "Today 21:12", amount: "€18.99" },
  { user: "pronews", time: "Today 21:03", amount: "€17.00" },
  { user: "dopu_090", time: "Today 20:56", amount: "€4.20" },
  { user: "Bulldog90", time: "Today 20:12", amount: "€137.16" },
  { user: "xNightOwl", time: "Today 19:48", amount: "€42.00" },
];

export async function GET() {
  try {
    const stored = await getPayments();
    if (stored.length > 0) {
      return NextResponse.json({
        source: "live",
        payments: stored.map((p) => ({
          user: p.user,
          time: formatRelativeTime(p.time),
          amount: p.amount,
        })),
      });
    }
  } catch (err) {
    console.error("[recent-payments]", err);
  }

  return NextResponse.json({ source: "demo", payments: DEMO });
}
