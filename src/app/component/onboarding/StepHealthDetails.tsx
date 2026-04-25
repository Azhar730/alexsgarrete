"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { healthDetailsSchema, HealthDetailsValues } from "./application";
import { FormInput, FormTextarea, SectionDivider, StepNav, YesNoRadio } from "./FormFields";
import { useApplication } from "./application-context";


const HIPAA_TEXT = `We are committed to the secure and confidential collection, use, and storage of client health questionnaire information in full compliance with the Health Insurance Portability and Accountability Act (HIPAA). All health-related data is gathered solely for legitimate administrative purposes and is limited to the minimum necessary information required.

Client information is collected through secure methods and is protected by appropriate administrative, technical, and physical safeguards to prevent unauthorized access, disclosure, alteration, or destruction. Access to protected health information (PHI) is restricted to authorized personnel who are trained in HIPAA compliance and confidentiality practices.

All data is stored in secure systems with encryption and access controls, and any transmission of sensitive information is conducted through secure, HIPAA-compliant channels. We do not share client health information with third parties without explicit authorization, except as required or permitted by law.

We regularly review and update our policies and procedures to maintain compliance with applicable regulations and to ensure the ongoing protection of client privacy and data security.`;

export function StepHealthDetails() {
  const { data, saveHealthDetails, nextStep, prevStep } = useApplication();

  const form = useForm<HealthDetailsValues>({
    resolver: zodResolver(healthDetailsSchema),
    defaultValues: data.healthDetails ?? {
      hipaaAcknowledged: undefined,
      chronicConditions: undefined,
      terminalConditions: undefined,
      terminalExplanation: "",
      familyCancer: undefined,
      cancerRelation: "",
      cancerDiagnosis: "",
      cancerAgeOnset: "",
      cancerAgeAtDeath: "",
      familyHeartDisease: undefined,
      familyDiabetes: undefined,
      tobaccoUse: undefined,
      tobaccoCurrentUser: undefined,
      tobaccoLastUsed: "",
    },
    mode: "onChange",
  });

  const watched = useWatch({ control: form.control });

  const onSubmit = (values: HealthDetailsValues) => {
    saveHealthDetails(values);
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* HIPAA Section */}
        <div className="mb-6">
          <div className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mb-4">
            {HIPAA_TEXT}
          </div>

          {/* HIPAA acknowledge checkbox */}
          <FormField
            control={form.control}
            name="hipaaAcknowledged"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <div className="flex items-start gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true ? true : undefined)
                      }
                      className="mt-0.5 border-gray-400 data-[state=checked]:bg-[#5C7FC4] data-[state=checked]:border-[#5C7FC4]"
                    />
                  </FormControl>
                  <Label className="text-sm text-gray-700 font-medium cursor-pointer leading-snug">
                    I acknowledge that I have read, understood, and agree to the
                    Encore LLC HIPAA disclaimer
                  </Label>
                </div>
                <FormMessage className="text-xs text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <SectionDivider />

        {/* Health questionnaire */}
        <div className="mt-5 mb-3">
          <h2 className="text-base font-bold text-gray-800">
            Step 2: Health Questionnaire
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Please provide information about your medical and family history.
            This helps us tailor the plan for you.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Q1: Chronic conditions */}
          <YesNoRadio
            control={form.control}
            name="chronicConditions"
            label="Are you currently under the care of a doctor for any chronic or degenerative conditions, illnesses, or diseases?"
          />

          {/* Q2: Terminal conditions */}
          <div className="flex flex-col gap-3">
            <YesNoRadio
              control={form.control}
              name="terminalConditions"
              label="Are you currently under the care of a doctor for any terminal conditions, illnesses, or diseases?"
            />
            {watched.terminalConditions === "Yes" && (
              <div className="pl-0">
                <FormTextarea
                  control={form.control}
                  name="terminalExplanation"
                  label="If yes, please explain including dates of diagnosis:"
                  placeholder="Diagnosed with early-stage condition in Jan 2022. Currently undergoing routine monitoring."
                  rows={3}
                />
              </div>
            )}
          </div>

          <SectionDivider />

          {/* Q3: Cancer */}
          <div className="flex flex-col gap-3">
            <YesNoRadio
              control={form.control}
              name="familyCancer"
              label="Have YOU or any IMMEDIATE FAMILY MEMBERS (parents, siblings) been diagnosed with or died from CANCER?"
            />
            {/* Cancer detail fields always visible but editable only when Yes */}
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                control={form.control}
                name="cancerRelation"
                placeholder="Relation (mother, father, brother, sister)"
              />
              <FormInput
                control={form.control}
                name="cancerDiagnosis"
                placeholder="Diagnosis"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                control={form.control}
                name="cancerAgeOnset"
                placeholder="Approximate age of disease onset"
              />
              <FormInput
                control={form.control}
                name="cancerAgeAtDeath"
                placeholder="Age at death (if deceased)"
              />
            </div>
          </div>

          <SectionDivider />

          {/* Q4: Heart disease */}
          <YesNoRadio
            control={form.control}
            name="familyHeartDisease"
            label="Have YOU or any IMMEDIATE FAMILY MEMBERS been diagnosed with or died from CORONARY HEART DISEASE?"
          />

          {/* Q5: Diabetes */}
          <YesNoRadio
            control={form.control}
            name="familyDiabetes"
            label="Have YOU or any IMMEDIATE FAMILY MEMBERS been diagnosed with or died from DIABETES?"
          />

          <SectionDivider />

          {/* Q6: Tobacco */}
          <div className="flex flex-col gap-3">
            <YesNoRadio
              control={form.control}
              name="tobaccoUse"
              label="Have you ever used any form of tobacco or nicotine products?"
            />
            {watched.tobaccoUse === "Yes" && (
              <>
                <YesNoRadio
                  control={form.control}
                  name="tobaccoCurrentUser"
                  label="If yes, are you a current user?"
                />
                {watched.tobaccoCurrentUser === "No" && (
                  <FormInput
                    control={form.control}
                    name="tobaccoLastUsed"
                    placeholder="If no, when did you last use nicotine products?"
                  />
                )}
              </>
            )}
          </div>
        </div>

        <StepNav
          onBack={prevStep}
          backLabel="← Back to Personal Info"
          onSaveExit={() => {}}
          onNext={nextStep}
          nextLabel="Dog Information →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </Form>
  );
}
