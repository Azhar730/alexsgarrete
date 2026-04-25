"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useApplication } from "./application-context";
import { personalInfoSchema, PersonalInfoValues } from "./application";
import { FormInput, SectionDivider, StepHeader, StepNav } from "./FormFields";

export function StepPersonalInfo() {
  const { data, savePersonalInfo, nextStep } = useApplication();

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data.personalInfo ?? {
      firstName: "",
      middleInitial: "",
      lastName: "",
      email: "",
      ssnLast4: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      cellPhone: "",
      homePhone: "",
      workPhone: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: PersonalInfoValues) => {
    savePersonalInfo(values);
    nextStep();
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
          />
          <FormInput
            control={form.control}
            name="ssnLast4"
            label="Last 4 of SSN"
            placeholder="4829"
            autoComplete="off"
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
          onSaveExit={() => {}}
          onNext={nextStep}
          nextLabel="Dog Information →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
