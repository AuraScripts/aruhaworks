import Link from "next/link";

const NAV = [
  { label: "Scripts", href: "#scripts" },
  { label: "Bundles", href: "#bundles" },
  { label: "Docs", href: "#docs" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-display">
          <span className="flex h-8 w-8 items-center justify-center border border-paper text-sm font-semibold">
            A
          </span>
          <span className="text-lg font-semibold tracking-tightest">
            ARUHA<span className="text-dim"> / WORKS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-widest2 text-dim md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-paper">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="hidden font-mono text-xs uppercase tracking-widest2 text-dim transition-colors hover:text-paper sm:inline"
          >
            Discord
          </a>
          <a
            href="#scripts"
            className="border border-paper px-4 py-2 font-mono text-xs uppercase tracking-widest2 text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            Browse
          </a>
        </div>
      </div>
    </header>
  );
}
