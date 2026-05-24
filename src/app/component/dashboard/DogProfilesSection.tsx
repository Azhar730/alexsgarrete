"use client";
import { Button } from "@/components/ui/button";
import DogProfileCard from "./DogProfileCard";
import { DogProfile } from ".";
import { useState } from "react";
import { AddDogModal } from "./AddDogModal";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyApplicationsQuery, useGetMyQuotesQuery } from "@/redux/api/onboardingApi";
import { toast } from "sonner";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";
import { useGetMyAgreementsQuery } from "@/redux/api/agreementApi";

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
    case "ACTIVE":
      return "active";
    case "QUOTE_ACCEPTED":
      return "quote-accepted";
    case "QUOTE_REJECTED":
      return "quote-rejected";
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
  const { data: applicationsResponse } = useGetMyApplicationsQuery(undefined);
  const { data: quotesResponse } = useGetMyQuotesQuery(undefined);
  const { data: agreementsResponse } = useGetMyAgreementsQuery(undefined);
  const { data: myPayments } = useGetMyPaymentsQuery(undefined);
  console.log("myPayments", myPayments)
  const pets: ApiPet[] = userData?.data?.pets || [];

  const currentApplication = applicationsResponse?.data?.find((a: any) => a.id === applicationId) || applicationsResponse?.data?.[0];
  const quoteGroups = quotesResponse?.data || [];
  const agreements = agreementsResponse?.data || [];

  const hasSignedAcceptedQuote = quoteGroups.some((quoteGroup: any) => {
    if (!quoteGroup.isAccepted) return false;

    return agreements.some((agreement: any) => {
      const sameQuoteGroup = agreement.quoteId === quoteGroup.quoteGroupId;
      const sameQuote = quoteGroup.quotes?.some((quote: any) => quote.id === agreement.quoteId);
      const signed = agreement.isSigned === true;
      return signed && (sameQuoteGroup || sameQuote);
    });
  });

  function handleAddClick() {
    console.log("Add new dog clicked - currentApplication:", currentApplication);
    const status = currentApplication?.status;

    if (!currentApplication) {
      toast.error("Please complete your application first");
      return;
    }

    if (status === "APPROVED") {
      setModalOpen(true);
      return;
    }

    // Draft or in-progress -> ask user to complete
    if (status === "DRAFT" || status === "IN_PROGRESS") {
      toast.error("Please complete your application before adding pets");
      return;
    }

    // Submitted / Under review / Quote ready -> not approved yet
    if (status === "SUBMITTED" || status === "UNDER_REVIEW") {
      toast.error("Your application is not approved yet");
      return;
    }

    if (status === "REJECTED") {
      toast.error("Your application was declined. Please contact support");
      return;
    }

    toast.error("Your application is not approved");
  }

  const dogs: DogProfile[] = pets.map((pet) => {
    const dogQuoteGroup = quoteGroups.find((qg: any) => 
      qg.quotes?.some((q: any) => q.petId === pet.id || q.pet?.id === pet.id)
    );
    
    return {
      id: pet.id,
      name: pet.name,
      breed: pet.primaryBreed || "Unknown Breed",
      age: calculateAge(pet.birthday),
      imageUrl:
        pet.photoUrl ||
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
      status: mapPetStatus(pet.status),
      monthlyFee: pet.petCharge ? Number(pet.petCharge) : null,
      nextBilling: pet.status === "ACTIVE" ? "Active" : null,
      quoteGroupId: dogQuoteGroup?.quoteGroupId,
    };
  });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-secondary">Dog Profiles</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-primary text-primary cursor-pointer gap-1.5 text-base"
          onClick={handleAddClick}
          title={
            currentApplication
              ? currentApplication.status === "APPROVED"
                ? "Add new dog"
                : currentApplication.status === "DRAFT" || currentApplication.status === "IN_PROGRESS"
                  ? "Complete your application to add pets"
                  : currentApplication.status === "SUBMITTED" || currentApplication.status === "UNDER_REVIEW"
                    ? "Your application is under review"
                    : currentApplication.status === "REJECTED"
                      ? "Your application was declined"
                      : "Your application is not approved"
              : "Please complete your application first"
          }
        >
          Add new dog
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dogs.length > 0 ? (
          dogs.map((dog) => (
            <DogProfileCard
              key={dog.id}
              dog={dog}
              acceptedQuoteSigned={hasSignedAcceptedQuote}
            />
          ))
        ) : (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No pets found.
          </div>
        )}
      </div>

      <AddDogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        applicationId={currentApplication?.status === "APPROVED" ? currentApplication?.id : undefined}
      />
    </section>
  );
}
