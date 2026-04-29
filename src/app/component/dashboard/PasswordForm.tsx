"use client";

import { useState } from "react";
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

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordForm() {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "••••••••",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    console.log("Password changed:", data);
    setIsEditing(false);
    form.reset({ currentPassword: "••••••••", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-5">
        <h3 className="text-base font-bold text-slate-800">Password &amp; Security</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Manage your password and secure your account.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-medium text-slate-600">
                  Current Password
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    disabled={!isEditing}
                    className={
                      isEditing
                        ? "border-slate-300 focus-visible:ring-slate-400"
                        : "border-dashed border-slate-200 bg-transparent text-slate-700"
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-slate-600">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      disabled={!isEditing}
                      placeholder={isEditing ? "Enter new password" : ""}
                      className={
                        isEditing
                          ? "border-slate-300 focus-visible:ring-slate-400"
                          : "border-dashed border-slate-200 bg-transparent"
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium text-slate-600">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      disabled={!isEditing}
                      placeholder={isEditing ? "Confirm new password" : ""}
                      className={
                        isEditing
                          ? "border-slate-300 focus-visible:ring-slate-400"
                          : "border-dashed border-slate-200 bg-transparent"
                      }
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
                onClick={() => {
                  form.setValue("currentPassword", "");
                  setIsEditing(true);
                }}
                className="border-slate-200 text-slate-600"
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
                    form.reset({ currentPassword: "••••••••", newPassword: "", confirmPassword: "" });
                    setIsEditing(false);
                  }}
                  className="border-slate-200 text-slate-600"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-700 hover:bg-slate-800 text-white"
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
