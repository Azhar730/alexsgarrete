"use client";

import { useState, useEffect } from "react";
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
import { useVerifyOtpMutation, useResendOtpMutation } from "@/redux/api/authApi";

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
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();
  // In a real app, get this from router state / context
  const userEmail = searchParams.get("email");
  const purpose = (searchParams.get("purpose") as "email_verification" | "password_reset") || "email_verification";

  const form = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });

  // Calculate/load timer on mount or when searchParams change
  useEffect(() => {
    if (!userEmail) return;
    const storageKey = `otp_expiry:${purpose}:${userEmail}`;
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const expires = Number(stored);
        const diff = Math.ceil((expires - Date.now()) / 1000);
        setSecondsLeft(diff > 0 ? diff : 0);
      } else {
        setSecondsLeft(0);
      }
    } catch (e) {
      setSecondsLeft(0);
    }
  }, [userEmail, purpose]);

  const onSubmit = async (values: VerifyValues) => {
    setIsLoading(true);

    const payload = {
      email: userEmail,
      purpose,
      otp: values.code,
    };
    try {
       await new Promise((r) => setTimeout(r, 1200));
      const res = await verifyOtp(payload).unwrap();
      console.log("verify-email", res);
      if (res.success) {
        toast.success("OTP verified successfully! You can now log in.");
        try {
          sessionStorage.removeItem(`otp_expiry:${purpose}:${userEmail}`);
        } catch (e) {}
        router.push("/login");
        setIsLoading(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.data.message || "Verification failed! Try again.");
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userEmail) return;
    setIsResending(true);
    try {
      const payload = { email: userEmail, purpose };
      const res = await resendOtp(payload).unwrap();
      if (res) {
        toast.success("Verification code resent! Check your email.");
      }
      // reset OTP input and start countdown
      form.reset();
      setResent(true);

      const expires = Date.now() + 60 * 1000;
      try {
        sessionStorage.setItem(`otp_expiry:${purpose}:${userEmail}`, String(expires));
      } catch (e) {}

      setSecondsLeft(60);
      setTimeout(() => setResent(false), 3000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  return (
    <AuthShell slide={AUTH_SLIDES.verify}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Check your email
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
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
                <div className="flex items-center justify-center gap-3">
                  <FormMessage className="text-xs text-red-500 text-center" />
                  {secondsLeft > 0 ? (
                    <span className="text-xs text-gray-500">Code expires in {secondsLeft}s</span>
                  ) : (
                    <span className="text-xs text-gray-500">Code expired</span>
                  )}
                </div>
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
          <span className="text-emerald-600 font-semibold text-sm">Sent! ✓</span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || secondsLeft > 0}
            className="text-[#5C7FC4] cursor-pointer font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isResending ? "Sending…" : secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
          </button>
        )}
      </p>
    </AuthShell>
  );
}
