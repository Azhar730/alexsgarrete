"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DogFormData, EditDogModal } from "./EditDogModal";
import { PetHeaderCard } from "./PetHeaderCard";
import { PetDetailsCard } from "./PetDetailsCard";
import { BillingSummaryCard } from "./BillingSummaryCard";


// ─── Seed data (replace with real API fetch) ──────────────────
const INITIAL_DOG = {
  name: "Max",
  status: "Active" as const,
  breed: "Golden Retriever",
  ageDisplay: "3 years old",
  gender: "Male",
  imageUrl: "/images/max.jpg", // swap with real path
  // form fields
  spayedNeutered: "Yes",
  birthday: "04/12/2020 (3 years)",
  primaryBreed: "Golden Retriever",
  additionalBreed: "",
  colorCoat: "Light golden, medium coat",
  microchipped: "Yes",
  microchipNumber: "18002527894",
  microchipId: "989879456654964",
  // billing
  monthlyPremium: 45,
  addOnsWellness: 0,
  paymentMethodLast4: "4242",
  nextPaymentDate: "Nov 12, 2026",
};

export default function PetProfilePage() {
  const [dog, setDog] = useState(INITIAL_DOG);
  const [editOpen, setEditOpen] = useState(false);

  // Convert page state → modal default values
  const editDefaults: Partial<DogFormData> = {
    name: dog.name,
    gender: dog.gender.toLowerCase(),
    spayedNeutered: dog.spayedNeutered.toLowerCase(),
    // strip the "(3 years)" annotation for the form
    birthday: dog.birthday.split(" ")[0],
    primaryBreed: dog.primaryBreed,
    additionalBreed: dog.additionalBreed,
    colorCoat: dog.colorCoat,
    microchipped: dog.microchipped.toLowerCase(),
    microchipNumber: dog.microchipNumber,
    microchipId: dog.microchipId,
    existingImageUrl: dog.imageUrl,
  };

  const handleEditSubmit = async (data: DogFormData) => {
    // In a real app you'd call an API here.
    // For now we just update local state to show reactivity.
    setDog((prev) => ({
      ...prev,
      name: data.name,
      gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),
      spayedNeutered:
        data.spayedNeutered.charAt(0).toUpperCase() +
        data.spayedNeutered.slice(1),
      birthday: data.birthday,
      primaryBreed: data.primaryBreed,
      additionalBreed: data.additionalBreed ?? "",
      colorCoat: data.colorCoat,
      microchipped:
        data.microchipped.charAt(0).toUpperCase() +
        data.microchipped.slice(1),
      microchipNumber: data.microchipNumber ?? "",
      microchipId: data.microchipId ?? "",
      // update preview if a new image was picked
      imageUrl: data.existingImageUrl ?? prev.imageUrl,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* ── Page shell ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-4">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header card */}
        <PetHeaderCard
          name={dog.name}
          status={dog.status}
          breed={dog.breed}
          age={dog.ageDisplay}
          gender={dog.gender}
          imageUrl={dog.imageUrl}
          onEditClick={() => setEditOpen(true)}
        />

        {/* Pet details */}
        <PetDetailsCard
          name={dog.name}
          gender={dog.gender}
          spayedNeutered={dog.spayedNeutered}
          birthday={dog.birthday}
          primaryBreed={dog.primaryBreed}
          additionalBreed={dog.additionalBreed}
          colorCoat={dog.colorCoat}
          microchipped={dog.microchipped}
          microchipNumber={dog.microchipNumber}
          microchipId={dog.microchipId}
        />

        {/* Billing */}
        <BillingSummaryCard
          monthlyPremium={dog.monthlyPremium}
          addOnsWellness={dog.addOnsWellness}
          paymentMethodLast4={dog.paymentMethodLast4}
          nextPaymentDate={dog.nextPaymentDate}
        />
      </div>

      {/* ── Edit modal ── */}
      <EditDogModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        defaultValues={editDefaults}
      />
    </div>
  );
}
