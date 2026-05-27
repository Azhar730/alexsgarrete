"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { useApplication } from "./application-context";
import { PersonalInfoValues, personalInfoSchema } from "./application";
import { FormInput, SectionDivider, StepHeader, StepNav } from "./FormFields";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useUpdateProfileMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";


function buildValues(
  email: string | undefined,
  personInfo: Partial<PersonalInfoValues> | undefined,
): PersonalInfoValues {
  return {
    firstName: personInfo?.firstName ?? "",
    middleInitial: personInfo?.middleInitial ?? "",
    lastName: personInfo?.lastName ?? "",
    email: email ?? personInfo?.email ?? "",
    ssnLast4: personInfo?.ssnLast4 ?? "",
    streetAddress: personInfo?.streetAddress ?? "",
    city: personInfo?.city ?? "",
    state: personInfo?.state ?? "",
    zipCode: personInfo?.zipCode ?? "",
    cellPhone: personInfo?.cellPhone ?? "",
    homePhone: personInfo?.homePhone ?? "",
    workPhone: personInfo?.workPhone ?? "",
  };
}

type OnboardingApplication = {
  id?: string;
  personInfo?: Partial<PersonalInfoValues>;
};

export function StepPersonalInfo({ application }: { application?: OnboardingApplication }) {

  const { savePersonalInfo, nextStep } = useApplication();
  const router = useRouter();
  const { data: meResponse } = useGetMeQuery({});
  const [updateProfile] = useUpdateProfileMutation();

  const me = meResponse?.data ?? meResponse;
  const existingPersonInfo = application?.personInfo;
  const applicationId = application?.id;
  const defaultValues = useMemo(
    () => buildValues(me?.email, existingPersonInfo),
    [existingPersonInfo, me?.email],
  );

  const form = useForm<PersonalInfoValues>({
    defaultValues,
    mode: "onTouched",
    resolver: zodResolver(personalInfoSchema),
  });

  const saveProfile = async (values: PersonalInfoValues) => {
    if (!applicationId) {
      toast.error("Application is not ready yet. Please try again.");
      return false;
    }

    try {
      await updateProfile({
        applicationId,
        firstName: values.firstName?.trim() || undefined,
        middleInitial: values.middleInitial?.trim() || undefined,
        lastName: values.lastName?.trim() || undefined,
        streetAddress: values.streetAddress?.trim() || undefined,
        city: values.city?.trim() || undefined,
        state: values.state?.trim() || undefined,
        zipCode: values.zipCode?.trim() || undefined,
        homePhone: values.homePhone?.trim() || undefined,
        workPhone: values.workPhone?.trim() || undefined,
        cellPhone: values.cellPhone?.trim() || undefined,
        ssnLast4: values.ssnLast4?.trim() || undefined,
      }).unwrap();

      savePersonalInfo({
        ...values,
        email: me?.email ?? values.email,
      });
      return true;
    } catch {
      toast.error("Could not save personal information. Please try again.");
      return false;
    }
  };

  const onSubmit = async (values: PersonalInfoValues) => {
    const saved = await saveProfile(values);
    if (saved) nextStep();
  };

  const handleSaveExit = async () => {
    const values = form.getValues();
    if (values.firstName?.trim() || values.lastName?.trim()) {
      await saveProfile(values);
    }
    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <StepHeader
          step={1}
          title="Personal Information"
          description="Please provide your primary contact details to get started."
        />

        {/* Name row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="Sarah"
            autoComplete="given-name"
          />
          <FormInput
            control={form.control}
            name="middleInitial"
            label="Middle Initial"
            placeholder="J"
            autoComplete="additional-name"
          />
          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="Jenkins"
            autoComplete="family-name"
          />
        </div>

        {/* Email + SSN */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="sarah.jenkins@example.com"
            type="email"
            autoComplete="email"
            disabled
          />
          <FormInput
            control={form.control}
            name="ssnLast4"
            label="Last 4 of SSN"
            placeholder="4829"
            autoComplete="off"
            numericType="digits"
          />
        </div>

        <SectionDivider />

        {/* Street address */}
        <div className="mb-4">
          <FormInput
            control={form.control}
            name="streetAddress"
            label="Street Address"
            placeholder="123 Meadow Lane, Apt 4B"
            autoComplete="street-address"
          />
        </div>

        {/* City / State / ZIP */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormInput
            control={form.control}
            name="city"
            label="City"
            placeholder="Austin"
            autoComplete="address-level2"
          />
          <FormInput
            control={form.control}
            name="state"
            label="State"
            placeholder="TX"
            autoComplete="address-level1"
          />
          <FormInput
            control={form.control}
            name="zipCode"
            label="ZIP Code"
            placeholder="78701"
            autoComplete="postal-code"
            numericType="zip"
          />
        </div>

        <SectionDivider />

        {/* Phone numbers */}
        <div className="grid grid-cols-3 gap-4 mb-2">
          <FormInput
            control={form.control}
            name="cellPhone"
            label="Cell Phone"
            placeholder="(555) 123-4567"
            type="tel"
            autoComplete="tel"
            numericType="phone"
          />
          <FormInput
            control={form.control}
            name="homePhone"
            label="Home Phone"
            placeholder="Optional"
            type="tel"
            numericType="phone"
          />
          <FormInput
            control={form.control}
            name="workPhone"
            label="Work Phone"
            placeholder="Optional"
            type="tel"
            numericType="phone"
          />
        </div>

        <StepNav
          onSaveExit={handleSaveExit}
          onNext={nextStep}
          nextLabel="Dog Information →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
