"use client";

import { CreditCard, Shield, CheckCircle, Send, Bell, Loader2 } from "lucide-react";
import { useGetMyActivitiesQuery } from "@/redux/api/activityApi";

const iconMap: Record<string, any> = {
  QUOTE_RECEIVED: Send,
  PAYMENT_SUCCESS: CreditCard,
  MONTHLY_PREMIUM: Shield,
  ACCOUNT_STATUS_CHANGE: Bell,
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
  const activities = activitiesResponse?.data || [];

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
      <h2 className="text-xl font-bold text-secondary mb-4">Recent activity</h2>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {activities.map((activity: any) => {
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
        })}
      </div>
    </section>
  );
}
