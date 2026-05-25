"use client";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { UserDropdown } from "@/app/component/navbar/UserDropdown";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useLogoutMutation } from "@/redux/api/authApi";
import { useDispatch } from "react-redux";
import { logout as clearAuth } from "@/redux/features/authSlice";
import { baseApi } from "@/redux/api/baseApi";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "/about-us" },
];

export function Header() {
  const scrolled = useScroll(10);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logout] = useLogoutMutation();
  const { data: userResponse, isLoading, isFetching } = useGetMeQuery({});
  const userData = userResponse?.data ?? userResponse;
  const user = !isLoggedOut && userData
    ? {
        name: userData.fullName ?? userData.name ?? "User",
        email: userData.email ?? "",
        image: userData.avatarUrl ?? userData.profilePicture ?? userData.image ?? undefined,
        role: userData.role,
      }
    : null;

  // const user = null;
  const handleLogout = async () => {
    if (isLoggingOut) return;
    const start = Date.now();
    setIsLoggedOut(true);
    setIsLoggingOut(true);
    try {
      await logout({}).unwrap();
      // Immediately clear local auth and cached queries so guest CTAs appear without refresh
      dispatch(clearAuth());
      dispatch(baseApi.util.resetApiState());
      const elapsed = Date.now() - start;
      const seconds = (elapsed / 1000).toFixed(2);
      toast.success(`Logged out successfully `);
      router.push("/");
    } catch {
      setIsLoggedOut(false);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  const isAuthLoading = !isLoggedOut && !isLoggingOut && (isLoading || isFetching);
  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-500 ease-in-out">
      <div
        className={cn(
          "mx-auto w-full transition-all duration-500 ease-in-out flex justify-center",
          scrolled ? "pt-2 px-2 md:pt-4 md:px-4" : "pt-0 px-0",
        )}
      >
        <div
          className={cn(
            "bg-white/90 backdrop-blur-md transition-all duration-500 ease-in-out flex flex-col justify-center",
            scrolled
              ? "w-[95%] max-w-6xl rounded-full shadow-lg  "
              : "w-full max-w-full rounded-none   border-x-0 border-t-0",
          )}
        >
          <nav
            className={cn(
              "container mx-auto flex w-full items-center justify-between px-4 transition-all duration-500 ease-in-out relative",
              scrolled ? "h-16 md:px-8" : "h-24",
            )}
          >
            {/* Logo Container */}
            <div className="flex-1">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src={"/encore-nav.png"}
                  alt="encore"
                  height={65}
                  width={228}
                  className={cn(
                    "w-auto transition-all duration-500 ease-in-out",
                    scrolled ? "h-11" : "h-12 md:h-16",
                  )}
                />
              </Link>
            </div>

            {/* Centered Navigation */}
            <div className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  className={cn(
                    poppins.className,
                    "text-gray-600 hover:text-[#5B6BBF] text-lg transition-colors font-medium  bg-transparent hover:bg-transparent px-0",
                  )}
                  render={<Link href={link.href} />}
                  nativeButton={false}
                >
                  {link.label}
                </Button>
              ))}
            </div>

            {/* Right CTA Container */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthLoading ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-24 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
                </div>
              ) : user && !isLoggedOut && !isLoggingOut ? (
                <UserDropdown user={user} onLogout={handleLogout} />
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-gray-700 hover:text-[#5B6BBF] cursor-pointer text-lg p-5"
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Signing out..." : "Log In"}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-primary text-white rounded-full p-5 cursor-pointer text-lg" disabled={isLoggingOut}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex-1 flex justify-end">
              <MobileNav />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
