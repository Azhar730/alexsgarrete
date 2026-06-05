"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useApplication } from "./application-context";
import { RepresentativeValues, representativeSchema } from "./application";
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
  const [updateRepresentative] = useUpdateRepresentativeMutation();

  const defaultValues = useMemo(
    () => {
      const rep = representativeInfo ?? data.representative;
      const fName = (rep as any)?.fullName?.split(" ")[0] || "";
      const lName = (rep as any)?.fullName?.split(" ").slice(1).join(" ") || "";
      return {
        firstName: rep?.firstName || fName,
        lastName: rep?.lastName || lName,
        middleInitial: rep?.middleInitial || "",
        relationship: rep?.relationship || "",
        phoneNumber: rep?.phoneNumber || "",
        email: rep?.email || "",
        city: rep?.city || "",
        state: rep?.state || "",
        zipCode: rep?.zipCode || "",
        cellPhone: rep?.cellPhone || "",
        homePhone: rep?.homePhone || "",
        workPhone: rep?.workPhone || "",
        streetAddress: rep?.streetAddress || "",
      };
    },
    [data.representative, representativeInfo],
  );
  const form = useForm<RepresentativeValues>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(representativeSchema),
  });

  const saveRepresentativeProfile = async (values: RepresentativeValues) => {
    try {
      const reprasentativeData = {
        applicationId,
        fullName: `${values.firstName?.trim() || ""} ${values.lastName?.trim() || ""}`.trim(),
        middleInitial: values.middleInitial?.trim() || "",
        relationship: values.relationship?.trim() || "",
        email: values.email?.trim() || "",
        phoneNumber: values.phoneNumber?.trim() || "",
        city: values.city?.trim() || "",
        state: values.state?.trim() || "",
        zipCode: values.zipCode?.trim() || "",
        homePhone: values.homePhone?.trim() || "",
        workPhone: values.workPhone?.trim() || "",
        cellPhone: values.cellPhone?.trim() || "",
        streetAddress: values.streetAddress?.trim() || "",
      };
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
    const values = form.getValues();
    if (values.firstName?.trim() || values.lastName?.trim() || values.email?.trim()) {
      await saveRepresentativeProfile(values as RepresentativeValues);
    }
    router.push("/dashboard");
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

        {/* Name row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            placeholder="e.g. John"
            autoComplete="given-name"
          />
          <FormInput
            control={form.control}
            name="middleInitial"
            label="Middle Initial"
            placeholder="e.g. A"
            autoComplete="additional-name"
          />
          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            placeholder="e.g. Doe"
            autoComplete="family-name"
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
            numericType="phone"
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

        {/* Street address */}
        <div className="mb-4">
          <FormInput
            control={form.control}
            name="streetAddress"
            label="Street Address"
            placeholder="123 Main St"
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
            numericType="zip"
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
