"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";

const representativeSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  middleInitial: z.string().max(1, "One character only").optional(),
  relationship: z.string().min(1, "Relationship is required"),
  email: z.string().email("Enter a valid email").min(1, "Email is required"),
  phoneNumber: z.string().optional(),
  cellPhone: z.string().optional(),
  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

export type RepresentativeFormData = z.infer<typeof representativeSchema>;

interface EditRepresentativeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RepresentativeFormData) => Promise<void>;
  defaultValues?: Partial<RepresentativeFormData>;
  isSubmitting?: boolean;
}

export function EditRepresentativeModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
  isSubmitting = false,
}: EditRepresentativeModalProps) {
  const form = useForm<RepresentativeFormData>({
    resolver: zodResolver(representativeSchema),
    defaultValues: {
      fullName: "",
      middleInitial: "",
      relationship: "",
      email: "",
      phoneNumber: "",
      cellPhone: "",
      homePhone: "",
      workPhone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (open && defaultValues) {
      form.reset({
        fullName: defaultValues.fullName || "",
        middleInitial: defaultValues.middleInitial || "",
        relationship: defaultValues.relationship || "",
        email: defaultValues.email || "",
        phoneNumber: defaultValues.phoneNumber || "",
        cellPhone: defaultValues.cellPhone || "",
        homePhone: defaultValues.homePhone || "",
        workPhone: defaultValues.workPhone || "",
        streetAddress: defaultValues.streetAddress || "",
        city: defaultValues.city || "",
        state: defaultValues.state || "",
        zipCode: defaultValues.zipCode || "",
      });
    }
  }, [open, defaultValues, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: RepresentativeFormData) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton={false} className="w-[95vw] sm:w-full sm:max-w-[660px] p-0 gap-0 rounded-3xl border-none shadow-2xl overflow-hidden mx-auto">
        <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-5 border-b border-gray-50 bg-white">
          <DialogClose
            className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </DialogClose>
          <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">
            Edit Representative
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">Update your representative's contact details.</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col max-h-[80vh]">
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-5">

              {/* Name row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-sm font-semibold text-gray-700">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middleInitial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Middle Initial</FormLabel>
                      <FormControl>
                        <Input placeholder="A" maxLength={1} {...field} className="h-11 rounded-xl bg-gray-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Relationship + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="Spouse, Owner, etc." {...field} className="h-11 rounded-xl bg-gray-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="representative@example.com" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone numbers */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">Phone Numbers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="cellPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Cell Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="homePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Home Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="workPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Work Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 555-5555" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">Address</h4>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700">Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">State</FormLabel>
                          <FormControl>
                            <Input placeholder="CA" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-700">ZIP Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} className="h-11 rounded-xl bg-gray-50/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

            </div>

            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50/50 mt-auto flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-11 w-full sm:w-auto px-6 rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full sm:w-auto px-8 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
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
