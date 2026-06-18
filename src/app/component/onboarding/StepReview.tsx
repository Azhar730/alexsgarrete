"use client";

import { useState } from "react";
import { User, Heart, Users } from "lucide-react";
import { useApplication } from "./application-context";
import { ReviewRow, ReviewSection } from "./ReviewSection";
import { useUpdateApplicationStatusMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function StepReview({ applicationId }: { applicationId?: string }) {
  const { data, prevStep } = useApplication();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();
  const router = useRouter();

  const { personalInfo, dogs, representative, healthDetails } = data;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const id = applicationId;
      if (!id) {
        toast.error("Missing application id");
        return;
      }
      const payload = { applicationId: id, status: "UNDER_REVIEW" };
      const res = await updateApplicationStatus(payload).unwrap();
      if (res?.success) {
        toast.success(res.message ?? "Application submitted successfully");
        router.push("/dashboard");
      } else {
        toast.error(res?.message ?? "Failed to submit application");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <span className="text-3xl">🐾</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Application Submitted!
        </h2>
        <p className="text-sm text-gray-500 max-w-sm">
          Our team will review your application and generate a care plan quote.
          We&apos;ll be in touch within 1-2 business days.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Step 5: Review &amp; Submit
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Please review the details below. Once submitted, our team will review
          your application and generate a care plan quote.
        </p>
        <div className="mt-4 border-t border-gray-100" />
      </div>

      <div className="flex flex-col gap-4">
        {/* Personal Info */}
        <ReviewSection
          icon={<User className="w-4 h-4" />}
          title="Personal Information"
          stepId={1}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <ReviewRow
              label="Full Name"
              value={
                personalInfo
                  ? [
                      personalInfo.firstName,
                      personalInfo.middleInitial,
                      personalInfo.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")
                  : undefined
              }
            />
            <ReviewRow
              label="Date of Birth"
              value={
                personalInfo?.birthday
                  ? new Date(personalInfo.birthday).toLocaleDateString()
                  : undefined
              }
            />
            <ReviewRow
              label="Address"
              fullWidth
              value={
                personalInfo
                  ? `${personalInfo.streetAddress}, ${personalInfo.city}, ${personalInfo.state} ${personalInfo.zipCode}`
                  : undefined
              }
            />
            <ReviewRow
              label="Phone Number"
              value={personalInfo?.cellPhone}
            />
            <ReviewRow
              label="Email"
              value={personalInfo?.email}
            />
          </div>
        </ReviewSection>

        {/* Health Details */}
        <ReviewSection
          icon={<Heart className="w-4 h-4" />}
          title="Health Questionnaire"
          stepId={4}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <ReviewRow
              label="General Health Status"
              value={
                healthDetails
                  ? healthDetails.chronicConditions === "No" &&
                    healthDetails.terminalConditions === "No"
                    ? "Good"
                    : "Conditions disclosed"
                  : undefined
              }
            />
            <ReviewRow
              label="Pre-existing Conditions"
              value={
                healthDetails
                  ? healthDetails.terminalConditions === "No"
                    ? "None disclosed"
                    : healthDetails.terminalExplanation
                  : undefined
              }
            />
          </div>
        </ReviewSection>

        {/* Dog Information */}
        {dogs?.map((dog, i) => (
          <ReviewSection
            key={i}
            icon={<span className="text-sm">🐶</span>}
            title={dogs.length > 1 ? `Dog Information — ${dog.name}` : "Dog Information"}
            stepId={2}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <ReviewRow label="Dog Name" value={dog.name} />
              <ReviewRow label="Breed" value={dog.primaryBreed} />
              <ReviewRow label="Age" value={dog.birthday} />
              <ReviewRow
                label="Size / Weight"
                value={dog.colorCoatDescription}
              />
              <ReviewRow
                label="Microchip ID"
                fullWidth
                value={dog.microchipId}
              />
            </div>
          </ReviewSection>
        ))}

        {/* Representative */}
        <ReviewSection
          icon={<Users className="w-4 h-4" />}
          title="Point of Contact (Executor)"
          stepId={3}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            <ReviewRow
              label="Full Name"
              value={
                representative
                  ? [
                      representative.firstName,
                      representative.middleInitial,
                      representative.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ")
                  : undefined
              }
            />
            <ReviewRow
              label="Relationship"
              value={representative?.relationship}
            />
            <ReviewRow
              label="Phone Number"
              value={representative?.phoneNumber}
            />
            <ReviewRow label="Email Address" value={representative?.email} />
          </div>
        </ReviewSection>
      </div>

      {/* Bottom nav */}
      <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between mt-6 pt-4 border-t border-gray-100 gap-3 sm:gap-0">
        <div className="w-full sm:w-auto">
          <button
            type="button"
            onClick={prevStep}
            className="flex justify-center items-center w-full sm:w-auto gap-1 px-4 py-3 sm:py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="flex flex-col-reverse sm:flex-row w-full sm:w-auto gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="flex justify-center items-center w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Save and Exit
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex justify-center items-center w-full sm:w-auto gap-2 px-6 py-3 sm:py-2 text-sm font-semibold text-white bg-[#5C7FC4] rounded-md hover:bg-[#4A6BAF] transition-colors disabled:opacity-60 shadow-sm"
          >
            {isSubmitting && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Submit Application →
          </button>
        </div>
      </div>
    </div>
  );
}
