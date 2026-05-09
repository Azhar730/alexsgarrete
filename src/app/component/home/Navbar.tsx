// "use client";

// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import Image from "next/image";
// import { AnimatePresence, motion } from "framer-motion";

// const navLinks = [
//   { label: "Home", href: "#home" },
//   { label: "How it works", href: "#how-it-works" },
//   { label: "Features", href: "#features" },
//   { label: "FAQ", href: "#faq" },
//   { label: "Contact us", href: "#contact" },
// ];

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <div>
//       <motion.header
//       className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md"
//       initial={{ y: -24, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.45, ease: "easeOut" }}
//     >
//       <div className="container mx-auto px-4 h-24 flex items-center justify-between">
//         {/* Logo */}
//         <Link href="/" className="flex items-center gap-2">
//           <Image src={"/encore-nav.png"} alt="encore" height={65} width={228} />
//         </Link>

//         {/* Desktop Nav */}
//         <nav className="hidden md:flex items-center gap-6">
//           {navLinks.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               className="text-gray-600 hover:text-[#5B6BBF] transition-colors font-medium"
//             >
//               {link.label}
//             </Link>
//           ))}
//         </nav>

//         {/* CTA Buttons */}
//         <div className="hidden md:flex items-center gap-3">
//           <Link href="/login">
//             <Button
//               variant="ghost"
//               className="text-gray-700 hover:text-[#5B6BBF] hover:px-2 hover:rounded-full cursor-pointer"
//             >
//               Log In
//             </Button>
//           </Link>
//           <Link href={'/signup'}>
//           <Button className="bg-[#5B6BBF] hover:bg-[#4a5aa8] text-white rounded-full px-5 cursor-pointer">
//             Sign Up
//           </Button>
//           </Link>
//         </div>

//         {/* Mobile Toggle */}
//         <button
//           className="md:hidden text-gray-600"
//           onClick={() => setMobileOpen(!mobileOpen)}
//         >
//           {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileOpen && (
//           <motion.div
//             className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4"
//             initial={{ opacity: 0, y: -8, height: 0 }}
//             animate={{ opacity: 1, y: 0, height: "auto" }}
//             exit={{ opacity: 0, y: -8, height: 0 }}
//             transition={{ duration: 0.25, ease: "easeOut" }}
//           >
//           {navLinks.map((link) => (
//             <Link
//               key={link.label}
//               href={link.href}
//               className="text-gray-700 font-medium hover:text-[#5B6BBF]"
//               onClick={() => setMobileOpen(false)}
//             >
//               {link.label}
//             </Link>
//           ))}
//           <div className="flex gap-3 pt-2">
//             <Button variant="outline" className="flex-1 rounded-full">
//               Log In
//             </Button>
//             <Button className="flex-1 bg-[#5B6BBF] text-white rounded-full">
//               Sign Up
//             </Button>
//           </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </motion.header>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NavLinks } from "../navbar/NavLinks";
import { UserDropdown } from "../navbar/UserDropdown";
import { MobileMenu } from "../navbar/MobileMenu";
import { useGetMeQuery } from "@/redux/api/userApi";



// 👇 এটা তোমার আসল auth hook দিয়ে replace করো
function useAuth() {
  // const user = { name: "Rahim Uddin", email: "rahim@gmail.com", image: "" };
  const user = null
  const logout = async () => { };
  return { user, logout };
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data: session } = useGetMeQuery(undefined)
  console.log("Session in Navbar:", session);
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image src="/encore-nav.png" alt="encore" height={65} width={228} />
          </Link>

          {/* Desktop Nav Links */}
          <NavLinks />

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-[#5B6BBF] cursor-pointer">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#5B6BBF] hover:bg-[#4a5aa8] text-white rounded-full px-5 cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <MobileMenu
              user={user}
              onLogout={handleLogout}
              onClose={() => setMobileOpen(false)}
            />
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}