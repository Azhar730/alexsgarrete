"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { ApplicationData, DogValues, HealthDetailsValues, PersonalInfoValues, RepresentativeValues, StepId } from "./application";
// import type {
//   ApplicationData,
//   PersonalInfoValues,
//   DogValues,
//   RepresentativeValues,
//   HealthDetailsValues,
//   StepId,
// } from "@/types/application";

interface ApplicationContextValue {
  currentStep: StepId;
  data: ApplicationData;
  goToStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  savePersonalInfo: (values: PersonalInfoValues) => void;
  saveDogs: (dogs: DogValues[]) => void;
  saveRepresentative: (values: RepresentativeValues) => void;
  saveHealthDetails: (values: HealthDetailsValues) => void;
  isStepComplete: (step: StepId) => boolean;
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null);

export function ApplicationProvider({
  children,
  initialData,
  initialStep = 1,
}: {
  children: ReactNode;
  initialData?: ApplicationData;
  initialStep?: StepId;
}) {
  const [currentStep, setCurrentStep] = useState<StepId>(initialStep);
  const [data, setData] = useState<ApplicationData>(initialData ?? {});

  const goToStep = useCallback((step: StepId) => setCurrentStep(step), []);

  const nextStep = useCallback(
    () => setCurrentStep((s) => (Math.min(s + 1, 5) as StepId)),
    []
  );

  const prevStep = useCallback(
    () => setCurrentStep((s) => (Math.max(s - 1, 1) as StepId)),
    []
  );

  const savePersonalInfo = useCallback((values: PersonalInfoValues) => {
    setData((d) => ({ ...d, personalInfo: values }));
  }, []);

  const saveDogs = useCallback((dogs: DogValues[]) => {
    setData((d) => ({ ...d, dogs }));
  }, []);

  const saveRepresentative = useCallback((values: RepresentativeValues) => {
    setData((d) => ({ ...d, representative: values }));
  }, []);

  const saveHealthDetails = useCallback((values: HealthDetailsValues) => {
    setData((d) => ({ ...d, healthDetails: values }));
  }, []);

  const isStepComplete = useCallback(
    (step: StepId) => {
      if (step === 1) return !!data.personalInfo;
      if (step === 2) return !!data.dogs?.length;
      if (step === 3) return !!data.representative;
      if (step === 4) {
        const hd = data.healthDetails;
        if (!hd) return false;
        if (hd.hipaaAcknowledged === true) return true;
        if (hd.questions && Array.isArray(hd.questions)) {
          if (hd.questions.length === 0) return true;
          return hd.questions.every((q: any) => q.answers && q.answers.length > 0);
        }
        return false;
      }
      return false;
    },
    [data]
  );

  return (
    <ApplicationContext.Provider
      value={{
        currentStep,
        data,
        goToStep,
        nextStep,
        prevStep,
        savePersonalInfo,
        saveDogs,
        saveRepresentative,
        saveHealthDetails,
        isStepComplete,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const ctx = useContext(ApplicationContext);
  if (!ctx)
    throw new Error("useApplication must be used inside ApplicationProvider");
  return ctx;
}
