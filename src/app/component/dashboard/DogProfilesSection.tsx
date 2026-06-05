"use client";
import { Button } from "@/components/ui/button";
import DogProfileCard from "./DogProfileCard";
import { DogProfile } from ".";
import { useState, useEffect } from "react";
import { AddDogModal } from "./AddDogModal";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyApplicationsQuery, useGetMyQuotesQuery } from "@/redux/api/onboardingApi";
import { toast } from "sonner";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";
import { useGetMyAgreementsQuery } from "@/redux/api/agreementApi";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AgreementTemplate } from "./AgreementTemplate";

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
  const [activeQuoteGroupId, setActiveQuoteGroupId] = useState<string | null>(null);
  const { data: userData } = useGetMeQuery({});
  const { data: applicationsResponse } = useGetMyApplicationsQuery(undefined);
  const { data: quotesResponse } = useGetMyQuotesQuery(undefined);
  const { data: agreementsResponse } = useGetMyAgreementsQuery(undefined);
  const { data: myPayments } = useGetMyPaymentsQuery(undefined);
  console.log("userData", userData)
  console.log("applicationsResponse", applicationsResponse)
  console.log("quotesResponse", quotesResponse)
  console.log("agreementsResponse", agreementsResponse)
  console.log("myPayments", myPayments)
  const pets: ApiPet[] = userData?.data?.pets || [];

  useEffect(() => {
    if (activeQuoteGroupId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeQuoteGroupId]);

  const currentApplication = applicationsResponse?.data?.find((a: any) => a.id === applicationId) || applicationsResponse?.data?.[0];
  const quoteGroups = quotesResponse?.data || [];
  const agreements = agreementsResponse?.data || [];
  const isQuoteSigned = (quoteGroupId: string | undefined) => {
    if (!quoteGroupId) return false;
    const group = quoteGroups.find((qg: any) => qg.quoteGroupId === quoteGroupId);
    if (!group) return false;
    if (!group.isAccepted) return false;
    
    return agreements.some((agreement: any) => {
      const sameQuoteGroup = agreement.quoteId === group.quoteGroupId;
      const sameQuote = group.quotes?.some((quote: any) => quote.id === agreement.quoteId);
      const signed = agreement.isSigned === true;
      return signed && (sameQuoteGroup || sameQuote);
    });
  };

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

  const selectedQuoteGroup = quoteGroups.find((qg: any) => qg.quoteGroupId === activeQuoteGroupId);
  const currentAgreement = agreements.find((a: any) =>
    selectedQuoteGroup?.quotes?.some((q: any) => q.id === a.quoteId)
  );
  const activeApplication = currentApplication || applicationsResponse?.data?.[0];

  const getAgreementParams = (quoteGroup: any) => {
    const quote = quoteGroup?.quotes?.[0];
    const agrementUrl = quote?.agrementUrl || "";
    const queryStr = agrementUrl.includes("?") ? agrementUrl.split("?")[1] : "";
    const params = new URLSearchParams(queryStr);
    return {
      transportFee: Number(params.get("transportFee") || 50),
      spayNeuterFee: Number(params.get("spayNeuterFee") || 150),
      dueDay: Number(params.get("dueDay") || 1),
      lateFee: Number(params.get("lateFee") || 25),
      representativeSignatureUrl: params.get("representativeSignatureUrl") || null,
      adminName: params.get("adminName") || null,
      setupFee: Number(quoteGroup?.setupFee || 10),
    };
  };

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
              acceptedQuoteSigned={isQuoteSigned(dog.quoteGroupId)}
              onViewAgreement={setActiveQuoteGroupId}
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

      {/* View Agreement Modal */}
      <AnimatePresence>
        {activeQuoteGroupId && selectedQuoteGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
            onClick={() => setActiveQuoteGroupId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Pet Guardianship Agreement</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedQuoteGroup?.quotes?.map((q: any) => q.pet?.name).join(", ")} • Active
                  </p>
                </div>
                <button
                  onClick={() => setActiveQuoteGroupId(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 select-none custom-scrollbar overscroll-contain" data-lenis-prevent>
                {(() => {
                  const params = getAgreementParams(selectedQuoteGroup);
                  const personInfo = activeApplication?.personInfo;
                  const rep = activeApplication?.representative;

                  return (
                    <AgreementTemplate
                      clientName={
                        personInfo
                          ? `${personInfo.firstName} ${personInfo.middleInitial ? personInfo.middleInitial + " " : ""}${personInfo.lastName}`
                          : userData?.data?.fullName || ""
                      }
                      clientAddress={
                        personInfo
                          ? `${personInfo.streetAddress || ""}, ${personInfo.city || ""}, ${personInfo.state || ""} ${personInfo.zipCode || ""}`
                          : ""
                      }
                      clientPhone={
                        personInfo?.cellPhone ||
                        personInfo?.homePhone ||
                        personInfo?.workPhone ||
                        ""
                      }
                      clientEmail={userData?.data?.email || ""}
                      representativeName={rep?.fullName || ""}
                      representativeEmail={rep?.email || ""}
                      representativePhone={
                        rep?.phoneNumber ||
                        rep?.cellPhone ||
                        rep?.homePhone ||
                        ""
                      }
                      adminName={params.adminName || ""}

                      clientFirstName={personInfo?.firstName || ""}
                      clientLastName={personInfo?.lastName || ""}
                      clientMiddleInitial={personInfo?.middleInitial || ""}
                      clientSsnLast4={personInfo?.ssnLast4 || ""}
                      clientHomePhone={personInfo?.homePhone || ""}
                      clientWorkPhone={personInfo?.workPhone || ""}

                      representativeFirstName={rep?.fullName?.split(" ")[0] || ""}
                      representativeLastName={rep?.fullName?.split(" ").slice(1).join(" ") || ""}
                      representativeMiddleInitial={rep?.middleInitial || ""}
                      representativeAddress={rep?.streetAddress || ""}
                      representativeCityStateZip={
                        rep 
                          ? `${rep.city || ""}${rep.state ? ", " + rep.state : ""}${rep.zipCode ? " " + rep.zipCode : ""}` 
                          : ""
                      }
                      representativeRelation={rep?.relationship || ""}
                      representativeHomePhone={rep?.homePhone || ""}
                      representativeWorkPhone={rep?.workPhone || ""}

                      transportFeePerDog={params.transportFee}
                      spayNeuterFeePerDog={params.spayNeuterFee}
                      dueDay={params.dueDay}
                      lateFee={params.lateFee}

                      pets={
                        (selectedQuoteGroup?.quotes || []).map((q: any) => ({
                          name: q.pet?.name || "N/A",
                          species: q.pet?.species || "Dog",
                          gender: q.pet?.gender || "MALE",
                          spayedNeutered: q.pet?.isSpayedNeutered ? "Yes" : "No",
                          primaryBreed: q.pet?.primaryBreed || "Unknown",
                          additionalBreed: q.pet?.additionalBreed || "None",
                          colorsAndCoat: q.pet?.colorsAndCoat || "N/A",
                          birthday: q.pet?.birthday,
                          isMicrochipped: q.pet?.isMicrochipped ? "Yes" : "No",
                          microchipNumber: q.pet?.microchipNumber,
                          petCharge: Number(q.pet?.petCharge || q.petCharge || 0),
                        }))
                      }
                      setupFee={params.setupFee}
                      totalMonthlyCharge={Number(selectedQuoteGroup?.totalMonthlyCharge || 0)}
                      isSigned={!!currentAgreement?.isSigned}
                      signatureDocUrl={currentAgreement?.signatureDocUrl || null}
                      signedDate={currentAgreement?.signedAt || null}
                      representativeSignatureUrl={params.representativeSignatureUrl}
                    />
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
