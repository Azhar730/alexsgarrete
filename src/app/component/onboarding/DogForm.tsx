"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, Upload, Loader2 } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { DogsStepValues } from "./application";
import { FormInput, FormSelect } from "./FormFields";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUploadFileMutation } from "@/redux/api/storageApi";
import { cn } from "@/lib/utils";
import { toast } from "sonner";


const GENDER_OPTIONS = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const YES_NO_OPTIONS = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

interface DogFormProps {
  index: number;
  onRemove?: () => void;
  canRemove?: boolean;
}

export function DogForm({ index, onRemove, canRemove }: DogFormProps) {
  const form = useFormContext<DogsStepValues>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ageMode, setAgeMode] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const prefix = `dogs.${index}` as const;

  const microchippedValue = useWatch({
    control: form.control,
    name: `${prefix}.microchipped` as any,
  });
  const isMicrochipDisabled = microchippedValue !== "Yes";

  const photoUrlValue = useWatch({
    control: form.control,
    name: `${prefix}.photoUrl` as any,
  });

  const [uploadFile, { isLoading: isUploadingImage }] = useUploadFileMutation();

  useEffect(() => {
    if (isMicrochipDisabled) {
      form.setValue(`${prefix}.microchipNumber` as any, "");
      form.setValue(`${prefix}.microchipId` as any, "");
    }
  }, [isMicrochipDisabled, prefix, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|png|gif)/)) {
      toast.error("Only JPG, PNG or GIF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file);
      const res = await uploadFile(formData).unwrap();
      form.setValue(`${prefix}.photoUrl` as any, res.url, { shouldValidate: true });
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      console.error("Photo upload error:", err);
      toast.error("Failed to upload photo. Please try again.");
    }
  };

  const removeImage = () => {
    form.setValue(`${prefix}.photoUrl` as any, "", { shouldValidate: true });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white relative">
      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors"
          aria-label="Remove dog"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Photo upload */}
      {photoUrlValue ? (
        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group mb-5">
          <img
            src={photoUrlValue}
            alt="Dog preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2.5 right-2.5 bg-white/95 hover:bg-white rounded-full p-1.5 shadow transition-all cursor-pointer z-10"
          >
            <X className="w-3.5 h-3.5 text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 shadow flex items-center gap-1.5 transition-all cursor-pointer z-10"
          >
            <Upload className="w-3 h-3" />
            Change photo
          </button>
        </div>
      ) : (
        <div
          onClick={() => !isUploadingImage && fileRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 py-10 mb-5 cursor-pointer hover:border-[#5C7FC4]/50 hover:bg-blue-50/30 transition-all",
            isUploadingImage && "opacity-60 cursor-not-allowed"
          )}
        >
          {isUploadingImage ? (
            <Loader2 className="w-8 h-8 text-[#5C7FC4] animate-spin" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Camera className="w-5 h-5 text-gray-400" />
            </div>
          )}
          <p className="text-sm font-medium text-gray-600">
            {isUploadingImage ? "Uploading photo..." : "Upload a photo of your dog"}
          </p>
          <p className="text-xs text-gray-400">JPG, PNG or GIF. Max size 5MB.</p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Name + Gender */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          control={form.control}
          name={`${prefix}.name` as any}
          label="Name of Dog"
          placeholder="Max"
        />
        <FormSelect
          control={form.control}
          name={`${prefix}.gender` as any}
          label="Gender"
          placeholder="Select gender"
          options={GENDER_OPTIONS}
        />
      </div>

      {/* Spayed + Birthday */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormSelect
          control={form.control}
          name={`${prefix}.spayedNeutered` as any}
          label="Spayed / Neutered"
          placeholder="Select"
          options={YES_NO_OPTIONS}
        />
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Birthday / Age of Pet</label>
            <button
              type="button"
              onClick={() => setAgeMode(!ageMode)}
              className="text-xs text-[#5C7FC4] hover:underline font-medium"
            >
              {ageMode ? "Enter Date" : "Don't know date?"}
            </button>
          </div>
          {ageMode ? (
            <div>
              <input
                type="number"
                min="0"
                placeholder="Approximate age in years"
                onChange={(e) => {
                  const age = parseInt(e.target.value);
                  if (!isNaN(age) && age >= 0) {
                    const d = new Date();
                    d.setFullYear(d.getFullYear() - age);
                    d.setMonth(0);
                    d.setDate(1);
                    form.setValue(`${prefix}.birthday` as any, d.toISOString().split("T")[0], { shouldValidate: true });
                  } else {
                    form.setValue(`${prefix}.birthday` as any, "", { shouldValidate: true });
                  }
                }}
                className="h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-[#5C7FC4]/30 focus:border-[#5C7FC4] outline-none transition-all"
              />
              <p className="text-[11px] text-gray-400 mt-1">Select an approximate date based on presumed age</p>
              <div className="hidden">
                <FormInput
                  control={form.control}
                  name={`${prefix}.birthday` as any}
                  type="date"
                />
              </div>
            </div>
          ) : (
            <FormInput
              control={form.control}
              name={`${prefix}.birthday` as any}
              type="date"
              max={today}
            />
          )}
        </div>
      </div>

      {/* Breed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          control={form.control}
          name={`${prefix}.primaryBreed` as any}
          label="Primary Breed"
          placeholder="Golden Retriever"
        />
        <FormInput
          control={form.control}
          name={`${prefix}.additionalBreeds` as any}
          label="Additional Breed(s)"
          placeholder="Enter breed name"
        />
      </div>

      {/* Color + Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormInput
          control={form.control}
          name={`${prefix}.colorCoatDescription` as any}
          label="Color(s) & Coat description"
          placeholder="Light golden, medium coat"
        />
        <FormInput
          control={form.control}
          name={`${prefix}.weight` as any}
          label="Weight"
          placeholder="e.g. 15 lbs"
        />
      </div>

      {/* Microchipped */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <FormSelect
          control={form.control}
          name={`${prefix}.microchipped` as any}
          label="Microchipped"
          placeholder="Select"
          options={YES_NO_OPTIONS}
        />
      </div>

      {/* Microchip details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          control={form.control}
          name={`${prefix}.microchipNumber` as any}
          label="Microchip number"
          placeholder="1-800-252-7894"
          numericType="zip"
          disabled={isMicrochipDisabled}
        />
        <FormInput
          control={form.control}
          name={`${prefix}.microchipId` as any}
          label="Microchip ID"
          placeholder="989879456854964"
          numericType="digits"
          disabled={isMicrochipDisabled}
        />
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete dog profile?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this dog profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              No, keep it
            </button>
            <button
              type="button"
              onClick={() => {
                onRemove?.();
                setConfirmOpen(false);
              }}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Yes, delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
