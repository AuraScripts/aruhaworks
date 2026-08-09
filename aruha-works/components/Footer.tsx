import { InstagramIcon, YoutubeIcon, DiscordIcon, TiktokIcon } from "./icons";
import { GITBOOK_URL } from "@/lib/config";

const SOCIALS = [
  { Icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { Icon: YoutubeIcon, href: "https://youtube.com", label: "YouTube" },
  { Icon: DiscordIcon, href: "https://discord.com", label: "Discord" },
  { Icon: TiktokIcon, href: "https://tiktok.com", label: "TikTok" },
];

const COMPANY_LINKS = [
  { label: "About Aruha Works", href: GITBOOK_URL },
  { label: "Our Story", href: GITBOOK_URL },
  { label: "Why Choose Us", href: GITBOOK_URL },
];

const RESOURCE_LINKS = [
  { label: "Frequently Asked Questions", href: "/#faq" },
  { label: "Documentation", href: GITBOOK_URL },
  { label: "Scripts", href: "/scripts" },
  { label: "Bundles", href: "/bundles" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-[1600px] px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <span className="font-display text-lg font-semibold tracking-tightest">
              ARUHA<span className="text-dim"> / WORKS</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-dim">
              Premium FiveM development studio. Instant delivery, and support
              that actually answers — built for QBCore, ESX, and Qbox.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-line text-dim transition-colors hover:border-paper hover:text-paper"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest2 text-dim">
              Secure payments with
            </p>
            <p className="mt-2 font-mono text-xs text-dim">
              Visa · Mastercard · PayPal · Google Pay · Apple Pay
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/90">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}><a href={l.href} className="hover:text-dim">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Resources</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/90">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.label}><a href={l.href} className="hover:text-dim">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Legal</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/90">
              <li><a href="#" className="hover:text-dim">Terms of Service</a></li>
              <li><a href="#" className="hover:text-dim">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-dim">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-xs text-dim md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl">
            ARUHA WORKS is an independent FiveM development studio, not
            affiliated with Rockstar Games, Take-Two Interactive, or Cfx.re.
          </p>
          <p className="font-mono uppercase tracking-widest2">
            © {new Date().getFullYear()} Aruha Works — All rights reserved.
          </p>
        </div>
      </div>

      <div className="overflow-hidden border-t border-line py-6">
        <p className="select-none whitespace-nowrap text-center font-display text-[14vw] font-semibold uppercase leading-none text-stroke opacity-40 md:text-[9vw]">
          ARUHA WORKS
        </p>
      </div>
    </footer>
  );
}
