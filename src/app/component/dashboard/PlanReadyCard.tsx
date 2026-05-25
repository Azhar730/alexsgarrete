// components/dashboard/PlanReadyCard.tsx

"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { TPlanBanner } from ".";

export type PlanStatus = "Quote Ready" | "In progress" | "Incomplete" | "Active" | "Rejected" | "Not Started";

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
    description: "We've prepared your plan based on your information. Please review and accept to continue.",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-600 border border-blue-200",
    label: "Quote Ready",
    ctaLabel: "Check Quote",
    ctaHref: "/dashboard/quote/review",
    showDogName: true,
    showDate: false,
  },
  "In progress": {
    title: "Application Under Review",
    description: "We're reviewing your information and preparing your personalized plan.",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-600 border border-amber-200",
    label: "In progress",
    ctaLabel: undefined,
    ctaHref: undefined,
    showDogName: true,
    showDate: true,
  },
  Incomplete: {
    title: "Application Incomplete",
    description: "You haven't finished your application yet. Get started from where you left off.",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-500 border border-red-200",
    label: "Incomplete",
    ctaLabel: "Continue",
    ctaHref: "/onboarding",
    showDogName: false,
    showDate: false,
  },
  "Not Started": {
    title: "Get Covered Today",
    description: "Start your application to get personalized insurance quotes for your pet.",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-600 border border-sky-200",
    label: "Not Started",
    ctaLabel: "Start Application",
    ctaHref: "/onboarding",
    showDogName: false,
    showDate: false,
  },
  Rejected: {
    title: "Application Declined",
    description: "Unfortunately, we are unable to approve your application at this time.",
    dot: "bg-slate-500",
    badge: "bg-slate-50 text-slate-600 border border-slate-200",
    label: "Declined",
    ctaLabel: "Contact Support",
    ctaHref: "/contact",
    showDogName: true,
    showDate: false,
  },
  Active: {
    title: "Your Coverage is Active",
    description: "Congratulations! Your pets are now covered. You can view your policy details and manage your plan below.",
    dot: "bg-green-500",
    badge: "bg-green-50 text-green-600 border border-green-200",
    label: "Active",
    ctaLabel: "View Policy",
    ctaHref: "/privacy-policy",
    showDogName: false,
    showDate: false,
  },
};


// ─── Component ─────────────────────────────────────────────────────────────

// Helper: Map application status to PlanStatus
function mapApplicationStatusToPlanStatus(applicationStatus?: string): PlanStatus {
  if (applicationStatus === "DRAFT") return "Incomplete";
  if (applicationStatus === "SUBMITTED" || applicationStatus === "UNDER_REVIEW") return "In progress";
  if (applicationStatus === "QUOTE_READY") return "Quote Ready";
  if (applicationStatus === "APPROVED") return "Quote Ready"; // Usually approved leads to quote
  if (applicationStatus === "REJECTED") return "Rejected";
  if (applicationStatus === "ACTIVE") return "Active";
  return "Quote Ready";
}

interface PlanBannerSectionProps {
  banner: TPlanBanner;
  applicationStatus?: string; // e.g., "DRAFT", "UNDER_REVIEW", "REJECTED", etc.
}

export function PlanBannerSection({ banner, applicationStatus }: PlanBannerSectionProps) {
  console.log(banner);
  console.log(applicationStatus);
  const router = useRouter();
  // Determine status based on applicationStatus or fall back to banner.status
  const status = applicationStatus ? mapApplicationStatusToPlanStatus(applicationStatus) : banner.status;
  console.log(status);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden mb-6 gap-4">
      {/* Decorative circles */}
      <div className="absolute right-28 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-slate-100/80 pointer-events-none hidden sm:block" />
      <div className="absolute right-16 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-slate-200/60 pointer-events-none hidden sm:block" />

      {/* Left — title + badge + description */}
      <div className="relative z-10 flex-1">
        <div className="flex flex-wrap items-center gap-2.5 mb-2 sm:mb-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{banner.title || cfg.title}</h2>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0",
              cfg.badge
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
            {cfg.label}
          </span>
        </div>
        <p className="text-[13px] text-slate-500">{banner.description || cfg.description}</p>
      </div>

      {/* Right — dog info + optional CTA */}
      <div className="relative z-10 flex flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto">
        {cfg.showDogName && (
          <span className="text-[12px] font-medium text-[#5C7FC4] sm:mt-0">
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

        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
          {banner.secondaryCtaLabel && (banner.secondaryCtaHref || banner.secondaryCtaAction) && (
            <button
              onClick={() => {
                if (banner.secondaryCtaAction) {
                  banner.secondaryCtaAction();
                } else if (banner.secondaryCtaHref) {
                  router.push(banner.secondaryCtaHref);
                }
              }}
              className="border w-full sm:w-auto border-[#5C7FC4] text-[#5C7FC4] hover:bg-slate-50 cursor-pointer active:bg-slate-100 text-[13px] font-semibold px-4 py-2.5 sm:py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap text-center"
            >
              {banner.secondaryCtaLabel}
            </button>
          )}

          {(banner.ctaLabel || cfg.ctaLabel) && (banner.ctaHref || cfg.ctaHref) && (
            <button
              onClick={() => router.push((banner.ctaHref || cfg.ctaHref)!)}
              className="bg-[#5C7FC4] w-full sm:w-auto cursor-pointer hover:bg-[#4A6BAF] active:bg-[#3D5A9C] text-white text-[13px] font-semibold px-4 py-2.5 sm:py-2 rounded-lg transition-colors shadow-sm whitespace-nowrap text-center"
            >
              {banner.ctaLabel || cfg.ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}