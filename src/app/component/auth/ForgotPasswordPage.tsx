"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { AuthShell } from "./shared/AuthShell";
import { AUTH_SLIDES } from "@/app/data/authConfig";
import { AuthInput } from "./shared/AuthInput";
import { AuthButton } from "./shared/AuthButton";

// ─── Schema ───────────────────────────────────────────────────────────────────
const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotValues = z.infer<typeof forgotSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: ForgotValues) => {
    setIsLoading(true);
    try {
      console.log("Forgot password for:", values.email);
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
      // router.push("/verify-email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell slide={AUTH_SLIDES["forgot-password"]}>
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Forgot password
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-snug text-center">
          Please enter your email to receive verification code
        </p>
      </div>

      {/* Success state */}
      {submitted ? (
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <span className="text-2xl">✉️</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            We&apos;ve sent a verification code to{" "}
            <span className="font-semibold text-gray-900">
              {form.getValues("email")}
            </span>
            . Check your inbox.
          </p>
          <Link
            href="/verify-email"
            className="block w-full h-11 bg-[#5C7FC4] hover:bg-[#4A6BAF] text-white font-semibold text-sm rounded-lg transition-all text-center leading-[44px]"
          >
            Enter verification code
          </Link>
        </div>
      ) : (
        /* Form */
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AuthInput
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              disabled={isLoading}
            />

            <div className="pt-1">
              <AuthButton isLoading={isLoading}>
                Send Verification Code
              </AuthButton>
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