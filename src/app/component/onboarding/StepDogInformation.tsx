"use client";

import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { DogForm } from "./DogForm";
import { useApplication } from "./application-context";
import { dogsStepSchema, DogsStepValues } from "./application";
import { StepHeader, StepNav } from "./FormFields";

const DEFAULT_DOG = {
  photoUrl: "",
  name: "",
  gender: "Male" as const,
  spayedNeutered: "Yes" as const,
  birthday: "",
  primaryBreed: "",
  additionalBreeds: "",
  colorCoatDescription: "",
  microchipped: "No" as const,
  microchipNumber: "",
  microchipId: "",
};

export function StepDogInformation() {
  const { data, saveDogs, nextStep, prevStep } = useApplication();

  const form = useForm<DogsStepValues>({
    resolver: zodResolver(dogsStepSchema),
    defaultValues: {
      dogs: data.dogs?.length
        ? data.dogs.map((d) => ({ ...DEFAULT_DOG, ...d }))
        : [DEFAULT_DOG],
    },
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dogs",
  });

  const onSubmit = (values: DogsStepValues) => {
    saveDogs(values.dogs);
    nextStep();
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <StepHeader
          step={2}
          title="Dog Information"
          description="Tell us about your furry friend so we can better accommodate their needs."
        />

        {/* Dog forms */}
        <div className="flex flex-col gap-5">
          {fields.map((field, index) => (
            <DogForm
              key={field.id}
              index={index}
              canRemove={fields.length > 1}
              onRemove={() => remove(index)}
            />
          ))}
        </div>

        {/* Add another dog */}
        <button
          type="button"
          onClick={() => append({ ...DEFAULT_DOG })}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Another Dog
        </button>

        <StepNav
          onBack={prevStep}
          backLabel="← Back to Health Details"
          onSaveExit={() => {}}
          onNext={nextStep}
          nextLabel="Representative →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </FormProvider>
  );
}
