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
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/api/userApi";
import { useUpdateProfileMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: meResponse, isLoading } = useGetMeQuery({});
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();
  const [updateProfile, { isLoading: isSavingMailingAddress }] = useUpdateProfileMutation();

  const me = meResponse?.data ?? meResponse;
  const currentPersonInfo = useMemo(() => {
    const applications = me?.applications || [];
    const sortedApplications = [...applications].sort((left: any, right: any) => {
      const leftTime = new Date(left?.createdAt || 0).getTime();
      const rightTime = new Date(right?.createdAt || 0).getTime();
      return rightTime - leftTime;
    });

    return sortedApplications[0]?.personInfo || null;
  }, [me?.applications]);

  const applicationId = useMemo(() => {
    const applications = me?.applications || [];
    const sortedApplications = [...applications].sort((left: any, right: any) => {
      const leftTime = new Date(left?.createdAt || 0).getTime();
      const rightTime = new Date(right?.createdAt || 0).getTime();
      return rightTime - leftTime;
    });

    return sortedApplications[0]?.id || null;
  }, [me?.applications]);

  const defaultValues = useMemo(() => {
    const [firstName = "", ...rest] = (me?.fullName || "").split(" ");
    return {
      firstName: firstName || "",
      lastName: rest.join(" ") || "",
      email: me?.email || "",
      streetAddress: currentPersonInfo?.streetAddress || "",
      city: currentPersonInfo?.city || "",
      stateProvince: currentPersonInfo?.state || "",
      postalCode: currentPersonInfo?.zipCode || "",
    };
  }, [currentPersonInfo, me?.email, me?.fullName]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const profileUpdate = updateMe({
        fullName: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email.trim(),
      }).unwrap();

      const mailingUpdate = applicationId
        ? updateProfile({
            applicationId,
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            streetAddress: data.streetAddress.trim(),
            city: data.city.trim(),
            state: data.stateProvince.trim(),
            zipCode: data.postalCode.trim(),
          }).unwrap()
        : Promise.resolve();

      await Promise.all([profileUpdate, mailingUpdate]);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Could not update profile");
    }
  };

  if (isLoading && !me) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
        <div className="h-5 w-48 bg-slate-100 rounded mb-3" />
        <div className="h-4 w-72 bg-slate-100 rounded mb-6" />
        <div className="space-y-4">
          <div className="h-10 bg-slate-100 rounded" />
          <div className="h-10 bg-slate-100 rounded" />
          <div className="h-10 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-secondary">Profile Information</h3>
        <p className="text-base text-muted-foreground mt-0.5">
          Update your personal details and mailing information.
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
                      className={
                        isEditing
                          ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                          : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                      }
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
                      className={
                        isEditing
                          ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                          : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-muted-foreground">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled={!isEditing}
                    className={
                      isEditing
                        ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                        : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                    }
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-secondary">Mailing Address</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Where should we send your physical documents?
              </p>
            </div>

            <div className="space-y-4">
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
                        className={
                          isEditing
                            ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                            : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                        }
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
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditing}
                          className={
                            isEditing
                              ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                              : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                          }
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
                          className={
                            isEditing
                              ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                              : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                          }
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
                          className={
                            isEditing
                              ? "border-slate-300 focus-visible:ring-slate-400 text-base"
                              : "border-dashed border-slate-200 bg-transparent text-secondary text-base"
                          }
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                  disabled={isSaving || isSavingMailingAddress}
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  {isSaving || isSavingMailingAddress ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
