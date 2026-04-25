"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { DogsStepValues } from "./application";
import { FormInput, FormSelect } from "./FormFields";


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

  const prefix = `dogs.${index}` as const;

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white relative">
      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-400 transition-colors"
          aria-label="Remove dog"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Photo upload */}
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 py-10 mb-5 cursor-pointer hover:border-[#5C7FC4]/50 hover:bg-blue-50/30 transition-all"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={() => {}}
        />
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Camera className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-600">
          Upload a photo of your dog
        </p>
        <p className="text-xs text-gray-400">oPG, PNG or GIF. Max size 5MB.</p>
      </div>

      {/* Name + Gender */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormSelect
          control={form.control}
          name={`${prefix}.spayedNeutered` as any}
          label="Spayed / Neutered"
          placeholder="Select"
          options={YES_NO_OPTIONS}
        />
        <FormInput
          control={form.control}
          name={`${prefix}.birthday` as any}
          label="Birthday / Age of Pet"
          placeholder="04/12/2020 (3 years)"
        />
      </div>

      {/* Breed */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          placeholder="N/A"
        />
      </div>

      {/* Color + Microchipped */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FormInput
          control={form.control}
          name={`${prefix}.colorCoatDescription` as any}
          label="Color(s) & Coat description"
          placeholder="Light golden, medium coat"
        />
        <FormSelect
          control={form.control}
          name={`${prefix}.microchipped` as any}
          label="Microchipped"
          placeholder="Select"
          options={YES_NO_OPTIONS}
        />
      </div>

      {/* Microchip details */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          control={form.control}
          name={`${prefix}.microchipNumber` as any}
          label="Microchip number"
          placeholder="1-800-252-7894"
        />
        <FormInput
          control={form.control}
          name={`${prefix}.microchipId` as any}
          label="Microchip ID"
          placeholder="989879456854964"
        />
      </div>
    </div>
  );
}
