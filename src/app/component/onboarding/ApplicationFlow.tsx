"use client";

import { useApplication } from "./application-context";
import { ApplicationSidebar } from "./ApplicationSidebar";
import { CheckCircle2 } from "lucide-react";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepDogInformation } from "./StepDogInformation";
import { StepRepresentative } from "./StepRepresentative";
import { StepHealthDetails } from "@/app/component/onboarding/StepHealthDetails";
import { StepReview } from "./StepReview";
import type {
  DogsStepValues,
  PersonalInfoValues,
  RepresentativeValues,
} from "./application";

type OnboardingApplication = {
  id?: string;
  personInfo?: Partial<PersonalInfoValues>;
  pets?: Partial<DogsStepValues>["dogs"];
  representative?: Partial<RepresentativeValues>;
  questionnaire?: Record<string, unknown>;
  hipaaAccepted?: boolean;
};

// Success toast shown after signup
function SuccessBanner() {
  return (
    <div className="flex items-center gap-2 bg-emerald-500 text-white text-sm font-medium px-4 py-3 rounded-lg mb-4 shadow-sm">
      <CheckCircle2 className="w-4 h-4 shrink-0" />
      Account created successfully! Please complete your application below.
    </div>
  );
}

export function ApplicationFlow({ application }: { application?: OnboardingApplication }) {
  const { currentStep } = useApplication();
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPersonalInfo application={application} />;
      case 2:
        return <StepDogInformation applicationId={application?.id} pets={application?.pets} />;
      case 3:
        return <StepRepresentative representativeInfo={application?.representative} applicationId={application?.id} />;
      case 4:
        return <StepHealthDetails MyGivenAnswareQuestionnaire={application?.questionnaire} applicationId={application?.id} hipaaAccepted={application?.hipaaAccepted}  />;
      case 5:
        return <StepReview applicationId={application?.id} />;
      default:
        return <StepPersonalInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Page content */}
      <div className="flex flex-1 max-w-full mx-auto w-full px-4 py-8 gap-8">
        {/* Sidebar */}
        <ApplicationSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Success banner (step 1 only) */}
          {currentStep === 1 && <SuccessBanner />}

          {/* Step card */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-6 py-6">
            {renderStep()}
          </div>
        </main>
      </div>
    </div>
  );
}
