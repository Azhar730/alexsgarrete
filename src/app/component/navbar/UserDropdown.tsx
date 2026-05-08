"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type User = {
  name: string;
  email: string;
  image?: string;
  role?: string;
};

interface UserDropdownProps {
  user: User;
  onLogout: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const router = useRouter();
  const dashboardHref = user.role === "USER" ? "/dashboard" : "/dashboard";
  const dashboardLabel = user.role === "USER" ? "User Dashboard" : "Dashboard";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button className="rounded-full ring-transparent hover:ring-[#5B6BBF]/50 focus:outline-none focus-visible:ring-[#5B6BBF] transition-all duration-200">
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-white shadow-sm">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-[#5B6BBF] text-white text-base font-semibold">
              <User/>
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="center" 
        className="w-72 mt-0 p-1 shadow-xl border border-gray-100"
      >
        {/* User Info Section */}
        <div className="px-4 py-4 flex gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-[#5B6BBF] text-white text-lg font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col justify-center min-w-0">
            <p className="text-base font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1" />

        {/* Menu Items */}
        <DropdownMenuItem
          className="cursor-pointer px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50 rounded-md focus:bg-gray-50 transition-colors"
          onClick={() => router.push(dashboardHref)}
        >
          <LayoutDashboard className="mr-3 h-5 w-5 text-[#5B6BBF]" />
          {dashboardLabel}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="cursor-pointer px-4 py-3 text-[15px] font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-md transition-colors"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}