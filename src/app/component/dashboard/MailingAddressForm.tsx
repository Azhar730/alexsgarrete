"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useUpdateProfileMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function MailingAddressForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: meResponse, isLoading } = useGetMeQuery({});
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const me = meResponse?.data ?? meResponse;
  const applicationId = useMemo(() => {
    const applications = me?.applications || [];
    const sortedApplications = [...applications].sort((left: any, right: any) => {
      const leftTime = new Date(left?.createdAt || 0).getTime();
      const rightTime = new Date(right?.createdAt || 0).getTime();
      return rightTime - leftTime;
    });

    return sortedApplications[0]?.id || null;
  }, [me?.applications]);

  const currentPersonInfo = useMemo(() => {
    const applications = me?.applications || [];
    const sortedApplications = [...applications].sort((left: any, right: any) => {
      const leftTime = new Date(left?.createdAt || 0).getTime();
      const rightTime = new Date(right?.createdAt || 0).getTime();
      return rightTime - leftTime;
    });

    return sortedApplications[0]?.personInfo || null;
  }, [me?.applications]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: currentPersonInfo?.firstName || "",
      lastName: currentPersonInfo?.lastName || "",
      streetAddress: currentPersonInfo?.streetAddress || "",
      city: currentPersonInfo?.city || "",
      stateProvince: currentPersonInfo?.state || "",
      postalCode: currentPersonInfo?.zipCode || "",
      country: currentPersonInfo?.country || "United States",
    },
  });

  useEffect(() => {
    form.reset({
      firstName: currentPersonInfo?.firstName || "",
      lastName: currentPersonInfo?.lastName || "",
      streetAddress: currentPersonInfo?.streetAddress || "",
      city: currentPersonInfo?.city || "",
      stateProvince: currentPersonInfo?.state || "",
      postalCode: currentPersonInfo?.zipCode || "",
      country: currentPersonInfo?.country || "United States",
    });
  }, [currentPersonInfo, form]);

  const onSubmit = async (data: AddressFormValues) => {
    if (!applicationId) {
      toast.error("No application found for this account.");
      return;
    }

    try {
      await updateProfile({
        applicationId,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        streetAddress: data.streetAddress.trim(),
        city: data.city.trim(),
        state: data.stateProvince.trim(),
        zipCode: data.postalCode.trim(),
      }).unwrap();

      toast.success("Mailing address updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update mailing address");
    }
  };

  const inputClass = (editing: boolean) =>
    editing
      ? "border-slate-300 focus-visible:ring-slate-400 text-base"
      : "border-dashed border-slate-200 bg-transparent text-secondary text-base";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-secondary">Mailing Address</h3>
        <p className="text-base text-muted-foreground mt-0.5">
          Where should we send your physical documents?
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="streetAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={!isEditing}
                    className={inputClass(isEditing)}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stateProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    State / Province
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    Postal Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">Country</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      className={inputClass(isEditing)}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="border-slate-200 text-muted-foreground"
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.reset();
                    setIsEditing(false);
                  }}
                  className="border-slate-200 text-muted-foreground"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
