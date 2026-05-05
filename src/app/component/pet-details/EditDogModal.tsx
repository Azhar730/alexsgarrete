"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Camera, X, Upload, Loader2 } from "lucide-react";

// ─── Zod Schema ───────────────────────────────────────────────
const dogSchema = z.object({
  name: z.string().min(1, "Dog name is required"),
  gender: z.string().min(1, "Please select a gender"),
  spayedNeutered: z.string().min(1, "Please select an option"),
  birthday: z
    .string()
    .min(1, "Birthday is required")
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Format must be MM/DD/YYYY"),
  primaryBreed: z.string().min(1, "Primary breed is required"),
  additionalBreed: z.string().optional(),
  colorCoat: z.string().min(1, "Color & coat description is required"),
  microchipped: z.string().min(1, "Please select an option"),
  microchipNumber: z.string().optional(),
  microchipId: z.string().optional(),
});

export type DogFormValues = z.infer<typeof dogSchema>;

export type DogFormData = DogFormValues & {
  imageFile: File | null;
  existingImageUrl?: string | null;
};

// ─── Props ────────────────────────────────────────────────────
interface EditDogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DogFormData) => Promise<void> | void;
  defaultValues?: Partial<DogFormData>;
}

// ─── Component ───────────────────────────────────────────────
export function EditDogModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}: EditDogModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.existingImageUrl ?? null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DogFormValues>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      gender: defaultValues?.gender ?? "",
      spayedNeutered: defaultValues?.spayedNeutered ?? "",
      birthday: defaultValues?.birthday ?? "",
      primaryBreed: defaultValues?.primaryBreed ?? "",
      additionalBreed: defaultValues?.additionalBreed ?? "",
      colorCoat: defaultValues?.colorCoat ?? "",
      microchipped: defaultValues?.microchipped ?? "",
      microchipNumber: defaultValues?.microchipNumber ?? "",
      microchipId: defaultValues?.microchipId ?? "",
    },
  });

  // Re-populate form when defaultValues change (e.g. modal re-opened with new dog)
  useEffect(() => {
    if (open && defaultValues) {
      form.reset({
        name: defaultValues.name ?? "",
        gender: defaultValues.gender ?? "",
        spayedNeutered: defaultValues.spayedNeutered ?? "",
        birthday: defaultValues.birthday ?? "",
        primaryBreed: defaultValues.primaryBreed ?? "",
        additionalBreed: defaultValues.additionalBreed ?? "",
        colorCoat: defaultValues.colorCoat ?? "",
        microchipped: defaultValues.microchipped ?? "",
        microchipNumber: defaultValues.microchipNumber ?? "",
        microchipId: defaultValues.microchipId ?? "",
      });
      setImagePreview(defaultValues.existingImageUrl ?? null);
      setImageFile(null);
      setImageError(null);
    }
  }, [open, defaultValues, form]);

  const microchipped = form.watch("microchipped");

  // ─── Image Handling ───────────────────────────────────────
  const handleImageFile = (file: File) => {
    setImageError(null);
    if (!file.type.match(/image\/(jpeg|png|gif)/)) {
      setImageError("Only JPG, PNG or GIF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("File size must be under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }, []);

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setImageError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Submit ───────────────────────────────────────────────
  const handleFormSubmit = async (values: DogFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...values,
        imageFile,
        existingImageUrl: imagePreview,
      });
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Close / Reset ────────────────────────────────────────
  const handleClose = () => {
    form.reset();
    removeImage();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[720px] max-h-[92vh] p-0 gap-0 rounded-3xl border-none shadow-2xl flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <DialogHeader className="px-8 pt-8 pb-5 border-b border-gray-50 bg-white shrink-0 z-10">
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Edit Dog Profile
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1 font-normal leading-relaxed">
            Update your furry friend&apos;s information below.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* ── Scrollable Content ── */}
            <div className="flex-1 overflow-y-auto px-8 py-7 space-y-8">
              {/* ── Photo Upload ── */}
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-gray-700">Photo</p>

                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                    <Image
                      src={imagePreview}
                      alt="Dog preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2.5 right-2.5 bg-white/95 hover:bg-white rounded-full p-1.5 shadow transition-all"
                    >
                      <X className="w-3.5 h-3.5 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 shadow flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3 h-3" />
                      Change photo
                    </button>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) =>
                      e.key === "Enter" && fileInputRef.current?.click()
                    }
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer select-none transition-all
                      ${
                        isDragging
                          ? "border-[#5B6BBF] bg-[#5B6BBF]/5"
                          : "border-gray-200 bg-gray-50/60 hover:border-[#5B6BBF] hover:bg-[#5B6BBF]/5"
                      }`}
                  >
                    <div className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center mb-3 shadow-sm">
                      <Camera className="w-6 h-6 text-[#5B6BBF]" />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      Upload a photo of your dog
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                      JPG, PNG or GIF · Max size 5MB
                    </p>
                  </div>
                )}

                {imageError && (
                  <p className="text-xs text-red-500 mt-1">{imageError}</p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                />
              </div>

              {/* ── Form Grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Name of Dog
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's your dog's name?"
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl border-gray-200 h-12 bg-gray-50/30 px-4 focus:ring-[#5B6BBF]/20">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Spayed / Neutered */}
                <FormField
                  control={form.control}
                  name="spayedNeutered"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Spayed / Neutered
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl border-gray-200 h-12 bg-gray-50/30 px-4 focus:ring-[#5B6BBF]/20">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Birthday */}
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Birthday / Age of Pet
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="MM/DD/YYYY"
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Primary Breed */}
                <FormField
                  control={form.control}
                  name="primaryBreed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Primary Breed
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Golden Retriever"
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Additional Breed */}
                <FormField
                  control={form.control}
                  name="additionalBreed"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Additional Breed(s){" "}
                        <span className="text-gray-400 font-normal italic">
                          (optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="If your dog is a mix, list other breeds here"
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Color & Coat */}
                <FormField
                  control={form.control}
                  name="colorCoat"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Color(s) &amp; Coat description
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Light golden, medium-length wavy coat"
                          {...field}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Microchipped */}
                <FormField
                  control={form.control}
                  name="microchipped"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Microchipped
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full rounded-xl border-gray-200 h-12 bg-gray-50/30 px-4 focus:ring-[#5B6BBF]/20">
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Microchip Number */}
                <FormField
                  control={form.control}
                  name="microchipNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Microchip number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            microchipped === "yes"
                              ? "1-800-252-7894"
                              : "Select 'Yes' to enable"
                          }
                          {...field}
                          disabled={microchipped !== "yes"}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Microchip ID */}
                <FormField
                  control={form.control}
                  name="microchipId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Microchip ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={
                            microchipped === "yes"
                              ? "989879456654964"
                              : "Select 'Yes' to enable"
                          }
                          {...field}
                          disabled={microchipped !== "yes"}
                          className="rounded-xl border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-12 bg-gray-50/30 px-4 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-end gap-3 bg-white shrink-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full px-6 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-8 h-12 bg-[#5B6BBF] hover:bg-[#4a5aa8] text-white font-semibold shadow-lg shadow-[#5B6BBF]/20 transition-all active:scale-95 min-w-[160px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
