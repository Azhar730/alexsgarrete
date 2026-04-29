import Image from "next/image";
import Link from "next/link";

const menuLinks = [
  { label: "Home", href: "#home" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact Us", href: "#contact" },
];

const bottomLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Accessibility Statement", href: "#" },
];

export default function Footer() {
  return (
    <div className=" container mx-auto px-4">
      <footer className="bg-[#8dbce3] rounded-3xl mb-4 overflow-hidden">

      {/* ── Main area ── */}
      <div className="px-8 sm:px-12 lg:px-20 py-10 sm:py-14
                      grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 items-start">

        <Image
          src="/encore-dog.png"
          alt="Encore dog mascot"
          width={301}
          height={267}
          className="object-contain"
        />

        {/* Center — Menu */}
        <div className="flex flex-col items-center sm:items-start gap-1 mt-0 lg:mt-10">
          <h4
            className="text-[#3B4A8B] font-semibold mb-2"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
          >
            Menu
          </h4>
          {menuLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[#3B5070] hover:text-[#3B4A8B] transition-colors"
              style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)" }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right — Contact */}
        <div className="flex flex-col items-center justify-center sm:items-start gap-1 mt-0 lg:mt-10">
          <h4
            className="text-[#3B4A8B] font-semibold mb-2"
            style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}
          >
            Contact
          </h4>
          <a
            href="mailto:contact@k9encore.com"
            className="text-[#3B5070] hover:text-[#3B4A8B] transition-colors"
            style={{ fontSize: "clamp(0.8rem, 1.1vw, 0.92rem)" }}
          >
            contact@k9encore.com
          </a>
        </div>
      </div>

      {/* ── Bottom bar — darker blue ── */}
      <div className="bg-[#4e7db6] px-6 sm:px-10 lg:px-16 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">

          {/* Left links */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/90 hover:text-white transition-colors"
                style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.78rem)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right — copyright */}
          <p
            className="text-white/90"
            style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.78rem)" }}
          >
            ©2025 Encore LLC
          </p>
        </div>
      </div>

    </footer>
    </div>
  );
}