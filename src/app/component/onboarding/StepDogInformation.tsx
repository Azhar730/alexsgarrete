"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DogForm } from "./DogForm";
import { useApplication } from "./application-context";
import { DogValues, DogsStepValues, dogsStepSchema } from "./application";
import { StepHeader, StepNav } from "./FormFields";
import { toast } from "sonner";
import { useAddPetMutation, useDeletePetMutation } from "@/redux/api/onboardingApi";
import { useGetMeQuery } from "@/redux/api/userApi";

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
  weight: "",
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
  weight?: string | null;
};

function mapBackendPet(pet: Partial<BackendPet>): DogValues {
  let birthdayStr = "";
  if (pet.birthday) {
    try {
      birthdayStr = new Date(pet.birthday).toISOString().split("T")[0];
    } catch (e) {
      birthdayStr = "";
    }
  }

  return {
    id: pet.id,
    photoUrl: pet.photoUrl ?? undefined,
    name: pet.name ?? DEFAULT_DOG.name,
    gender: pet.gender === "Female" || pet.gender === "FEMALE" ? "Female" : "Male",
    spayedNeutered: pet.isSpayedNeutered ? "Yes" : "No",
    birthday: birthdayStr,
    primaryBreed: pet.primaryBreed ?? "",
    additionalBreeds: pet.additionalBreed ?? "",
    colorCoatDescription: pet.colorsAndCoat ?? "",
    microchipped: pet.isMicrochipped ? "Yes" : "No",
    microchipNumber: pet.microchipNumber ?? undefined,
    microchipId: pet.microchipId ?? undefined,
    weight: pet.weight ?? undefined,
  };
}

function buildPetPayload(applicationId: string, dog: DogValues, id?: string) {
  return {
    applicationId,
    ...(id ? { id, petId: id } : {}),
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
    weight: dog.weight || undefined,
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
  const router = useRouter();
  const [addPet] = useAddPetMutation();
  const [deletePet] = useDeletePetMutation();
  const { data: userData } = useGetMeQuery({});
  const userPets: Partial<BackendPet>[] = userData?.data?.pets || [];

  const initialDogs: DogValues[] = useMemo(() => {
    let backendDogs = pets?.length ? pets.map((dog) => mapBackendPet(dog)) : [];

    // Fallback to pets from user profile if not passed in props
    if (!backendDogs.length && userPets.length) {
      backendDogs = userPets.map((dog) => mapBackendPet(dog));
    }

    if (backendDogs.length) return backendDogs;

    if (data.dogs?.length) {
      return data.dogs.map((dog) => ({ ...DEFAULT_DOG, ...dog }));
    }

    return [DEFAULT_DOG];
  }, [data.dogs, pets, userPets]);

  const form = useForm<DogsStepValues>({
    defaultValues: { dogs: initialDogs } as DogsStepValues,
    mode: "onTouched",
    resolver: zodResolver(dogsStepSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dogs",
  });

  useEffect(() => {
    form.reset({ dogs: initialDogs } as DogsStepValues);
  }, [form, initialDogs]);

  const handleRemoveDog = async (index: number) => {
    const dog = form.getValues(`dogs.${index}`);

    if (dog?.id) {
      try {
        await deletePet(dog.id).unwrap();
        toast.success("Dog profile deleted.");
      } catch (error) {
        console.error("deletePet error:", error);
        toast.error("Could not delete dog profile. Please try again.");
        return;
      }
    }

    remove(index);
  };

  const saveDogProfiles = async (values: DogsStepValues) => {
    if (!applicationId) {
      toast.error("Application is not ready yet. Please try again.");
      return false;
    }

    try {
      const savedDogs = await Promise.all(
        values.dogs.map(async (dog) => {
          const response = await addPet(buildPetPayload(applicationId, dog, dog.id)).unwrap();
          const savedDog = (response as { data?: Partial<BackendPet> } | undefined)?.data;

          return {
            ...dog,
            id: savedDog?.id ?? dog.id,
          };
        })
      );

      saveDogs(savedDogs);
      return true;
    } catch (error) {
      console.error("addPet error:", error);
      toast.error("Could not save dog details. Please try again.");
      return false;
    }
  };

  const onFormSubmit = async (values: DogsStepValues) => {
    const saved = await saveDogProfiles(values);
    if (saved) nextStep();
  };

  const handleSaveExit = async () => {
    const values = form.getValues();
    const validDogs = values.dogs.filter(dog => dog.name?.trim() && dog.primaryBreed?.trim());
    if (validDogs.length > 0) {
      await saveDogProfiles({ dogs: validDogs } as DogsStepValues);
    }
    router.push("/dashboard");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)}>
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
              onRemove={() => handleRemoveDog(index)}
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
          backLabel="← Back to Personal Info"
          onSaveExit={handleSaveExit}
          onNext={nextStep}
          nextLabel="Representative →"
          isSubmitting={form.formState.isSubmitting}
        />
      </form>
    </FormProvider>
  );
}

