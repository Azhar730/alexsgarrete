"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApplicationProvider } from "@/app/component/onboarding/application-context";
import { ApplicationFlow } from "@/app/component/onboarding/ApplicationFlow";
import { useGetMyApplicationsQuery } from "@/redux/api/onboardingApi";
import type { ApplicationData, StepId } from "@/app/component/onboarding/application";

export default function ApplicationPage() {
  const { data: applicationsResponse } = useGetMyApplicationsQuery(undefined);

  const currentApplication = applicationsResponse?.data?.[0];
  const router = useRouter();

  useEffect(() => {
    if (currentApplication?.status === "UNDER_REVIEW") {
      router.push("/dashboard");
    }
  }, [currentApplication, router]);
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
