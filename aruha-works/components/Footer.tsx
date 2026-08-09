export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <span className="font-display text-lg font-semibold tracking-tightest">
              ARUHA<span className="text-dim"> / WORKS</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-dim">
              Precision-built FiveM scripts and systems. Documented, maintained,
              and built to spec.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Catalog</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/90">
              <li><a href="#scripts" className="hover:text-dim">Scripts</a></li>
              <li><a href="#bundles" className="hover:text-dim">Bundles</a></li>
              <li><a href="#docs" className="hover:text-dim">Documentation</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/90">
              <li><a href="#faq" className="hover:text-dim">FAQ</a></li>
              <li><a href="#" className="hover:text-dim">Terms of Service</a></li>
              <li><a href="#" className="hover:text-dim">Refund Policy</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest2 text-dim">Connect</p>
            <ul className="mt-4 space-y-2 text-sm text-paper/90">
              <li><a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-dim">Discord</a></li>
              <li><a href="#" className="hover:text-dim">YouTube</a></li>
              <li><a href="#" className="hover:text-dim">TikTok</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-6 text-xs text-dim md:flex-row md:items-center md:justify-between">
          <p>
            ARUHA WORKS is an independent FiveM development studio, not affiliated
            with Rockstar Games, Take-Two Interactive, or Cfx.re.
          </p>
          <p className="font-mono uppercase tracking-widest2">
            © {new Date().getFullYear()} Aruha Works — Visa · Mastercard · PayPal
          </p>
        </div>
      </div>
    </footer>
  );
}
