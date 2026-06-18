"use client";

import { TPlanBanner } from "@/app/component/dashboard";
import AppLayout from "@/app/component/dashboard/AppLayout";
import DogProfilesSection from "@/app/component/dashboard/DogProfilesSection";
import { PlanBannerSection } from "@/app/component/dashboard/PlanReadyCard";
import RecentActivity from "@/app/component/dashboard/RecentActivity";
import { useGetMeQuery } from "@/redux/api/userApi";
import { Loader2 } from "lucide-react";
import { useGetMyApplicationsQuery, useGetMyQuotesQuery } from "@/redux/api/onboardingApi";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";
import { useGetMyAgreementsQuery } from "@/redux/api/agreementApi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function DashboardPage() {
  const POLL_INTERVAL = 10000; // 10 seconds
  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useGetMeQuery({}, { refetchOnMountOrArgChange: true, pollingInterval: POLL_INTERVAL });
  const { data: applicationsResponse, isLoading: isLoadingApps, refetch: refetchApplications } = useGetMyApplicationsQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: POLL_INTERVAL });
  const { data: quotesResponse, isLoading: isLoadingQuotes, refetch: refetchQuotes } = useGetMyQuotesQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: POLL_INTERVAL });
  const { data: paymentsResponse, isLoading: isLoadingPayments, refetch: refetchPayments } = useGetMyPaymentsQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: POLL_INTERVAL });
  const { data: agreementsResponse, isLoading: isLoadingAgreements, refetch: refetchAgreements } = useGetMyAgreementsQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: POLL_INTERVAL });
  const router = useRouter();
  const isLoading = isLoadingUser || isLoadingApps || isLoadingQuotes || isLoadingPayments || isLoadingAgreements;
  const firstName = user?.data?.fullName?.split(" ")[0] || user?.data?.name?.split(" ")[0] || "User";

  const currentApplication = applicationsResponse?.data?.[0];
  const quotes = quotesResponse?.data;
  const payments = paymentsResponse?.data || [];
  const agreements = agreementsResponse?.data || [];
  // Find quotes that haven't been paid for yet
  let unpaidQuotes = quotes?.filter((quoteGroup: any) => {
    const isPaid = payments.some((p: any) => {
      const status = p.status?.toUpperCase();
      const isSuccess = status === "SUCCESS" || status === "PAID";
      const matchesGroup = p.quoteId === quoteGroup.quoteGroupId;
      const matchesIndividual = quoteGroup.quotes?.some((q: any) =>
        q.id === p.quoteId || q.petId === p.quoteInfo?.pet?.id || q.pet?.id === p.quoteInfo?.pet?.id
      );
      return isSuccess && (matchesGroup || matchesIndividual);
    });

    const hasActivePet = quoteGroup.quotes?.some((q: any) => q.pet?.status === "ACTIVE");
    return !isPaid && !hasActivePet;
  });

  // If there is an accepted quote group, filter out any other unaccepted quote groups that share any of the same pets
  if (unpaidQuotes && unpaidQuotes.length > 1) {
    const acceptedQuoteGroup = unpaidQuotes.find((q: any) => q.isAccepted);
    if (acceptedQuoteGroup) {
      const acceptedPetIds = new Set(acceptedQuoteGroup.quotes?.map((q: any) => q.petId || q.pet?.id));
      unpaidQuotes = unpaidQuotes.filter((quoteGroup: any) => {
        if (quoteGroup.quoteGroupId === acceptedQuoteGroup.quoteGroupId) return true;
        const hasSharedPet = quoteGroup.quotes?.some((q: any) => acceptedPetIds.has(q.petId || q.pet?.id));
        return !hasSharedPet;
      });
    }
  }

  const submittedDate = currentApplication?.updatedAt
    ? new Date(currentApplication.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
    : undefined;

  // Refetch data when page becomes visible (e.g., returning from onboarding)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Page became visible, refetching data...");
        refetchUser();
        refetchApplications();
        refetchQuotes();
        refetchPayments();
        refetchAgreements();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetchUser, refetchApplications, refetchQuotes, refetchPayments, refetchAgreements]);

  // Build banners array
  const banners: TPlanBanner[] = [];

  // Determine if application is submitted
  const isSubmitted = currentApplication?.status && !["DRAFT", "IN_PROGRESS"].includes(currentApplication.status);

  // 1. Add "Active" banner only when current application has active pets
  // and at least one successful payment tied to the current application.
  const hasActivePetStatus = currentApplication?.pets?.some((p: any) => p.status === "ACTIVE");
  const hasSuccessfulPaymentForCurrentApplication = payments.some((p: any) => {
    const status = p.status?.toUpperCase();
    const isSuccess = status === "SUCCESS" || status === "PAID";
    const sameApplicationByPet = p.quoteInfo?.pet?.applicationId === currentApplication?.id;
    const sameApplicationByQuote = quotes?.some((group: any) =>
      group.quotes?.some((q: any) => q.id === p.quoteId && q.pet?.applicationId === currentApplication?.id)
    );
    return isSuccess && (sameApplicationByPet || sameApplicationByQuote);
  });

  if (hasActivePetStatus && hasSuccessfulPaymentForCurrentApplication) {
    banners.push({
      title: "Your Coverage is Active",
      status: "Active",
      description: "Congratulations! Your pets are now covered. You can view your policy details below.",
      dogName: currentApplication.pets?.[0]?.name || "Your Pet",
      dogBreed: currentApplication.pets?.[0]?.primaryBreed || "Unknown Breed",
      ctaLabel: "View Policy",
    });
  }

  // 2. Add "Quote Ready" banners ONLY if submitted and not rejected
  if (isSubmitted && currentApplication?.status !== "REJECTED") {
    unpaidQuotes?.forEach((quoteGroup: any) => {
      if (quoteGroup.isRejected) return; // Skip showing banner if quote is rejected
      
      const firstDog = quoteGroup.quotes?.[0]?.pet;
      const isAccepted = quoteGroup.isAccepted;

      const hasSignedThisQuote = agreements.some((a: any) =>
        a.isSigned === true && (
          a.quoteId === quoteGroup.quoteGroupId ||
          quoteGroup.quotes?.some((pq: any) => pq.id === a.quoteId)
        )
      );

      let ctaLabel = "Check Quote";
      let ctaHref = `/dashboard/quote/review?quoteGroupId=${encodeURIComponent(quoteGroup.quoteGroupId)}`;
      let title = "Your Plan is Ready";
      let description = "We've prepared your plan based on your information. Please review and accept to continue.";

      if (isAccepted) {
        if (hasSignedThisQuote) {
          title = "Complete Payment";
          description = "You've signed the agreement! Please complete the final payment step to activate your coverage.";
          ctaLabel = "Pay Now";
          ctaHref = `/dashboard/quote/payment?quoteGroupId=${encodeURIComponent(quoteGroup.quoteGroupId)}`;
        } else {
          title = "Sign Agreement";
          description = "You've accepted your plan. Please sign the final agreement to proceed to payment.";
          ctaLabel = "Sign Now";
          ctaHref = `/dashboard/quote/agreement?quoteGroupId=${encodeURIComponent(quoteGroup.quoteGroupId)}`;
        }
      }

      banners.push({
        title,
        status: "Quote Ready",
        description,
        dogName: firstDog?.name || "Your Pet",
        dogBreed: firstDog?.primaryBreed || "Unknown Breed",
        petCount: quoteGroup.quotes?.length || 0,
        ctaLabel,
        ctaHref,
        submittedDate,
      });
    });
  }

  // 3. Fallback: If no quotes and application is in review/submitted
  if (banners.length === 0 && (currentApplication?.status === "UNDER_REVIEW" || currentApplication?.status === "SUBMITTED" || currentApplication?.status === "APPROVED")) {
    banners.push({
      title: currentApplication?.status === "APPROVED" ? "Application Approved" : "Application Under Review",
      status: "In progress",
      description: currentApplication?.status === "APPROVED"
        ? "Your application has been approved! We are currently preparing your personalized quotes."
        : "We're reviewing your information and preparing your personalized plan.",
      dogName: currentApplication.pets?.[0]?.name || "Your Pet",
      dogBreed: currentApplication.pets?.[0]?.primaryBreed || "Unknown Breed",
      submittedDate,
    });
  }

  // 4. Fallback: If in Draft or In Progress (Not yet submitted)
  if (banners.length === 0 && (currentApplication?.status === "DRAFT" || currentApplication?.status === "IN_PROGRESS")) {
    banners.push({
      title: "Application Incomplete",
      status: "Incomplete",
      description: "You haven't finished your application yet. Get started from where you left off.",
      dogName: currentApplication.pets?.[0]?.name || "Your Pet",
      dogBreed: currentApplication.pets?.[0]?.primaryBreed || "Unknown Breed",
      ctaLabel: "Continue",
    });
  }

  // 5. Fallback: If Rejected
  if (banners.length === 0 && currentApplication?.status === "REJECTED") {
    banners.push({
      title: "Application Declined",
      status: "Rejected",
      description: "Unfortunately, we are unable to approve your application at this time.",
      dogName: currentApplication.pets?.[0]?.name || "Your Pet",
      dogBreed: currentApplication.pets?.[0]?.primaryBreed || "Unknown Breed",
      ctaLabel: "Contact Support",
      ctaHref: "https://k9encore.com/contact-us",
    });
  }

  console.log("Final Banners Data:", {
    bannersCount: banners.length,
    status: currentApplication?.status,
    unpaidQuotesCount: unpaidQuotes?.length,
    banners
  });

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
          Welcome back, {firstName}
        </h1>

        {banners.map((b, idx) => (
          <PlanBannerSection key={idx} banner={b} />
        ))}
        <DogProfilesSection applicationId={currentApplication?.id} />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
