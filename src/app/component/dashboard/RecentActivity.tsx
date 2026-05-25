"use client";

import { CreditCard, Shield, CheckCircle, Send, Bell, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetMyActivitiesQuery } from "@/redux/api/activityApi";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  QUOTE_RECEIVED: Send,
  PAYMENT_SUCCESS: CreditCard,
  MONTHLY_PREMIUM: Shield,
  ACCOUNT_STATUS_CHANGE: Bell,
};

const filterTabs = [
  { key: "ALL", label: "All" },
  { key: "QUOTE_RECEIVED", label: "Quotes" },
  { key: "PAYMENT_SUCCESS", label: "Payments" },
];

const ITEMS_PER_PAGE = 5;

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
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}

export default function RecentActivity() {
  const { data: activitiesResponse, isLoading } = useGetMyActivitiesQuery(undefined);
  const activities = dedupeActivities(activitiesResponse?.data || []);

  const [filter, setFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredActivities = useMemo(() => {
    if (filter === "ALL") return activities;
    return activities.filter((a: any) => a.type === filter);
  }, [activities, filter]);

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-bold text-secondary mb-4">Recent activity</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Updating activity feed...</p>
        </div>
      </section>
    );
  }

  if (activities.length === 0) {
    return (
      <section>
        <h2 className="text-xl font-bold text-secondary mb-4">Recent activity</h2>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-500 font-medium">No recent activity found.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-secondary">Recent activity</h2>
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors border",
                filter === tab.key
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {paginatedActivities.length > 0 ? (
          paginatedActivities.map((activity: any) => {
            const Icon = iconMap[activity.type] || Bell;
            const timeAgo = formatTimeAgo(new Date(activity.createdAt));
            
            return (
              <div key={activity.id} className="flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-default">
                <div
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5"
                >
                  <Icon size={15} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-base font-semibold text-secondary">{activity.title}</p>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">{timeAgo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {activity.message}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 font-medium">No activity found for this filter.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 bg-white rounded-xl border border-slate-200 p-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)} of {filteredActivities.length}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 text-xs font-semibold px-2"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <span className="text-xs font-semibold text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 text-xs font-semibold px-2"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
