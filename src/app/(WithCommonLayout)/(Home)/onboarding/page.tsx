"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ApplicationProvider } from "@/app/component/onboarding/application-context";
import { ApplicationFlow } from "@/app/component/onboarding/ApplicationFlow";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyApplicationsQuery, useStartApplicationMutation } from "@/redux/api/onboardingApi";
import type { ApplicationData, StepId } from "@/app/component/onboarding/application";
import { Loading } from "@/components/ui/Loading";

export default function ApplicationPage() {
  const { data: meResponse, isLoading: isLoadingMe } = useGetMeQuery({});
  const { data: applicationsResponse, isLoading } = useGetMyApplicationsQuery(undefined);
  const [startApplication, { isLoading: isStartingApplication }] = useStartApplicationMutation();
  const bootstrappedRef = useRef(false);

  const userId = meResponse?.data?.id ?? meResponse?.id;
  const currentApplication = applicationsResponse?.data?.[0];
  const router = useRouter();

  useEffect(() => {
    if (currentApplication?.status === "UNDER_REVIEW") {
      router.push("/dashboard");
    }
  }, [currentApplication, router]);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    if (isLoadingMe || isLoading) return;
    if (!userId || currentApplication) return;

    bootstrappedRef.current = true;
    startApplication({
      userId,
      status: "DRAFT",
    }).unwrap().catch((error) => {
      console.error("Failed to auto-start application:", error);
      bootstrappedRef.current = false;
    });
  }, [currentApplication, isLoading, isLoadingMe, startApplication, userId]);

  if (isLoading || isLoadingMe || isStartingApplication) {
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
