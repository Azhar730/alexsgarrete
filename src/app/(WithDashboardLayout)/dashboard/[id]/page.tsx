"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DogFormData, EditDogModal } from "@/app/component/dashboard/EditDogModal";
import { useParams } from "next/navigation";
import { useEditPetMutation, useGetPetDetailsQuery } from "@/redux/api/onboardingApi";

// ─── Types ────────────────────────────────────────────────────
interface DogProfile {
  name?: string;
  gender?: string;
  spayedNeutered?: string;
  birthday?: string;
  primaryBreed?: string;
  additionalBreed?: string;
  colorCoat?: string;
  microchipped?: string;
  microchipNumber?: string;
  microchipId?: string;
  imageUrl: string;
}

// ─── Helpers ─────────────────────────────────────────────────
function calcAge(dateStr: string): number | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const d = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

function capitalize(s?: string) {
  if (!s) return "N/A";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Detail Row ──────────────────────────────────────────────
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="py-4 border-b border-gray-50 last:border-0">
      <p className="text-xs text-muted-foreground font-medium mb-1">{label}</p>
      <p className="text-sm font-semibold text-primary">{value || "N/A"}</p>
    </div>
  );
}

// ─── Billing Row ─────────────────────────────────────────────
function BillingRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 ${
        bold ? "font-bold" : ""
      }`}
    >
      <span className={`text-sm ${bold ? "text-primary" : "text-secondary"}`}>
        {label}
      </span>
      <span className={`text-sm ${bold ? "text-primary" : "text-primary font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function PetDetailsPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [editPet] = useEditPetMutation();
  const [dog, setDog] = useState<DogProfile>({
    name: "",
    gender: "",
    spayedNeutered: "",
    birthday: "",
    primaryBreed: "",
    additionalBreed: "",
    colorCoat: "",
    microchipped: "",
    microchipNumber: "",
    microchipId: "",
    imageUrl: "",
  });

  const params = useParams();
  const petId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { data: petDetailsResponse } = useGetPetDetailsQuery(
    petId || "",
    { skip: !petId }
  );

  const mappedDogData = useMemo(() => {
    if (!petDetailsResponse?.data) return null;
    const pet = petDetailsResponse.data;
    return {
      name: pet.name || "",
      gender: pet.gender || "",
      spayedNeutered: pet.isSpayedNeutered ? "yes" : "no",
      birthday: pet.birthday || "",
      primaryBreed: pet.primaryBreed || "",
      additionalBreed: pet.additionalBreed || "",
      colorCoat: pet.colorsAndCoat || "",
      microchipped: pet.isMicrochipped ? "yes" : "no",
      microchipNumber: pet.microchipNumber || "",
      microchipId: pet.microchipId || "",
      imageUrl: pet.photoUrl || "/dog.png",
    };
  }, [petDetailsResponse]);

  const currentDog = mappedDogData || dog;
  const age = calcAge(currentDog.birthday);
  const ageLabel = age !== null ? `${age} years old` : currentDog.birthday;

  const handleSave = async (data: DogFormData) => {
    if (!petId) {
      toast.error("Pet id is missing.");
      return;
    }

    try {
      await editPet({
        petId,
        payload: {
          name: data.name,
          gender: data.gender,
          isSpayedNeutered: data.spayedNeutered === "yes",
          birthday: data.birthday,
          primaryBreed: data.primaryBreed,
          additionalBreed: data.additionalBreed || "",
          colorsAndCoat: data.colorCoat,
          isMicrochipped: data.microchipped === "yes",
          microchipNumber: data.microchipNumber || "",
          microchipId: data.microchipId || "",
        },
      }).unwrap();

      const imageUrl = data.imageFile
        ? URL.createObjectURL(data.imageFile)
        : currentDog.imageUrl;

      setDog({
        name: data.name,
        gender: data.gender,
        spayedNeutered: data.spayedNeutered,
        birthday: data.birthday,
        primaryBreed: data.primaryBreed,
        additionalBreed: data.additionalBreed ?? "",
        colorCoat: data.colorCoat,
        microchipped: data.microchipped,
        microchipNumber: data.microchipNumber ?? "",
        microchipId: data.microchipId ?? "",
        imageUrl,
      });

      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Could not update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-3xl mx-auto px-4 py-7 space-y-4">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:gap-2.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* ── Profile Header Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
              <Image
                src={"/dog.png"}
                alt={currentDog.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-bold text-primary">{currentDog.name}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold px-2.5 rounded-full">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-secondary">
                {currentDog.primaryBreed} • {ageLabel} •{" "}
                {capitalize(currentDog.gender)}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setEditOpen(true)}
            className="rounded-xl border-gray-200 text-primary hover:bg-[#f0f3ff] hover:border-[#5B6BBF] font-semibold text-sm gap-2"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </div>

        {/* ── Pet Details Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h2 className="text-[15px] font-bold text-primary">Pet Details</h2>
          </div>
          <div className="px-6 grid grid-cols-1 sm:grid-cols-2">
            <DetailRow label="Name of Dog" value={currentDog.name} />
            <DetailRow label="Gender" value={capitalize(currentDog.gender)} />
            <DetailRow
              label="Spayed / Neutered"
              value={capitalize(currentDog.spayedNeutered)}
            />
            <DetailRow
              label="Birthday / Age of Pet"
              value={`${currentDog.birthday}${age !== null ? ` (${age} years)` : ""}`}
            />
            <DetailRow label="Primary Breed" value={currentDog.primaryBreed} />
            <DetailRow
              label="Additional Breed(s)"
              value={currentDog.additionalBreed || "N/A"}
            />
            <DetailRow
              label="Color(s) & Coat description"
              value={currentDog.colorCoat}
            />
            <DetailRow
              label="Microchipped"
              value={capitalize(currentDog.microchipped)}
            />
            <DetailRow
              label="Microchip number"
              value={
                currentDog.microchipped === "yes" ? currentDog.microchipNumber : "N/A"
              }
            />
            <DetailRow
              label="Microchip ID"
              value={currentDog.microchipped === "yes" ? currentDog.microchipId : "N/A"}
            />
          </div>
        </div>

        {/* ── Billing Summary Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-primary">
              Billing Summary
            </h2>
            <Button
              variant="ghost"
              className="text-primary font-semibold text-sm h-auto p-0 hover:bg-transparent hover:opacity-70"
            >
              Manage
            </Button>
          </div>
          <div className="px-6">
            <BillingRow label="Monthly Premium" value="$45.00" />
            <BillingRow label="Add-ons (Wellness)" value="$0.00" />
            <BillingRow
              label="Payment Method"
              value={
                <span className="flex items-center gap-1.5 font-semibold">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  •••• 4242
                </span>
              }
            />
            <BillingRow label="Total Monthly" value="$45.00" bold />
            <BillingRow label="Next Payment Date" value="Nov 12, 2026" />
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <EditDogModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleSave}
        defaultValues={{
          name: currentDog.name,
          gender: currentDog.gender,
          spayedNeutered: currentDog.spayedNeutered,
          birthday: currentDog.birthday,
          primaryBreed: currentDog.primaryBreed,
          additionalBreed: currentDog.additionalBreed,
          colorCoat: currentDog.colorCoat,
          microchipped: currentDog.microchipped,
          microchipNumber: currentDog.microchipNumber,
          microchipId: currentDog.microchipId,
        }}
        currentImageUrl={currentDog.imageUrl}
      />
    </div>
  );
}