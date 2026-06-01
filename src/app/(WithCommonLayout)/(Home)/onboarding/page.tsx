"use client";

import { ProtectedRoute } from "@/app/component/shared/ProtectedRoute";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/redux/api/userApi";
import { ApplicationProvider } from "@/app/component/onboarding/application-context";
import { ApplicationFlow } from "@/app/component/onboarding/ApplicationFlow";
import { useGetMyApplicationsQuery, useStartApplicationMutation } from "@/redux/api/onboardingApi";
import type { ApplicationData, StepId } from "@/app/component/onboarding/application";
import { Loading } from "@/components/ui/Loading";

export default function ApplicationPage() {
  const { data: applicationsResponse, isLoading, isFetching } = useGetMyApplicationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: meResponse, isLoading: isLoadingMe, isFetching: isFetchingMe } = useGetMeQuery({}, { refetchOnMountOrArgChange: true });
  const [startApplication, { isLoading: isStartingApplication }] = useStartApplicationMutation();

  const userId = meResponse?.data?.id ?? meResponse?.id;
  const currentApplication = applicationsResponse?.data?.[0];
  const router = useRouter();
  const me = meResponse?.data ?? meResponse;

  useEffect(() => {
    if (currentApplication?.status === "UNDER_REVIEW") {
      router.push("/dashboard");
    }
  }, [currentApplication, router]);

  useEffect(() => {
    if (isLoadingMe || isLoading || isFetching || isFetchingMe || isStartingApplication) return;

    if (!currentApplication && me?.id) {
      startApplication({ userId: me.id, status: "DRAFT" }).catch((err) => {
        console.error("Failed to initialize draft application:", err);
      });
    }
  }, [currentApplication, isLoading, isLoadingMe, isFetching, isFetchingMe, isStartingApplication, me?.id, startApplication]);

  const isInitializingDraft = !currentApplication && !!me?.id;
  const hasData = !!applicationsResponse && !!meResponse;

  if (
    isLoading ||
    isLoadingMe ||
    (!hasData && (isFetching || isFetchingMe)) ||
    isInitializingDraft
  ) {
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
      healthDetails: currentApplication.questionnaire
        ? {
            ...currentApplication.questionnaire,
            hipaaAcknowledged: currentApplication.hipaaAccepted ? true : undefined,
          }
        : undefined,
    }
    : undefined;

  const isQuestionnaireComplete = currentApplication?.questionnaire?.questions
    ? (currentApplication.questionnaire.questions.length === 0 ||
       currentApplication.questionnaire.questions.every(
         (q: any) => q.answers && q.answers.length > 0
       ))
    : false;

  const initialStep: StepId = !currentApplication
    ? 1
    : !currentApplication.personInfo
      ? 1
      : !currentApplication.pets?.length
        ? 2
        : !currentApplication.representative
          ? 3
          : !isQuestionnaireComplete
            ? 4
            : 5;

  return (
    <ProtectedRoute>
      <ApplicationProvider initialData={initialData} initialStep={initialStep}>
        <ApplicationFlow application={currentApplication} />
      </ApplicationProvider>
    </ProtectedRoute>
  );
}
