"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Pencil, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { DogFormData, EditDogModal } from "@/app/component/dashboard/EditDogModal";
import { useParams } from "next/navigation";
import { useGetPetDetailsQuery } from "@/redux/api/onboardingApi";
import AppLayout from "@/app/component/dashboard/AppLayout";

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
      className={`flex flex-col sm:flex-row sm:items-center justify-between py-3.5 border-b border-gray-50 last:border-0 gap-1 sm:gap-4 ${
        bold ? "font-bold" : ""
      }`}
    >
      <span className={`text-sm shrink-0 ${bold ? "text-primary" : "text-secondary"}`}>
        {label}
      </span>
      <span className={`text-sm sm:text-right break-words ${bold ? "text-primary" : "text-primary font-semibold"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────
export default function PetDetailsPage() {
  const [editOpen, setEditOpen] = useState(false);
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
  const { data: petDetailsResponse, isLoading } = useGetPetDetailsQuery(
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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading pet details...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-primary hover:gap-2.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* ── Profile Header Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
              <Image
                src={currentDog.imageUrl || "/dog.png"}
                alt={currentDog.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-xl font-bold text-primary">{currentDog.name}</h1>
                {(() => {
                  const statusMap: Record<string, { label: string; className: string }> = {
                    ACTIVE: { label: "Active", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" },
                    QUOTE_READY: { label: "Quote Ready", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
                    QUOTE_ACCEPTED: { label: "Quote Accepted", className: "bg-teal-100 text-teal-700 hover:bg-teal-100" },
                    QUOTE_REJECTED: { label: "Quote Rejected", className: "bg-rose-100 text-rose-700 hover:bg-rose-100" },
                    IN_PROGRESS: { label: "In Progress", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
                  };
                  const currentStatus = petDetailsResponse?.data?.status || "ACTIVE";
                  const cfg = statusMap[currentStatus] || statusMap.ACTIVE;
                  return (
                    <Badge className={`${cfg.className} text-[11px] font-semibold px-2.5 rounded-full`}>
                      {cfg.label}
                    </Badge>
                  );
                })()}
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
            className="rounded-xl border-gray-200 text-primary hover:bg-[#f0f3ff] hover:border-[#5B6BBF] font-semibold text-sm gap-2 w-full sm:w-auto"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </div>

        {/* ── Quote & Payment Action Section ── */}
        {petDetailsResponse?.data?.status === "QUOTE_READY" && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
                Insurance Plan Ready for Review!
              </h2>
              <p className="text-sm text-slate-600">
                We have prepared a personalized quote of <span className="font-bold text-slate-900">${Number(petDetailsResponse?.data?.petCharge || 0).toFixed(2)}/mo</span> for <span className="font-semibold">{currentDog.name}</span>. Please review and accept to continue to payment.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              <Link href="/dashboard/quote/review" className="w-full md:w-auto">
                <Button className="bg-[#5C7FC4] hover:bg-[#4A6BAF] text-white font-semibold rounded-xl px-5 py-2.5 text-sm w-full cursor-pointer transition-colors">
                  Review & Accept Quote
                </Button>
              </Link>
            </div>
          </div>
        )}

        {petDetailsResponse?.data?.status === "QUOTE_ACCEPTED" && (
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 shadow-sm p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-teal-600 animate-ping shrink-0" />
                Quote Accepted! Next Step: Sign Agreement
              </h2>
              <p className="text-sm text-slate-600">
                You've successfully accepted the quote for <span className="font-semibold">{currentDog.name}</span>. Please sign the final agreement to proceed.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              <Link href="/dashboard/quote/agreement" className="w-full md:w-auto">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-5 py-2.5 text-sm w-full cursor-pointer transition-colors">
                  Sign Agreement
                </Button>
              </Link>
            </div>
          </div>
        )}

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
            <BillingRow 
              label="Monthly Premium" 
              value={petDetailsResponse?.data?.petCharge ? `$${Number(petDetailsResponse.data.petCharge).toFixed(2)}` : "N/A"} 
            />
            {petDetailsResponse?.data?.sendQuotes?.[0]?.setupFee && (
              <BillingRow 
                label="Policy Setup Fee" 
                value={`$${Number(petDetailsResponse.data.sendQuotes[0].setupFee).toFixed(2)}`} 
              />
            )}
            <BillingRow label="Add-ons (Wellness)" value="$0.00" />
            <BillingRow
              label="Payment Method"
              value={
                petDetailsResponse?.data?.status === "ACTIVE" ? (
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    Stripe Card (Connected)
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Not connected yet</span>
                )
              }
            />
            <BillingRow 
              label="Total Monthly" 
              value={petDetailsResponse?.data?.petCharge ? `$${Number(petDetailsResponse.data.petCharge).toFixed(2)}` : "N/A"} 
              bold 
            />
            <BillingRow 
              label="Coverage Next Steps" 
              value={(() => {
                const status = petDetailsResponse?.data?.status || "ACTIVE";
                if (status === "ACTIVE") return <span className="text-emerald-600 font-bold">Policy Active</span>;
                if (status === "QUOTE_READY") return <span className="text-blue-600 font-bold">Awaiting Quote Acceptance</span>;
                if (status === "QUOTE_ACCEPTED") return <span className="text-teal-600 font-bold">Awaiting Signed Agreement & Payment</span>;
                if (status === "IN_PROGRESS") return <span className="text-amber-600 font-bold">Under Review</span>;
                return <span className="text-slate-500 font-bold">Pending Setup</span>;
              })()} 
            />
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
    </AppLayout>
  );
}