"use client";
import { Button } from "@/components/ui/button";
import DogProfileCard from "./DogProfileCard";
import { DogProfile } from ".";
import { useState } from "react";
import { AddDogModal, DogFormData } from "./AddDogModal";

const dogs: DogProfile[] = [
  {
    id: "1",
    name: "Bella",
    breed: "Golden Retriever",
    age: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
    status: "active",
    monthlyFee: 45.0,
    nextBilling: "Nov 12, 2026",
  },
  {
    id: "2",
    name: "Josh",
    breed: "Golden Retriever",
    age: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
    status: "in-progress",
    monthlyFee: null,
    nextBilling: null,
  },
  {
    id: "3",
    name: "Charlie",
    breed: "Golden Retriever",
    age: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200&h=200&fit=crop",
    status: "quote-ready",
    monthlyFee: null,
    nextBilling: null,
  },
];

export default function DogProfilesSection() {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddDog = (data: DogFormData) => {
    console.log("New dog data:", data);
    // তোমার API call বা state update এখানে
  };
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
        {dogs.map((dog) => (
          <DogProfileCard key={dog.id} dog={dog} />
        ))}
      </div>

      <AddDogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddDog}
      />
    </section>
  );
}
