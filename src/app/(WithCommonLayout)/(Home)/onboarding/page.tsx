"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/userApi";
import { ApplicationProvider } from "@/app/component/onboarding/application-context";
import { ApplicationFlow } from "@/app/component/onboarding/ApplicationFlow";
import { useGetMyApplicationsQuery, useStartApplicationMutation } from "@/redux/api/onboardingApi";
import type { ApplicationData, StepId } from "@/app/component/onboarding/application";
import { Loading } from "@/components/ui/Loading";

export default function ApplicationPage() {
  const { data: applicationsResponse, isLoading } = useGetMyApplicationsQuery(undefined);
  const { data: meResponse, isLoading: isLoadingMe } = useGetMeQuery({}, { refetchOnMountOrArgChange: true });
  const [startApplication, { isLoading: isStartingApplication }] = useStartApplicationMutation();

  const currentApplication = applicationsResponse?.data?.[0];
  const router = useRouter();
  const me = meResponse?.data ?? meResponse;

  useEffect(() => {
    if (currentApplication?.status === "UNDER_REVIEW") {
      router.push("/dashboard");
    }
  }, [currentApplication, router]);

  useEffect(() => {
    if (isLoadingMe || isLoading || isStartingApplication) return;

    if (!currentApplication && me?.id) {
      startApplication({ userId: me.id, status: "DRAFT" }).catch((err) => {
        console.error("Failed to initialize draft application:", err);
      });
    }
  }, [currentApplication, isLoading, isLoadingMe, isStartingApplication, me?.id, startApplication]);

  const isInitializingDraft = !currentApplication && !!me?.id;

  if (isLoading || isLoadingMe || isInitializingDraft) {
    return (
      <Loading
        message="Preparing your application"
        subMessage="Connecting to secure servers..."
      />
    );
  }

  const initialData: ApplicationData | undefined = currentApplication
    ? {
      personalInfo: currentApplication.personInfo,
      dogs: currentApplication.pets,
      representative: currentApplication.representative,
      healthDetails: currentApplication.questionnaire ?? undefined,
    }
    : undefined;

  const initialStep: StepId = !currentApplication
    ? 1
    : !currentApplication.personInfo
      ? 1
      : !currentApplication.pets?.length
        ? 2
        : !currentApplication.representative
          ? 3
          : !currentApplication.questionnaire
            ? 4
            : 5;

  return (
    <ApplicationProvider initialData={initialData} initialStep={initialStep}>
      <ApplicationFlow application={currentApplication} />
    </ApplicationProvider>
  );
}
