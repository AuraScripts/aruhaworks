"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { GITBOOK_URL } from "@/lib/config";
import {
  SearchIcon,
  CartIcon,
  DiscordIcon,
  InstagramIcon,
  YoutubeIcon,
  TiktokIcon,
} from "./icons";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Scripts", href: "/scripts" },
  { label: "Bundles", href: "/bundles" },
];

const SOCIALS = [
  { Icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { Icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
  { Icon: DiscordIcon, href: "https://discord.gg/tT4u7Bbn9q", label: "Discord" },
  { Icon: TiktokIcon, href: "https://tiktok.com", label: "TikTok" },
];

export default function Header() {
  const { itemCount, openDrawer } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/scripts?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-3 font-display">
          <span className="flex h-9 w-9 items-center justify-center border border-line bg-raised p-1.5">
            <Image
              src="/aw-logo-white.png"
              alt="Aruha Works"
              width={28}
              height={20}
              className="h-auto w-full object-contain"
              priority
            />
          </span>
          <span className="text-lg font-semibold tracking-tightest">
            ARUHA<span className="text-dim"> / WORKS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-widest2 text-dim lg:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-paper">
              {item.label}
            </Link>
          ))}
          <a
            href={GITBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-paper"
          >
            Documentation
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 border-r border-line pr-4 sm:flex">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="text-dim transition-colors hover:text-paper"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              className="text-dim transition-colors hover:text-paper"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            {searchOpen && (
              <form
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-8 w-64 border border-line bg-raised p-2"
              >
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search scripts…"
                  className="w-full bg-transparent px-2 py-1 font-mono text-sm text-paper placeholder:text-dim focus:outline-none"
                />
              </form>
            )}
          </div>

          <button
            onClick={openDrawer}
            aria-label="Cart"
            className="relative text-dim transition-colors hover:text-paper"
          >
            <CartIcon className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-paper font-mono text-[10px] text-ink">
                {itemCount}
              </span>
            )}
          </button>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest2 text-dim transition-colors hover:border-paper hover:text-paper sm:flex"
          >
            <DiscordIcon className="h-4 w-4" />
            Sign in
          </a>
        </div>
      </div>
    </header>
  );
}
