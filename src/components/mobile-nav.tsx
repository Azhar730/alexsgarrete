import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon, Loader2, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

interface MobileNavProps {
	user?: any;
	isAuthLoading?: boolean;
	onLogout?: () => void;
}

export function MobileNav({ user, isAuthLoading, onLogout }: MobileNavProps) {
	const [open, setOpen] = React.useState(false);

	const dashboardHref = user?.role === "ADMIN" ? "/admin" : "/dashboard";
	const dashboardLabel = user?.role === "ADMIN" ? "Admin Dashboard" : "User Dashboard";

	const getInitials = (name: string) => {
		return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";
	};

	return (
		<div className="lg:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Toggle menu"
				className="lg:hidden text-gray-600 bg-transparent hover:bg-transparent border-none"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<XIcon className="size-6" />
				) : (
					<MenuIcon className="size-6" />
				)}
			</Button>
			{open && (
				<Portal className="top-20 lg:hidden" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-6 bg-white border-t border-gray-100 flex flex-col"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => (
								<Button className={cn(poppins.className, "justify-start text-gray-700 font-medium text-lg hover:text-[#5B6BBF] hover:bg-transparent px-0")} key={link.label} variant="ghost" render={<Link href={link.href} />} onClick={() => setOpen(false)} nativeButton={false}>
									{link.label}
								</Button>
							))}
						</div>
						
						{isAuthLoading ? (
							<div className="mt-6 flex justify-center">
								<Loader2 className="w-6 h-6 animate-spin text-slate-400" />
							</div>
						) : !user ? (
							<div className="mt-6 flex gap-3">
								<Button 
									className={cn(poppins.className, "flex-1 rounded-full h-12 text-base border-gray-200 text-gray-700 hover:text-[#85A1D1] hover:bg-gray-50")} 
									variant="outline" 
									onClick={() => setOpen(false)}
									render={<Link href="/login" />}
									nativeButton={false}
								>
									Log In
								</Button>
								<Button 
									className={cn(poppins.className, "flex-1 rounded-full h-12 text-base bg-[#85A1D1] hover:bg-[#7a95c4] text-white border-transparent shadow-sm")} 
									onClick={() => setOpen(false)}
									render={<Link href="/signup" />}
									nativeButton={false}
								>
									Sign Up
								</Button>
							</div>
						) : null}
					</div>
				</Portal>
			)}
		</div>
	);
}
