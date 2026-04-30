"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
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
const dogSchema = z
  .object({
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
  })
  .superRefine((data, ctx) => {
    if (data.microchipped === "yes") {
      if (!data.microchipNumber || data.microchipNumber.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Microchip number is required",
          path: ["microchipNumber"],
        });
      }
      if (!data.microchipId || data.microchipId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Microchip ID is required",
          path: ["microchipId"],
        });
      }
    }
  });

export type DogFormData = z.infer<typeof dogSchema> & {
  imageFile: File | null;
};

// ─── Props ────────────────────────────────────────────────────
interface AddDogModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DogFormData) => Promise<void> | void;
}

// ─── Component ───────────────────────────────────────────────
export function AddDogModal({ open, onClose, onSubmit }: AddDogModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof dogSchema>>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
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
    },
  });

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
  const handleFormSubmit = async (values: z.infer<typeof dogSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit({ ...values, imageFile });
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
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0 rounded-2xl border border-gray-100 shadow-xl">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add a New Dog
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-0.5 font-normal">
            Tell us about your furry friend so we can better accommodate their needs.
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="px-6 py-5 space-y-6">

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
                    {/* Overlay on hover */}
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
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer select-none transition-all
                      ${isDragging
                        ? "border-[#5B6BBF] bg-[#5B6BBF]/5"
                        : "border-gray-200 bg-gray-50/60 hover:border-[#5B6BBF] hover:bg-[#5B6BBF]/5"
                      }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2.5 shadow-sm">
                      <Camera className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Upload a photo of your dog</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF · Max size 5MB</p>
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
              <div className="grid grid-cols-1  gap-x-5 gap-y-4">

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">Name of Dog</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Max"
                          {...field}
                          className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
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
                      <FormLabel className="text-sm text-gray-600">Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-lg border-gray-200 h-10 focus:ring-[#5B6BBF]/20">
                            <SelectValue placeholder="Select" />
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
                      <FormLabel className="text-sm text-gray-600">Spayed / Neutered</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-lg border-gray-200 h-10 focus:ring-[#5B6BBF]/20">
                            <SelectValue placeholder="Select" />
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
                      <FormLabel className="text-sm text-gray-600">Birthday / Age of Pet</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="04/12/2020"
                          {...field}
                          className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
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
                      <FormLabel className="text-sm text-gray-600">Primary Breed</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Golden Retriever"
                          {...field}
                          className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
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
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">
                        Additional Breed(s){" "}
                        <span className="text-gray-400 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="N/A"
                          {...field}
                          className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
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
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">Color(s) & Coat description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Light golden, medium coat"
                          {...field}
                          className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
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
                      <FormLabel className="text-sm text-gray-600">Microchipped</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-lg border-gray-200 h-10 focus:ring-[#5B6BBF]/20">
                            <SelectValue placeholder="Select" />
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

                {/* Conditional Microchip Fields */}
                {microchipped === "yes" && (
                  <>
                    <FormField
                      control={form.control}
                      name="microchipNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-600">Microchip number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1-800-252-7894"
                              {...field}
                              className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="microchipId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm text-gray-600">Microchip ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="989879456654964"
                              {...field}
                              className="rounded-lg border-gray-200 focus-visible:ring-[#5B6BBF]/20 focus-visible:border-[#5B6BBF] h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full px-5 border-gray-200 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full px-6 bg-[#5B6BBF] hover:bg-[#4a5aa8] text-white min-w-[100px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Add Dog"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}