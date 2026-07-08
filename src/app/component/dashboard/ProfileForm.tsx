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
import { useUploadFileMutation } from "@/redux/api/storageApi";
import { toast } from "sonner";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleInitial: z.string().max(1, "Max 1 character").optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  homePhone: z.string().optional(),
  workPhone: z.string().optional(),
  cellPhone: z.string().optional(),
  ssnLast4: z.string().max(4, "Max 4 characters").optional(),
  birthday: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: meResponse, isLoading } = useGetMeQuery({});
  const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();
  const [updateProfile, { isLoading: isSavingMailingAddress }] = useUpdateProfileMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

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
    const [splitFirst = "", ...splitRest] = (me?.fullName || "").split(" ");
    return {
      firstName: currentPersonInfo?.firstName || splitFirst || "",
      middleInitial: currentPersonInfo?.middleInitial || "",
      lastName: currentPersonInfo?.lastName || splitRest.join(" ") || "",
      email: me?.email || "",
      streetAddress: currentPersonInfo?.streetAddress || "",
      city: currentPersonInfo?.city || "",
      stateProvince: currentPersonInfo?.state || "",
      postalCode: currentPersonInfo?.zipCode || "",
      homePhone: currentPersonInfo?.homePhone || "",
      workPhone: currentPersonInfo?.workPhone || "",
      cellPhone: currentPersonInfo?.cellPhone || "",
      ssnLast4: currentPersonInfo?.ssnLast4 || "",
      birthday: currentPersonInfo?.birthday ? new Date(currentPersonInfo.birthday).toISOString().split("T")[0] : "",
    };
  }, [currentPersonInfo, me?.email, me?.fullName]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload an image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await uploadFile(formData).unwrap();
      if (response?.url) {
        await updateMe({ avatarUrl: response.url }).unwrap();
        toast.success("Profile picture updated successfully");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload image");
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateMe({ avatarUrl: null }).unwrap();
      toast.success("Profile picture removed successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove profile picture");
    }
  };

  const displayName = me?.fullName || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
            middleInitial: data.middleInitial?.trim(),
            lastName: data.lastName.trim(),
            streetAddress: data.streetAddress.trim(),
            city: data.city.trim(),
            state: data.stateProvince.trim(),
            zipCode: data.postalCode.trim(),
            homePhone: data.homePhone?.trim(),
            workPhone: data.workPhone?.trim(),
            cellPhone: data.cellPhone?.trim(),
            ssnLast4: data.ssnLast4?.trim(),
            birthday: data.birthday ? new Date(data.birthday).toISOString() : undefined,
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

      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 mb-6 border-b border-slate-100">
        <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 shadow-sm">
          {isUploading ? (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : null}
          {me?.avatarUrl ? (
            <img
              src={me.avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-slate-500">{initials}</span>
          )}
          
          <label
            htmlFor="avatar-upload"
            className={cn(
              "absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer text-[10px] font-medium gap-1",
              isUploading && "pointer-events-none"
            )}
          >
            <Camera className="w-5 h-5" />
            <span>Change</span>
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 className="text-sm font-semibold text-secondary">Profile Picture</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-3">
            PNG, JPG or WEBP. Max 5MB.
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-200 text-muted-foreground relative h-8 px-3 text-xs"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              disabled={isUploading}
            >
              Upload Picture
            </Button>
            {me?.avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8 px-3 text-xs flex items-center gap-1"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              name="middleInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    M.I.
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      maxLength={1}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        disabled={true}
                        className="border-dashed border-slate-200 bg-gray-50/50 cursor-not-allowed text-secondary text-base opacity-70"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
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
                name="ssnLast4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      SSN (Last 4)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={4}
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

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-secondary mb-3">Phone Numbers</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="cellPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Cell Phone
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
                  name="homePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Home Phone
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
                  name="workPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-muted-foreground">
                        Work Phone
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
