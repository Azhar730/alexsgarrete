/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRegisterMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── Schema ───────────────────────────────────────────────────────────────────
const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(60, "Full name is too long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().regex(/[0-9]/, "Must include at least one number"),
});

type SignupValues = z.infer<typeof signupSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [register] = useRegisterMutation();
  const router = useRouter();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: SignupValues) => {
    setIsLoading(true);
    try {
      console.log("Signup:", values);
      const response = await register(values).unwrap();
      console.log("API response:", response);
      toast.success(response?.message ||
        "Registration successful! Please check your email for verification.",
      );
      await new Promise((r) => setTimeout(r, 1200));
      router.push("/verify-email?email=" + encodeURIComponent(values.email));
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error?.data?.error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell slide={AUTH_SLIDES.signup}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-[280px] mx-auto">
          Enter your details below to start setting up your custom plan.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            control={form.control}
            name="fullName"
            label="Full Name"
            placeholder="e.g. Jane Doe"
            autoComplete="name"
            disabled={isLoading}
          />

          <AuthInput
            control={form.control}
            name="email"
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            autoComplete="email"
            disabled={isLoading}
          />

          <AuthInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Create a password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            disabled={isLoading}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <div className="pt-1">
            <AuthButton isLoading={isLoading}>Sign up</AuthButton>
          </div>
        </form>
      </Form>

      {/* Legal */}
      <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
        By signing up, you agree to our{" "}
        <Link
          href="/terms"
          className="text-[#5C7FC4] hover:underline font-medium"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-[#5C7FC4] hover:underline font-medium"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Login link */}
      <p className="mt-3 text-center text-sm text-gray-500">
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
