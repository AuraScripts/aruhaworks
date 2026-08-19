"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { GITBOOK_URL } from "@/lib/config";
import { SearchIcon, CartIcon, DiscordIcon, YoutubeIcon } from "./icons";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Scripts", href: "/scripts" },
  { label: "Documentation", href: GITBOOK_URL, external: true },
  { label: "Tutorial Videos", href: "https://www.youtube.com", external: true },
];

export default function Header() {
  const { itemCount, openDrawer, username, logout } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/scripts?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
            AW
          </span>
          <span className="text-lg font-semibold tracking-tight">
            ARUHA<span className="text-muted">WORKS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted lg:flex">
          {NAV.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-text">
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="transition-colors hover:text-text">
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 border-r border-border pr-3 sm:flex">
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-muted transition hover:text-text">
              <YoutubeIcon className="h-4.5 w-4.5" />
            </a>
            <a href="https://discord.gg/tT4u7Bbn9q" target="_blank" rel="noreferrer" aria-label="Discord" className="text-muted transition hover:text-text">
              <DiscordIcon className="h-4.5 w-4.5" />
            </a>
          </div>

          <div className="relative">
            <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="rounded-lg p-2 text-muted transition hover:bg-card hover:text-text">
              <SearchIcon className="h-5 w-5" />
            </button>
            {searchOpen && (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 top-11 w-64 rounded-lg border border-border bg-card p-2 shadow-card">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search scripts…"
                  className="w-full rounded bg-bg px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-white"
                />
              </form>
            )}
          </div>

          <button onClick={openDrawer} aria-label="Cart" className="relative rounded-lg p-2 text-muted transition hover:bg-card hover:text-text">
            <CartIcon className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                {itemCount}
              </span>
            )}
          </button>

          {username ? (
            <div className="hidden items-center gap-2 rounded-xl border border-border bg-card pl-2 pr-3 py-1.5 sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold text-text max-w-[100px] truncate">{username}</p>
                <button
                  onClick={logout}
                  className="text-[10px] text-muted hover:text-white"
                >
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <a
              href="https://discord.gg/tT4u7Bbn9q"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-black transition hover:bg-white/90 sm:inline-flex"
            >
              <DiscordIcon className="h-4 w-4" />
              Discord
            </a>
          )}

          <button onClick={() => setMobileOpen((o) => !o)} className="rounded-lg p-2 text-muted lg:hidden" aria-label="Menu">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) =>
              item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-bg hover:text-text" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href} className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-bg hover:text-text" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
              )
            )}
            {username && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-muted hover:bg-bg hover:text-text"
              >
                Log out ({username})
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
