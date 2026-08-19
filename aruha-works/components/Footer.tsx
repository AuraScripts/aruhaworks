import Link from "next/link";
import { DiscordIcon, YoutubeIcon } from "./icons";
import { GITBOOK_URL } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-black">
                AW
              </span>
              <span className="text-lg font-semibold">
                ARUHA<span className="text-muted">WORKS</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Premium FiveM scripts focused on performance, stability, and seamless server integration.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="https://discord.gg/tT4u7Bbn9q" target="_blank" rel="noreferrer" aria-label="Discord" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-borderBright hover:text-text">
                <DiscordIcon className="h-4 w-4" />
              </a>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition hover:border-borderBright hover:text-text">
                <YoutubeIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pages</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/" className="text-text/90 hover:text-white">Home</Link></li>
              <li><Link href="/scripts" className="text-text/90 hover:text-white">Scripts</Link></li>
              <li><Link href="/#faq" className="text-text/90 hover:text-white">FAQ</Link></li>
              <li><a href={GITBOOK_URL} target="_blank" rel="noreferrer" className="text-text/90 hover:text-white">Documentation</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Socials</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="https://discord.gg/tT4u7Bbn9q" target="_blank" rel="noreferrer" className="text-text/90 hover:text-white">Discord</a></li>
              <li><a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="text-text/90 hover:text-white">YouTube</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#" className="text-text/90 hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="text-text/90 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-text/90 hover:text-white">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted">
          <p>
            Copyright © {new Date().getFullYear()} Aruha Works. Not affiliated with Rockstar North, Take-Two Interactive or other rights holders.
          </p>
          <p className="mt-2">
            Checkout is operated by Tebex Limited. Prices shown are estimates; final price may differ at checkout.
          </p>
        </div>
      </div>
    </footer>
  );
}
