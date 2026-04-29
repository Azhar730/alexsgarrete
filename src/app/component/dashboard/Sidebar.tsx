"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-60 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="h-16 flex items-center px-4">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={'/dashboard-head.png'}
            alt="Dashboard Logo"
            width={200}
            height={55}
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary/60 text-secondary"
                  : "text-muted-foreground hover:text-secondary hover:bg-primary/60"
              )}
            >
              <Icon
                size={16}
                className={cn(active ? "text-secondary hover:text-secondary" : "text-muted-foreground hover:text-secondary")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            <span className="text-xs font-bold text-amber-800">SJ</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-400 truncate">sarah.j@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
