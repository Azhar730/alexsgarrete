"use client";

import { TPlanBanner } from "@/app/component/dashboard";
import AppLayout from "@/app/component/dashboard/AppLayout";
import DogProfilesSection from "@/app/component/dashboard/DogProfilesSection";
import { PlanBannerSection } from "@/app/component/dashboard/PlanReadyCard";
import RecentActivity from "@/app/component/dashboard/RecentActivity";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyApplicationsQuery, useGetMyQuotesQuery } from "@/redux/api/onboardingApi";


export default function DashboardPage() {
  const { data: user } = useGetMeQuery({});
  const { data: applicationsResponse } = useGetMyApplicationsQuery(undefined);
  const { data: quotesResponse } = useGetMyQuotesQuery(undefined);
  const firstName = user?.data?.fullName?.split(" ")[0] || user?.data?.name?.split(" ")[0] || "User";

  const currentApplication = applicationsResponse?.data?.[0];
  const quotes = quotesResponse?.data;
  const hasQuotes = quotes && quotes.length > 0;
  
  // Get first dog from quotes if available, otherwise from application
  const firstQuote = hasQuotes ? quotes[0] : null;
  const quotePetCount = firstQuote?.quotes?.length || 0;
  const firstDogFromQuote = firstQuote?.quotes?.[0]?.pet;
  const firstDogFromApplication = currentApplication?.pets?.[0];
  const firstDog = firstDogFromQuote || firstDogFromApplication;

  const submittedDate = currentApplication?.updatedAt 
    ? new Date(currentApplication.updatedAt).toLocaleDateString("en-US", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      })
    : undefined;

  // Determine application status to pass: prioritize quotes, then application status
  const displayStatus = hasQuotes ? "QUOTED" : currentApplication?.status;

  const banner: TPlanBanner = {
    title: "Your Plan is Ready",
    status: "Quote Ready" as const,
    description: "We've prepared your plan based on your information. Please review and accept to continue.",
    dogName: firstDog?.name || "Your Pet",
    dogBreed: firstDog?.primaryBreed || "Unknown Breed",
    petCount: quotePetCount > 0 ? quotePetCount : undefined,
    ctaLabel: "Check Quote",
    submittedDate,
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
          Welcome back, {firstName}
        </h1>

        <PlanBannerSection banner={banner} applicationStatus={displayStatus} />
        <DogProfilesSection applicationId={currentApplication?.id} />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
