import Link from "next/link";

export default function CheckoutCancelled() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest2 text-dim">
        Order_Status: Cancelled
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold uppercase tracking-tightest">
        No charge made.
      </h1>
      <p className="mt-4 max-w-md text-dim">
        Your checkout was cancelled and nothing was charged. Head back whenever
        you're ready.
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
