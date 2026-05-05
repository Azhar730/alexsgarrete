"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { Bell, Menu, Search, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CreditCard, MessageSquare, Settings } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardHeader() {
  const { data: user, isLoading } = useGetMeQuery({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const userData = user?.data;
  const displayName = userData?.fullName || userData?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 w-full">
        {/* Mobile menu toggle */}
        <button 
          className="md:hidden p-2 -ml-2 text-slate-500 hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Search - Hidden on mobile */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button> */}
          
          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700 leading-none">
                {isLoading ? "Loading..." : displayName}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                {userData?.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
              {userData?.profilePicture || userData?.image ? (
                <Image src={userData.profilePicture || userData.image} alt={displayName} width={40} height={40} className="object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary">{initials}</span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar content */}
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
               <Image
                 src={'/dashboard-head.png'}
                 alt="Dashboard Logo"
                 width={140}
                 height={38}
               />
               <button 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="p-2 text-slate-500 hover:text-primary transition-colors"
               >
                 <X size={20} />
               </button>
            </div>

            <nav className="flex-1 py-4 px-2 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:text-primary hover:bg-primary/5"
                    )}
                  >
                    <Icon size={20} />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border border-amber-200">
                    {userData?.profilePicture || userData?.image ? (
                      <Image src={userData.profilePicture || userData.image} alt={displayName} width={40} height={40} />
                    ) : (
                      <span className="text-sm font-bold text-amber-700">{initials}</span>
                    )}
                 </div>
                 <div className="min-w-0">
                   <p className="text-sm font-semibold text-slate-700 truncate">{displayName}</p>
                   <p className="text-xs text-slate-400 truncate">{userData?.email}</p>
                 </div>
               </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
