"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { DogFormData, EditDogModal } from "@/app/component/dashboard/EditDogModal";

// ─── Types ────────────────────────────────────────────────────
interface DogProfile {
  name: string;
  gender: string;
  spayedNeutered: string;
  birthday: string;
  primaryBreed: string;
  additionalBreed: string;
  colorCoat: string;
  microchipped: string;
  microchipNumber: string;
  microchipId: string;
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

function capitalize(s: string) {
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
  const [dog, setDog] = useState<DogProfile>({
    name: "Max",
    gender: "male",
    spayedNeutered: "yes",
    birthday: "04/12/2020",
    primaryBreed: "Golden Retriever",
    additionalBreed: "",
    colorCoat: "Light golden, medium coat",
    microchipped: "yes",
    microchipNumber: "18002527894",
    microchipId: "989879456654964",
    imageUrl: "/dog-avatar.jpg", // replace with your image
  });

  const age = calcAge(dog.birthday);
  const ageLabel = age !== null ? `${age} years old` : dog.birthday;

  const handleSave = async (data: DogFormData) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));

    let imageUrl = dog.imageUrl;
    if (data.imageFile) {
      imageUrl = URL.createObjectURL(data.imageFile);
    }

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
            <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
              <Image
                src={"/dog.png"}
                alt={dog.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-bold text-primary">{dog.name}</h1>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[11px] font-semibold px-2.5 rounded-full">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-secondary">
                {dog.primaryBreed} • {ageLabel} •{" "}
                {capitalize(dog.gender)}
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
            <DetailRow label="Name of Dog" value={dog.name} />
            <DetailRow label="Gender" value={capitalize(dog.gender)} />
            <DetailRow
              label="Spayed / Neutered"
              value={capitalize(dog.spayedNeutered)}
            />
            <DetailRow
              label="Birthday / Age of Pet"
              value={`${dog.birthday}${age !== null ? ` (${age} years)` : ""}`}
            />
            <DetailRow label="Primary Breed" value={dog.primaryBreed} />
            <DetailRow
              label="Additional Breed(s)"
              value={dog.additionalBreed || "N/A"}
            />
            <DetailRow
              label="Color(s) & Coat description"
              value={dog.colorCoat}
            />
            <DetailRow
              label="Microchipped"
              value={capitalize(dog.microchipped)}
            />
            <DetailRow
              label="Microchip number"
              value={
                dog.microchipped === "yes" ? dog.microchipNumber : "N/A"
              }
            />
            <DetailRow
              label="Microchip ID"
              value={dog.microchipped === "yes" ? dog.microchipId : "N/A"}
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
          name: dog.name,
          gender: dog.gender,
          spayedNeutered: dog.spayedNeutered,
          birthday: dog.birthday,
          primaryBreed: dog.primaryBreed,
          additionalBreed: dog.additionalBreed,
          colorCoat: dog.colorCoat,
          microchipped: dog.microchipped,
          microchipNumber: dog.microchipNumber,
          microchipId: dog.microchipId,
        }}
        currentImageUrl={dog.imageUrl}
      />
    </div>
  );
}
