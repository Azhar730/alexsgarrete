"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Form } from "@/components/ui/form";
import { AuthShell } from "./shared/AuthShell";
import { AUTH_SLIDES } from "@/app/data/authConfig";
import { AuthInput } from "./shared/AuthInput";
import { AuthButton } from "./shared/AuthButton";
import { useSearchParams } from "next/navigation";
import { useResetPasswordMutation } from "@/redux/api/authApi";
import { toast } from "sonner";

// ─── Schema ───────────────────────────────────────────────────────────────────
const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type NewPasswordValues = z.infer<typeof newPasswordSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NewPasswordPage() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token");
  const [resetPassword] = useResetPasswordMutation();

  const onSubmit = async (values: NewPasswordValues) => {
    if (!resetToken) {
      toast.error("Reset token is missing. Please try the forgot password process again.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        resetToken,
        newPassword: values.newPassword,
      }).unwrap();
      
      if (res.success || res.message) {
        setDone(true);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Eye toggle factory
  const eyeToggle = (visible: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
      tabIndex={-1}
      aria-label={visible ? "Hide password" : "Show password"}
    >
      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <AuthShell slide={AUTH_SLIDES["new-password"]}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          New Password
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
          Create a secure password to protect your account.
        </p>
      </div>

      {/* Success state */}
      {done ? (
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <span className="text-2xl">✅</span>
          </div>
          <p className="text-sm text-gray-600">
            Your password has been updated successfully!
          </p>
          <Link
            href="/login"
            className="block w-full h-11 bg-[#5C7FC4] hover:bg-[#4A6BAF] text-white font-semibold text-sm rounded-lg transition-all text-center leading-[44px]"
          >
            Back to Log in
          </Link>
        </div>
      ) : (
        /* Form */
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              control={form.control}
              name="newPassword"
              label="New Password"
              placeholder="••••••••"
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              disabled={isLoading}
              rightElement={eyeToggle(showNew, () => setShowNew((v) => !v))}
            />

            <AuthInput
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              disabled={isLoading}
              rightElement={eyeToggle(showConfirm, () =>
                setShowConfirm((v) => !v)
              )}
            />

            {/* Password hints */}
            <ul className="text-xs text-gray-400 space-y-1 pl-1">
              <li
                className={
                  /[A-Z]/.test(form.watch("newPassword"))
                    ? "text-emerald-600"
                    : ""
                }
              >
                • At least one uppercase letter
              </li>
              <li
                className={
                  /[0-9]/.test(form.watch("newPassword"))
                    ? "text-emerald-600"
                    : ""
                }
              >
                • At least one number
              </li>
              <li
                className={
                  form.watch("newPassword").length >= 8
                    ? "text-emerald-600"
                    : ""
                }
              >
                • Minimum 8 characters
              </li>
            </ul>

            <div className="pt-1">
              <AuthButton isLoading={isLoading}>Confirm</AuthButton>
            </div>
          </form>
        </Form>
      )}

      {/* Login link */}
      <p className="mt-5 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#5C7FC4] font-semibold hover:underline"
        >
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}