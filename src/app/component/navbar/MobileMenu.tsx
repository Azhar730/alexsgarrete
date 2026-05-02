"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navLinks } from "./NavLinks";


type User = {
  name: string;
  email: string;
  image?: string;
};

interface MobileMenuProps {
  user: User | null;
  onLogout: () => void;
  onClose: () => void;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function MobileMenu({ user, onLogout, onClose }: MobileMenuProps) {
  const router = useRouter();

  return (
    <motion.div
      className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4"
      initial={{ opacity: 0, y: -8, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -8, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Nav Links */}
      {navLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="text-gray-700 font-medium hover:text-[#5B6BBF]"
          onClick={onClose}
        >
          {link.label}
        </Link>
      ))}

      {/* Auth Section */}
      {user ? (
        <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-3 pb-1">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-[#5B6BBF] text-white text-sm font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-full justify-start gap-2"
            onClick={() => { router.push("/dashboard"); onClose(); }}
          >
            <LayoutDashboard className="h-4 w-4 text-[#5B6BBF]" />
            Dashboard
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full justify-start gap-2 text-red-500 border-red-200 hover:bg-red-50"
            onClick={() => { onLogout(); onClose(); }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 pt-2">
          <Link href="/login" className="flex-1" onClick={onClose}>
            <Button variant="outline" className="w-full rounded-full">Log In</Button>
          </Link>
          <Link href="/signup" className="flex-1" onClick={onClose}>
            <Button className="w-full bg-[#5B6BBF] text-white rounded-full">Sign Up</Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}