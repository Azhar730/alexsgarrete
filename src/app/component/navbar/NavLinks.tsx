import Link from "next/link";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact us", href: "/#contact" },
];

export function NavLinks() {
  return (
    <nav className="hidden md:flex items-center gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-gray-600 hover:text-[#5B6BBF] transition-colors font-medium"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}