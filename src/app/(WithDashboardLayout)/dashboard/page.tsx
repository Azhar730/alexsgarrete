"use client";

import { TPlanBanner } from "@/app/component/dashboard";
import AppLayout from "@/app/component/dashboard/AppLayout";
import DogProfilesSection from "@/app/component/dashboard/DogProfilesSection";
import { PlanBannerSection } from "@/app/component/dashboard/PlanReadyCard";
import RecentActivity from "@/app/component/dashboard/RecentActivity";
import { useGetMeQuery } from "@/redux/api/userApi";


export default function DashboardPage() {
  const { data: user } = useGetMeQuery({});
  const firstName = user?.data?.fullName?.split(" ")[0] || user?.data?.name?.split(" ")[0] || "User";

  const banner: TPlanBanner = {
  title: "Your Plan is Ready",
  status: "Quote Ready" as const,
  description: "We've prepared your plan based on your information. Please review and accept to continue.",
  dogName: "Bella",
  dogBreed: "Golden Retriever",
  ctaLabel: "Check Quote",
  submittedDate: "April 14, 2026"
};

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
          Welcome back, {firstName}
        </h1>

        <PlanBannerSection banner={banner} />
        <DogProfilesSection />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
