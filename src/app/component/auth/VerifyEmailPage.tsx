"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AuthShell } from "./shared/AuthShell";
import { AUTH_SLIDES } from "@/app/data/authConfig";
import { OTPInput } from "./shared/OTPInput";
import { AuthButton } from "./shared/AuthButton";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useVerifyOtpMutation } from "@/redux/api/authApi";

// ─── Schema ───────────────────────────────────────────────────────────────────
const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Please enter the complete 6-digit code")
    .regex(/^\d{6}$/, "Code must contain only numbers"),
});

type VerifyValues = z.infer<typeof verifySchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifyOtp] = useVerifyOtpMutation();
  // In a real app, get this from router state / context
  const userEmail = searchParams.get("email");

  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: VerifyValues) => {
    setIsLoading(true);

    const payload = {
      email: userEmail,
      purpose: "email_verification",
      otp: values.code,
    };
    try {
       await new Promise((r) => setTimeout(r, 1200));
      const res = await verifyOtp(payload).unwrap();
      console.log("verify-email", res);
      if (res.success) {
        toast.success("OTP verified successfully! You can now log in.");
        router.push("/login");
        setIsLoading(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data.message || "Verification failed! Try again.");
      setIsLoading(false);
    }

    // try {
    //   console.log("Verify code:", values.code);
    //   await new Promise((r) => setTimeout(r, 1200));
    //   // router.push("/dashboard");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setResent(true);
      form.reset();
      setTimeout(() => setResent(false), 3000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell slide={AUTH_SLIDES.verify}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-snug">
          We&apos;ve sent a 6-digit verification code to{" "}
          <span className="font-semibold text-gray-800">{userEmail}</span>.
          Enter the code below to verify your account.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* OTP boxes */}
          <FormField
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-3">
                <OTPInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  hasError={!!fieldState.error}
                />
                <FormMessage className="text-xs text-red-500 text-center" />
              </FormItem>
            )}
          />

          <AuthButton
            isLoading={isLoading}
            disabled={form.watch("code").length < 6}
          >
            Verify Email
          </AuthButton>
        </form>
      </Form>

      {/* Resend */}
      <p className="mt-4 text-center text-sm text-gray-500">
        Didn&apos;t receive the email?{" "}
        {resent ? (
          <span className="text-emerald-600 font-semibold text-sm">
            Sent! ✓
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-[#5C7FC4] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isResending ? "Sending…" : "Resend"}
          </button>
        )}
      </p>
    </AuthShell>
  );
}
