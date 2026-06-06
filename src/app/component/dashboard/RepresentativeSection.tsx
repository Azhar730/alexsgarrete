"use client";

import { useState } from "react";
import { Edit2, User, Phone, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EditRepresentativeModal, RepresentativeFormData } from "./EditRepresentativeModal";
import { useUpdateRepresentativeMutation } from "@/redux/api/onboardingApi";

interface RepresentativeSectionProps {
  applicationId: string;
  representative: any;
  refetchApplications: () => void;
}

export default function RepresentativeSection({ applicationId, representative, refetchApplications }: RepresentativeSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updateRepresentative, { isLoading: isUpdating }] = useUpdateRepresentativeMutation();

  const handleUpdateRepresentative = async (values: RepresentativeFormData) => {
    try {
      await updateRepresentative({
        applicationId,
        ...values,
      }).unwrap();
      toast.success("Representative details updated successfully");
      refetchApplications();
    } catch (error: any) {
      console.error("Failed to update representative:", error);
      toast.error(error?.data?.message || "Failed to update representative details");
    }
  };

  if (!representative) {
    return null; // or show a placeholder if required
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Representative Contact
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/5 font-semibold"
          onClick={() => setIsEditModalOpen(true)}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">Full Name</p>
              <p className="text-sm font-medium text-slate-800">{representative.fullName || "N/A"}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">Relationship</p>
              <p className="text-sm font-medium text-slate-800">{representative.relationship || "N/A"}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">Contact Information</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {representative.cellPhone || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {representative.email || "N/A"}
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-1">Address</p>
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  {representative.streetAddress ? (
                    <>
                      {representative.streetAddress}<br />
                      {representative.city}, {representative.state} {representative.zipCode}
                    </>
                  ) : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditRepresentativeModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateRepresentative}
        defaultValues={representative}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
