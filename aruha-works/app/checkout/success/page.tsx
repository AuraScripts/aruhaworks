import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
        Order_Status: Confirmed
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold uppercase tracking-tightest">
        Delivered.
      </h1>
      <p className="mt-4 max-w-md text-dim">
        Check your email for the receipt, and join our Discord to claim your
        script and get support.
      </p>
      <Link
        href="/"
        className="mt-8 border border-paper px-6 py-3 font-mono text-xs uppercase tracking-widest2 hover:bg-paper hover:text-ink"
      >
        Back to store
      </Link>
    </main>
  );
}
