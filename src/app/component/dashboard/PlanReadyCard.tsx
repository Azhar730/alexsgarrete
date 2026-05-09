// components/dashboard/PlanReadyCard.tsx

"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { TPlanBanner } from ".";

export type PlanStatus = "Quote Ready" | "In progress" | "Incomplete";

export interface PlanBanner {
  status: PlanStatus;
  dogName: string;
  dogBreed: string;
  petCount?: number; // total number of pets in quote
  submittedDate?: string; // only for "In progress"
}

// ─── Static config per status ──────────────────────────────────────────────

const STATUS_CONFIG: Record<
  PlanStatus,
  {
    title: string;
    description: string;
    dot: string;
    badge: string;
    label: string;
    ctaLabel?: string;
    ctaHref?: string;
    showDogName: boolean;
    showDate: boolean;
  }
> = {
  "Quote Ready": {
    title: "Your Plan is Ready",
    description:
      "We've prepared your plan based on your information. Please review and accept to continue.",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-600 border border-blue-200",
    label: "Quote Ready",
    ctaLabel: "Check Quote",
    ctaHref: "/dashboard/quote/review",       // ← adjust to your real route
    showDogName: true,
    showDate: false,
  },
  "In progress": {
    title: "Application Under Review",
    description:
      "We're reviewing your information and preparing your personalized plan.",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    label: "In progress",
    ctaLabel: undefined,               // no button for this state
    ctaHref: undefined,
    showDogName: true,
    showDate: true,
  },
  Incomplete: {
    title: "Application Incomplete",
    description:
      "You haven't finished your application yet. Get started from where you left off.",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-500 border border-red-200",
    label: "Incomplete",
    ctaLabel: "Continue",
    ctaHref: "/onboarding",  // ← adjust to your real route
    showDogName: false,
    showDate: false,
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

// Helper: Map application status to PlanStatus
function mapApplicationStatusToPlanStatus(applicationStatus?: string): PlanStatus {
  if (applicationStatus === "DRAFT") return "Incomplete";
  if (applicationStatus === "UNDER_REVIEW") return "In progress";
  if (applicationStatus === "QUOTED") return "Quote Ready";
  return "Quote Ready";
}

interface PlanBannerSectionProps {
  banner: TPlanBanner;
  applicationStatus?: string; // e.g., "DRAFT", "UNDER_REVIEW", "REJECTED", etc.
}

export function PlanBannerSection({ banner, applicationStatus }: PlanBannerSectionProps) {
  const router = useRouter();
  // Determine status based on applicationStatus or fall back to banner.status
  const status = applicationStatus ? mapApplicationStatusToPlanStatus(applicationStatus) : banner.status;
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between overflow-hidden mb-6">
      {/* Decorative circles */}
      <div className="absolute right-28 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-slate-100/80 pointer-events-none" />
      <div className="absolute right-16 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-200/60 pointer-events-none" />

      {/* Left — title + badge + description */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-1.5">
          <h2 className="text-xl font-bold text-slate-900">{cfg.title}</h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full",
              cfg.badge
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
          </span>
        </div>
        <p className="text-[13px] text-slate-500">{cfg.description}</p>
      </div>

      {/* Right — dog info + optional CTA */}
      <div className="relative z-10 flex flex-col items-end gap-2 shrink-0 ml-6">
        {cfg.showDogName && (
          <span className="text-[12px] font-medium text-[#5C7FC4]">
            {banner.petCount && banner.petCount > 1 
              ? `${banner.petCount} Pets` 
              : `${banner.dogName} (${banner.dogBreed})`
            }
          </span>
        )}

        {cfg.showDate && banner.submittedDate && (
          <span className="text-[12px] text-slate-400">
            Submitted on {banner.submittedDate}
          </span>
        )}

        {cfg.ctaLabel && cfg.ctaHref && (
          <button
            onClick={() => router.push(cfg.ctaHref!)}
            className="bg-[#5C7FC4] cursor-pointer hover:bg-[#4A6BAF] active:bg-[#3D5A9C] text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            {cfg.ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
}