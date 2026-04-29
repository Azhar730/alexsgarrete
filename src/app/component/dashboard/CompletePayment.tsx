"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2 } from "lucide-react";
import StepIndicator from "./StepIndicator";

type StripeStatus = "not-connected" | "connected";

export default function CompletePayment() {
  const router = useRouter();
  const [stripeStatus, setStripeStatus] = useState<StripeStatus>("not-connected");

  const connectStripe = () => {
    // Simulate Stripe connection
    setStripeStatus("connected");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4">
      <div className="mb-6 text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1">
        <span>enc</span><span>🐾</span><span>re</span><span>🐶</span>
      </div>

      <StepIndicator currentStep={3} />

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Payment details */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Complete Payment</h2>
            <p className="text-sm text-slate-400 mb-6">
              Please carefully review the policy documents and sign below to proceed with Bella&apos;s coverage.
            </p>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Payment Details</h3>
              <p className="text-xs text-slate-400">
                Use Stripe to securely add your payment method and complete activation.
              </p>
            </div>

            {/* Stripe card */}
            <div className="border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Stripe Payment</p>
                  <p className="text-xs text-slate-400">Fast, secure checkout powered by Stripe</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      stripeStatus === "connected" ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-slate-500">
                    {stripeStatus === "connected" ? "Connected" : "Not Connected"}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Account Status</span>
              </div>

              {stripeStatus === "connected" ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 mb-3">Billing contact</p>
                  {[
                    { label: "Name", value: "Sarah Jenkins" },
                    { label: "Email", value: "sarah.j@example.com" },
                    { label: "Country", value: "United States" },
                    { label: "ZIP code", value: "90210" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1.5">
                      <span className="text-xs text-slate-500">{label}</span>
                      <span className="text-xs font-semibold text-slate-700">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <Button
                  onClick={connectStripe}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Pay with Stripe
                </Button>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-teal-50 border border-teal-100">
              <CheckCircle2 size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-teal-700">
                Your card details are entered and stored with Stripe, not in your dashboard.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-700"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Right - Order summary */}
          <div className="bg-slate-100 rounded-2xl p-5 h-fit">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Initial Setup Fee</span>
                <span className="text-sm font-semibold text-slate-700">$15.00</span>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Monthly Premium</span>
                  <span className="text-sm font-semibold text-slate-700">$45.00</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Starting in 14 days</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-bold text-slate-700">Due Today</span>
              <span className="text-2xl font-bold text-slate-800">$15.00</span>
            </div>

            <Button
              className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold"
              disabled={stripeStatus !== "connected"}
            >
              Pay $15.00
            </Button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Lock size={11} className="text-slate-400" />
              <span className="text-xs text-slate-400">Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
