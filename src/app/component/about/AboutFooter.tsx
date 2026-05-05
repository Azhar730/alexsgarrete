import Link from "next/link";

const MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact Us", href: "#contact" },
];

const LEGAL_LINKS = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Accessibility Statement", href: "/accessibility" },
];

export function AboutFooter() {
  return (
    <footer className="bg-[#DDEAF7] mt-6">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pt-12 pb-8">
        {/* Top row: logo | menu | contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-[#C5D9EF]">
          {/* Logo */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="text-slate-800 text-xl font-extrabold tracking-tight"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                enc<span className="text-[#5C7FC4]">o</span>re
              </span>
              <span className="text-lg">🐾</span>
            </div>
          </div>

          {/* Menu */}
          <div>
            <p className="text-slate-700 text-sm font-bold mb-4">Menu</p>
            <ul className="flex flex-col gap-2">
              {MENU_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-slate-500 text-sm hover:text-slate-800 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-slate-700 text-sm font-bold mb-4">Contact</p>
            <a
              href="mailto:contact@k9encore.com"
              className="text-slate-500 text-sm hover:text-slate-800 transition-colors"
            >
              contact@k9encore.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-slate-400 text-xs hover:text-slate-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <p className="text-slate-400 text-xs">©2025 Encore LLC</p>
        </div>
      </div>
    </footer>
  );
}
