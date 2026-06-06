"use client";

import AppLayout from "@/app/component/dashboard/AppLayout";
import PasswordForm from "@/app/component/dashboard/PasswordForm";
import ProfileForm from "@/app/component/dashboard/ProfileForm";
import RepresentativeSection from "@/app/component/dashboard/RepresentativeSection";
import { useGetMyApplicationsQuery } from "@/redux/api/onboardingApi";

export default function SettingsPage() {
  const { data: applicationsResponse, refetch: refetchApplications } = useGetMyApplicationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const currentApplication = applicationsResponse?.data?.[0];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary">Settings</h1>
          <p className="text-base text-muted-foreground mt-1.5">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="space-y-5">
          <ProfileForm />
          <PasswordForm />

          {currentApplication?.representative && (
            <RepresentativeSection
              applicationId={currentApplication.id}
              representative={currentApplication.representative}
              refetchApplications={refetchApplications}
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
