"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useApplication } from "./application-context";
import { RepresentativeValues } from "./application";
import { FormInput, FormSelect, SectionDivider, StepHeader, StepNav } from "./FormFields";
import { useUpdateRepresentativeMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const RELATIONSHIP_OPTIONS = [
  { value: "Spouse", label: "Spouse" },
  { value: "Parent", label: "Parent" },
  { value: "Child", label: "Child" },
  { value: "Sibling", label: "Sibling" },
  { value: "Sister", label: "Sister" },
  { value: "Brother", label: "Brother" },
  { value: "Friend", label: "Friend" },
  { value: "Other", label: "Other" },
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID",
  "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS",
  "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK",
  "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV",
  "WI", "WY",
].map((s) => ({ value: s, label: s }));

export function StepRepresentative({ representativeInfo, applicationId }: { representativeInfo?: Partial<RepresentativeValues>; applicationId?: string }) {
  const { data, saveRepresentative, nextStep, prevStep } = useApplication();
  const router = useRouter();
  const hydratedRef = useRef(false);
  const [updateRepresentative] = useUpdateRepresentativeMutation();

  const defaultValues = useMemo(
    () => representativeInfo ?? data.representative ?? {
      fullName: "",
      relationship: "",
      phoneNumber: "",
      email: "",
      city: "",
      state: "",
      zipCode: "",
      cellPhone: "",
      homePhone: "",
      workPhone: "",
    },
    [data.representative, representativeInfo],
  );
  console.log("Representative default values:", defaultValues);
  const form = useForm<RepresentativeValues>({
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const saveRepresentativeProfile = async (values: RepresentativeValues) => {
    try {
      const reprasentativeData = {
        applicationId,
        fullName: values.fullName?.trim() || undefined,
        relationship: values.relationship?.trim() || undefined,
        email: values.email?.trim() || undefined,
        phoneNumber: values.phoneNumber?.trim() || undefined,
        city: values.city?.trim() || undefined,
        state: values.state?.trim() || undefined,
        zipCode: values.zipCode?.trim() || undefined,
        homePhone: values.homePhone?.trim() || undefined,
        workPhone: values.workPhone?.trim() || undefined,
        cellPhone: values.cellPhone?.trim() || undefined,
      }
      await updateRepresentative(reprasentativeData).unwrap();

      saveRepresentative(values);
      return true;
    } catch (error) {
      console.error("updateRepresentative error:", error);
      toast.error("Could not save representative details. Please try again.");
      return false;
    }
  };

  const onSubmit = async (values: RepresentativeValues) => {
    const saved = await saveRepresentativeProfile(values);
    if (saved) nextStep();
  };

  const handleSaveExit = async () => {
    const saved = await saveRepresentativeProfile(form.getValues());
    if (saved) router.push("/");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <StepHeader
          step={3}
          title="Representative"
          description="Provide details of the person who will be responsible for your dog's transition of care."
        />

        {/* Info callout */}
        <div className="flex items-start gap-3 bg-blue-50/70 border border-blue-100 rounded-lg px-4 py-3 mb-5">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Why do we need this?
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              The executor is the trusted contact we will reach out to if you
              are unable to fulfill your caretaking duties. They will coordinate
              with us to activate your dog&apos;s care plan smoothly and securely.
            </p>
          </div>
        </div>

        {/* Full name */}
        <div className="mb-4">
          <FormInput
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="Eleanor Rigby"
            autoComplete="name"
          />
        </div>

        {/* Relationship + Phone */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormSelect
            control={form.control}
            name="relationship"
            label="Relationship to You"
            placeholder="Select"
            options={RELATIONSHIP_OPTIONS}
          />
          <FormInput
            control={form.control}
            name="phoneNumber"
            label="Phone Number"
            placeholder="(555) 987-6543"
            type="tel"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="eleanor.rigby@example.com"
            type="email"
            autoComplete="email"
          />
        </div>

        <SectionDivider />

        {/* City / State / ZIP */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormInput
            control={form.control}
            name="city"
            label="City"
            placeholder="Austin"
          />
          <FormSelect
            control={form.control}
            name="state"
            label="State"
            placeholder="Select"
            options={US_STATES}
          />
          <FormInput
            control={form.control}
            name="zipCode"
            label="ZIP Code"
            placeholder="78702"
          />
        </div>

        {/* Phone numbers */}
        <div className="grid grid-cols-3 gap-4 mb-2">
          <FormInput
            control={form.control}
            name="cellPhone"
            label="Cell Phone"
            placeholder="(555) 987-6543"
            type="tel"
          />
          <FormInput
            control={form.control}
            name="homePhone"
            label="Home Phone"
            placeholder="Optional"
            type="tel"
          />
          <FormInput
            control={form.control}
            name="workPhone"
            label="Work Phone"
            placeholder="Optional"
            type="tel"
          />
        </div>

        <StepNav
          onBack={prevStep}
          backLabel="← Back to Dog Info"
          onSaveExit={handleSaveExit}
          onNext={nextStep}
          nextLabel="Health Details →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
