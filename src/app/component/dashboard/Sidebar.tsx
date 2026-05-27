"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CreditCard, MessageSquare, Settings, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMeQuery, useLogoutMutation } from "@/redux/api/userApi";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { logout as clearAuth } from "@/redux/features/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: user } = useGetMeQuery({});
  const [logout] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout(undefined).unwrap();
      dispatch(clearAuth());
      dispatch(baseApi.util.resetApiState());
      router.replace("/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const userData = user?.data;
  const displayName = userData?.fullName || userData?.name || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-60 bg-white border-r border-slate-100">
      {/* Logo */}
      <div className="h-16 flex items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-1">
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
          const active = isActiveRoute(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded text-lg font-medium transition-all",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/10"
              )}
            >
              <Icon
                size={16}
                className={cn(active ? "text-primary hover:text-primary" : "text-muted-foreground hover:text-primary")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-slate-100">
     
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full px-3 py-2.5 mx-2 mb-2 flex items-center gap-2.5 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
