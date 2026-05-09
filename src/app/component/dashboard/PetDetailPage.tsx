"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditDogModal, DogFormData } from "./EditDogModal";

// ─── Mock Data ───────────────────────────────────────────────
const initialDogData: DogFormData & { imagePreview: string; status: string } = {
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
  imageFile: null,
  imagePreview: "/dog-placeholder.jpg",
  status: "Active",
};

// ─── Detail Row ───────────────────────────────────────────────
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[13px] text-gray-400 font-normal leading-none">
        {label}
      </span>
      <span className="text-[15px] font-semibold text-gray-900 leading-snug">
        {value || "N/A"}
      </span>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────
function Divider() {
  return <div className="col-span-2 border-t border-gray-100" />;
}

// ─── Main Page ───────────────────────────────────────────────
export default function PetDetailPage() {
  const [dogData, setDogData] = useState(initialDogData);
  const [editOpen, setEditOpen] = useState(false);

  const handleEditSubmit = async (data: DogFormData) => {
    // In real usage, call your API here
    const preview = data.imageFile
      ? URL.createObjectURL(data.imageFile)
      : dogData.imagePreview;
    setDogData({ ...dogData, ...data, imagePreview: preview });
  };

  // Compute age from birthday
  const computeAge = (birthday: string): string => {
    if (!birthday) return "";
    const [month, day, year] = birthday.split("/").map(Number);
    if (!month || !day || !year) return "";
    const birth = new Date(year, month - 1, day);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return `${dogData.birthday} (${age} year${age !== 1 ? "s" : ""})`;
  };

  const genderLabel =
    dogData.gender === "male"
      ? "Male"
      : dogData.gender === "female"
      ? "Female"
      : dogData.gender;

  const spayedLabel =
    dogData.spayedNeutered === "yes"
      ? "Yes"
      : dogData.spayedNeutered === "no"
      ? "No"
      : dogData.spayedNeutered;

  const microchipLabel =
    dogData.microchipped === "yes"
      ? "Yes"
      : dogData.microchipped === "no"
      ? "No"
      : dogData.microchipped;

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <div className="max-w-[900px] mx-auto px-4 py-8 space-y-4">
        {/* ── Back Button ── */}
        <button
          onClick={() => {}}
          className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-900 transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm px-7 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-gray-200 shrink-0 bg-gray-100">
              <Image
                src={dogData.imagePreview}
                alt={dogData.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Name + meta */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-[22px] font-bold text-gray-900 tracking-tight leading-none">
                  {dogData.name}
                </h1>
                {dogData.status === "Active" && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full leading-none">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[13px] text-gray-500 leading-none">
                {dogData.primaryBreed} •{" "}
                {(() => {
                  const [, , y] = dogData.birthday.split("/").map(Number);
                  const birth = new Date(
                    y,
                    +dogData.birthday.split("/")[0] - 1,
                    +dogData.birthday.split("/")[1]
                  );
                  const age =
                    new Date().getFullYear() - birth.getFullYear();
                  return `${age} years old`;
                })()} •{" "}
                {genderLabel}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-1.5 text-[13px] text-gray-600 border-gray-200 rounded-lg hover:bg-gray-50 h-9 px-4 shadow-none font-medium"
          >
            <PencilLine className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </div>

        {/* ── Pet Details Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm px-7 py-6">
          <h2 className="text-[15px] font-bold text-gray-900 mb-5">
            Pet Details
          </h2>

          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <DetailRow label="Name of Dog" value={dogData.name} />
            <DetailRow label="Gender" value={genderLabel} />

            <Divider />

            <DetailRow label="Spayed / Neutered" value={spayedLabel} />
            <DetailRow
              label="Birthday / Age of Pet"
              value={computeAge(dogData.birthday)}
            />

            <Divider />

            <DetailRow label="Primary Breed" value={dogData.primaryBreed} />
            <DetailRow
              label="Additional Breed(s)"
              value={dogData.additionalBreed || "N/A"}
            />

            <Divider />

            <DetailRow
              label="Color(s) & Coat description"
              value={dogData.colorCoat}
            />
            <DetailRow label="Microchipped" value={microchipLabel} />

            <Divider />

            <DetailRow
              label="Microchip number"
              value={
                dogData.microchipped === "yes"
                  ? dogData.microchipNumber || "N/A"
                  : "N/A"
              }
            />
            <DetailRow
              label="Microchip ID"
              value={
                dogData.microchipped === "yes"
                  ? dogData.microchipId || "N/A"
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* ── Billing Summary Card ── */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm px-7 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[15px] font-bold text-gray-900">
              Billing Summary
            </h2>
            <button className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">
              Manage
            </button>
          </div>

          <div className="space-y-0">
            {/* Row */}
            {[
              { label: "Monthly Premium", value: "$45.00", sub: null },
              { label: "Add-ons (Wellness)", value: "$0.00", sub: null },
              {
                label: "Payment Method",
                value: "•••• 4242",
                sub: "card",
              },
            ].map(({ label, value, sub }) => (
              <div
                key={label}
                className="flex items-center justify-between py-3.5 border-b border-dashed border-gray-100 last:border-0"
              >
                <span className="text-[13px] text-gray-400">{label}</span>
                <span className="text-[13px] text-gray-900 font-medium flex items-center gap-1.5">
                  {sub === "card" && (
                    <span className="inline-block w-8 h-5 bg-gray-100 rounded border border-gray-200 mr-1" />
                  )}
                  {value}
                </span>
              </div>
            ))}

            {/* Total */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-[14px] font-bold text-gray-900">
                Total Monthly
              </span>
              <span className="text-[15px] font-bold text-gray-900">
                $45.00
              </span>
            </div>

            {/* Next Payment */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[13px] text-gray-400">
                Next Payment Date
              </span>
              <span className="text-[13px] text-gray-900 font-medium">
                Nov 12, 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <EditDogModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditSubmit}
        defaultValues={{
          name: dogData.name,
          gender: dogData.gender,
          spayedNeutered: dogData.spayedNeutered,
          birthday: dogData.birthday,
          primaryBreed: dogData.primaryBreed,
          additionalBreed: dogData.additionalBreed || "",
          colorCoat: dogData.colorCoat,
          microchipped: dogData.microchipped,
          microchipNumber: dogData.microchipNumber || "",
          microchipId: dogData.microchipId || "",
        }}
        currentImageUrl={dogData.imagePreview}
      />
    </div>
  );
}
