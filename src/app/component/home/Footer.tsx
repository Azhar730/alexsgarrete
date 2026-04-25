import Link from "next/link";

const menuLinks = [
  { label: "Home", href: "#home" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact us", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#D6E4F7] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-10 pb-10 border-b border-[#b8cde8]">
          {/* Logo */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#7B8FCE] flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-[#3B4A8B] font-bold text-2xl tracking-tight">encore</span>
            </div>
            <p className="text-xs text-gray-500 max-w-[180px]">
              Loving care for your pet when you're no longer there.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Menu</h4>
            <ul className="flex flex-col gap-2">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#5B6BBF] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact</h4>
            <p className="text-sm text-gray-600">contact@getancore.com</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-6 gap-3">
          <p className="text-xs text-gray-500">© 2024 Encore. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="text-xs text-gray-500 hover:text-[#5B6BBF]">Terms & Conditions</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-[#5B6BBF]">Privacy Policy</Link>
            <Link href="#" className="text-xs text-gray-500 hover:text-[#5B6BBF]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
