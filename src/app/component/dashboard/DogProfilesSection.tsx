"use client";
import { Button } from "@/components/ui/button";
import DogProfileCard from "./DogProfileCard";
import { DogProfile } from ".";
import { useState } from "react";
import { AddDogModal } from "./AddDogModal";
import { useGetMeQuery } from "@/redux/api/userApi";

type ApiPet = {
  id: string;
  name: string;
  primaryBreed?: string | null;
  birthday?: string | null;
  photoUrl?: string | null;
  status?: string | null;
  petCharge?: string | null;
};

function calculateAge(birthday?: string | null): number {
  if (!birthday) return 0;

  const birthDate = new Date(birthday);
  if (Number.isNaN(birthDate.getTime())) return 0;

  const now = new Date();
  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDiff = now.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return Math.max(age, 0);
}

function mapPetStatus(status?: string | null): DogProfile["status"] {
  switch (status) {
    case "QUOTE_ACCEPTED":
      return "active";
    case "QUOTE_READY":
      return "quote-ready";
    case "IN_PROGRESS":
      return "in-progress";
    default:
      return "incomplete";
  }
}

export default function DogProfilesSection({
  applicationId,
}: {
  applicationId?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: userData } = useGetMeQuery({});

  const pets: ApiPet[] = userData?.data?.pets || [];
  console.log("Pets data in DogProfilesSection:", pets);
  const dogs: DogProfile[] = pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    breed: pet.primaryBreed || "Unknown Breed",
    age: calculateAge(pet.birthday),
    imageUrl:
      pet.photoUrl ||
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
    status: mapPetStatus(pet.status),
    monthlyFee: pet.petCharge ? Number(pet.petCharge) : null,
    nextBilling: pet.status === "QUOTE_ACCEPTED" ? "Active" : null,
  }));


  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-secondary">Dog Profiles</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary cursor-pointer gap-1.5 text-base"
          onClick={() => setModalOpen(true)}
        >
          Add new dog
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.length > 0 ? (
          dogs.map((dog) => <DogProfileCard key={dog.id} dog={dog} />)
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No pets found.
          </div>
        )}
      </div>

      <AddDogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        applicationId={applicationId}
      />
    </section>
  );
}
