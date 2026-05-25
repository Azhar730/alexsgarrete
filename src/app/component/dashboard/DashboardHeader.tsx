"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { Bell, Menu, Search, X, LayoutDashboard, CreditCard, MessageSquare, Settings, Shield, Send, Loader2, Check, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGetMyActivitiesQuery, useMarkActivityAsReadMutation, useClearAllActivitiesMutation, useDeleteActivityMutation } from "@/redux/api/activityApi";

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

const activityIconMap: Record<string, any> = {
  QUOTE_RECEIVED: Send,
  PAYMENT_SUCCESS: CreditCard,
  MONTHLY_PREMIUM: Shield,
  ACCOUNT_STATUS_CHANGE: Bell,
  NEW_MESSAGE: MessageSquare,
};

const dedupeActivities = (items: any[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const signature = [
      item.id ?? "",
      item.type ?? "",
      item.title ?? "",
      item.message ?? "",
      item.createdAt ? new Date(item.createdAt).toISOString() : "",
    ].join("|");

    if (seen.has(signature)) {
      return false;
    }

    seen.add(signature);
    return true;
  });
};

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
}

export default function DashboardHeader() {
  const { data: user, isLoading } = useGetMeQuery({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();

  const { data: activitiesResponse, isLoading: isLoadingActivities } = useGetMyActivitiesQuery(undefined);
  const [markAsRead] = useMarkActivityAsReadMutation();
  const [clearAll] = useClearAllActivitiesMutation();
  const [deleteActivity] = useDeleteActivityMutation();

  const activities = dedupeActivities(activitiesResponse?.data || []);
  const unreadActivities = activities.filter((a: any) => !a.isRead);
  const hasUnread = unreadActivities.length > 0;

  const handleMarkAllAsRead = async () => {
    try {
      await Promise.all(unreadActivities.map((a: any) => markAsRead(a.id).unwrap()));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark activity as read", err);
    }
  };

  const handleClearAll = async () => {
    try {
      await clearAll(undefined).unwrap();
    } catch (err) {
      console.error("Failed to clear all activities", err);
    }
  };

  const handleDeleteActivity = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteActivity(id).unwrap();
    } catch (err) {
      console.error("Failed to delete activity", err);
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
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-full transition-colors relative focus:outline-none"
              aria-label="View notifications"
            >
              <Bell size={20} />
              {hasUnread && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                  {unreadActivities.length}
                </span>
              )}
            </button>

            {/* Dropdown Card */}
            {isNotificationsOpen && (
              <>
                {/* Backdrop to close click-outside */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-xl shadow-xl z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      Notifications
                      {hasUnread && (
                        <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadActivities.length} new
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2.5">
                      {hasUnread && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-primary hover:text-primary-hover font-semibold flex items-center gap-0.5 focus:outline-none"
                        >
                          <Check size={11} />
                          Mark read
                        </button>
                      )}
                      {activities.length > 0 && (
                        <button
                          onClick={handleClearAll}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-0.5 focus:outline-none"
                        >
                          <Trash2 size={11} />
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Body List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50" data-lenis-prevent>
                    {isLoadingActivities ? (
                      <div className="flex items-center justify-center p-8 gap-2">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <span className="text-xs text-slate-400 font-medium">Loading notifications...</span>
                      </div>
                    ) : activities.length > 0 ? (
                      activities.map((activity: any) => {
                        const Icon = activityIconMap[activity.type] || Bell;
                        const timeAgo = formatTimeAgo(new Date(activity.createdAt));
                        return (
                          <div
                            key={activity.id}
                            onClick={() => handleMarkAsRead(activity.id)}
                            className={cn(
                              "flex gap-3 p-4 transition-colors cursor-pointer hover:bg-slate-50/50 text-left relative group",
                              !activity.isRead ? "bg-primary/5" : "opacity-75"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                              !activity.isRead ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                            )}>
                              <Icon size={14} className={!activity.isRead ? "text-white" : "text-slate-500"} />
                            </div>
                            <div className="min-w-0 flex-1 pr-6">
                              <div className="flex items-start justify-between gap-1.5">
                                <p className={cn("text-xs font-semibold text-slate-800 leading-snug", !activity.isRead ? "font-bold" : "")}>
                                  {activity.title}
                                </p>
                                <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{timeAgo}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal truncate">
                                {activity.message}
                              </p>
                            </div>
                            
                            {/* Actions container on the right */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              {!activity.isRead && (
                                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                              )}
                              <button
                                onClick={(e) => handleDeleteActivity(e, activity.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors focus:outline-none"
                                title="Dismiss notification"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-xs text-slate-400 font-medium">No new notifications</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
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
        <div className="fixed inset-0 z-60 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Sidebar content */}
          <aside className="absolute inset-y-0 left-0 w-70 bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
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
                const active = isActiveRoute(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
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
