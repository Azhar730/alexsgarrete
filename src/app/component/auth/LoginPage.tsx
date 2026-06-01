/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
import { useLoginMutation } from "@/redux/api/authApi";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useStartApplicationMutation } from "@/redux/api/onboardingApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/authSlice";

// ─── Schema ───────────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [login] = useLoginMutation();
  const [startApplication] = useStartApplicationMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: meResponse, isLoading: isLoadingMe, isFetching: isFetchingMe } = useGetMeQuery({});

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const currentUser = meResponse?.data ?? meResponse;

  // If the user becomes authenticated, redirect. But don't block rendering —
  // show the login form immediately so navigation from other pages is instant.
  useEffect(() => {
    if (!isLoadingMe && !isFetchingMe && currentUser) {
      router.replace(currentUser.applications?.length ? "/dashboard" : "/onboarding");
    }
  }, [isLoadingMe, isFetchingMe, currentUser, router]);

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    try {
      const response = await login(values).unwrap();
      console.log("Login response:", response);
      if (response?.success) {
        dispatch(setUser({
          user: response.data.user,
          token: response.data.token
        }));
        toast.success("Login successful");
        await new Promise((r) => setTimeout(r, 1200));

        if (!response.data.user?.isApplicationStarted) {
          try {
            await startApplication({ userId: response.data.user.id, status: "DRAFT" }).unwrap();
          } catch (error) {
            console.error("Failed to start application after login:", error);
          }
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      const errMsg = error?.data?.error?.message || error?.data?.message || "Login failed! Please try again.";
      toast.error(errMsg);
      if (errMsg === "Please verify your email first") {
        const expires = Date.now() + 60 * 1000;
        try {
          sessionStorage.setItem(`otp_expiry:email_verification:${values.email}`, String(expires));
        } catch (e) {}
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      }
    }
  };

  return (
    <AuthShell slide={AUTH_SLIDES.login}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-70 mx-auto">
          Enter your credentials to access your account.
        </p>
      </div>

      {/* Form */}
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

          <AuthInput
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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

          {/* Forgot password link */}
          <div className="flex justify-end -mt-1">
            <Link
              href="/forgot-password"
              className="text-xs text-[#5C7FC4] hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <div className="pt-1">
            <AuthButton isLoading={isLoading}>Log in</AuthButton>
          </div>
        </form>
      </Form>

      {/* Legal */}
      <p className="mt-4 text-center text-xs text-gray-400 leading-relaxed">
        By logging in, you agree to our{" "}
        <Link
          href="/terms-conditions"
          className="text-[#5C7FC4] hover:underline font-medium"
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy-policy"
          className="text-[#5C7FC4] hover:underline font-medium"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Signup link */}
      <p className="mt-3 text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#5C7FC4] font-semibold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
