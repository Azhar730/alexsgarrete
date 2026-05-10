"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { Plus } from "lucide-react";
import { DogForm } from "./DogForm";
import { useApplication } from "./application-context";
import { DogValues, DogsStepValues } from "./application";
import { StepHeader, StepNav } from "./FormFields";
import { toast } from "sonner";
import { useUpdatePetMutation } from "@/redux/api/onboardingApi";

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

type BackendPet = {
  id?: string;
  species?: string;
  name?: string;
  gender?: "MALE" | "FEMALE" | "Male" | "Female";
  isSpayedNeutered?: boolean;
  additionalBreed?: string | null;
  colorsAndCoat?: string | null;
  isMicrochipped?: boolean;
  birthday?: string;
  primaryBreed?: string;
  microchipNumber?: string | null;
  microchipId?: string | null;
  photoUrl?: string | null;
};

function mapBackendPet(pet: Partial<BackendPet>): DogValues {
  return {
    id: pet.id,
    photoUrl: pet.photoUrl ?? undefined,
    name: pet.name ?? DEFAULT_DOG.name,
    gender: pet.gender === "Female" || pet.gender === "FEMALE" ? "Female" : "Male",
    spayedNeutered: pet.isSpayedNeutered ? "Yes" : "No",
    birthday: pet.birthday ?? "",
    primaryBreed: pet.primaryBreed ?? "",
    additionalBreeds: pet.additionalBreed ?? "",
    colorCoatDescription: pet.colorsAndCoat ?? "",
    microchipped: pet.isMicrochipped ? "Yes" : "No",
    microchipNumber: pet.microchipNumber ?? undefined,
    microchipId: pet.microchipId ?? undefined,
  };
}

function buildPetPayload(applicationId: string, dog: DogValues, id?: string) {
  return {
    applicationId,
    ...(id ? { id } : {}),
    species: "Dog",
    name: dog.name,
    gender: dog.gender === "Female" ? "FEMALE" : "MALE",
    isSpayedNeutered: dog.spayedNeutered === "Yes",
    birthday: dog.birthday,
    primaryBreed: dog.primaryBreed,
    additionalBreed: dog.additionalBreeds || undefined,
    colorsAndCoat: dog.colorCoatDescription,
    isMicrochipped: dog.microchipped === "Yes",
    microchipNumber: dog.microchipNumber || undefined,
    microchipId: dog.microchipId || undefined,
    photoUrl: dog.photoUrl || undefined,
  };
}

export function StepDogInformation({
  applicationId,
  pets,
}: {
  applicationId?: string;
  pets?: Partial<BackendPet>[];
}) {
  const { data, saveDogs, nextStep, prevStep } = useApplication();
  const [updatePet] = useUpdatePetMutation();
  const initialDogs: DogValues[] = useMemo(() => {
    const backendDogs = pets?.length ? pets.map((dog) => mapBackendPet(dog)) : [];
    if (backendDogs.length) return backendDogs;

    if (data.dogs?.length) {
      return data.dogs.map((dog) => ({ ...DEFAULT_DOG, ...dog }));
    }

    return [DEFAULT_DOG];
  }, [data.dogs, pets]);

  const form = useForm<DogsStepValues>({
    defaultValues: { dogs: initialDogs } as DogsStepValues,
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dogs",
  });

  useEffect(() => {
    form.reset({ dogs: initialDogs } as DogsStepValues);
  }, [form, initialDogs]);

  const onSubmit = async (values: DogsStepValues) => {
    console.log("Submitting dog information:", values);
    const resolvedApplicationId = applicationId;
    if (!resolvedApplicationId) {
      toast.error("Application is not ready yet. Please try again.");
      return;
    }

    try {
      const savedDogs = await Promise.all(
        values.dogs.map(async (dog) => {
          const response = await updatePet(buildPetPayload(resolvedApplicationId, dog, dog.id)).unwrap();
          const savedDog = (response as { data?: Partial<BackendPet> } | undefined)?.data;

          return {
            ...dog,
            id: savedDog?.id ?? dog.id,
          };
        })
      );

      saveDogs(savedDogs);
      nextStep();
    } catch (error) {
      console.error("updatePet error:", error);
      toast.error("Could not save dog details. Please try again.");
    }
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
          onSaveExit={() => { }}
          onNext={nextStep}
          nextLabel="Representative →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </FormProvider>
  );
}
