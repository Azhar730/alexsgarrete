"use client";

import AppLayout from "@/app/component/dashboard/AppLayout";
import DogProfilesSection from "@/app/component/dashboard/DogProfilesSection";
import PlanReadyCard from "@/app/component/dashboard/PlanReadyCard";
import RecentActivity from "@/app/component/dashboard/RecentActivity";
import { useGetMeQuery } from "@/redux/api/userApi";


export default function DashboardPage() {
  const { data: user } = useGetMeQuery({});
  const firstName = user?.data?.fullName?.split(" ")[0] || user?.data?.name?.split(" ")[0] || "User";

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary mb-6">
          Welcome back, {firstName}
        </h1>

        <PlanReadyCard petName="Bella" breed="Golden Retriever" />
        <DogProfilesSection />
        <RecentActivity />
      </div>
    </AppLayout>
  );
}
