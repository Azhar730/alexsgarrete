"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2, Loader2 } from "lucide-react";
import StepIndicator from "./StepIndicator";
import PaymentHeader from "./PamentHeader";
import { useConnectStripeMutation, useCreateCheckoutSessionMutation, useGetConnectAccountQuery, useGetMyPaymentsQuery } from "@/redux/api/paymentApi";
import { useGetMyQuotesQuery } from "@/redux/api/onboardingApi";
import { toast } from "sonner";
import { useEffect } from "react";

type StripeStatus = "not-connected" | "connected";

export default function CompletePayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedQuoteGroupId = searchParams.get("quoteGroupId");
  const { data: quotesData, isLoading: isLoadingQuotes } = useGetMyQuotesQuery(undefined);
  const { data: statusData, isLoading: isLoadingStatus } = useGetConnectAccountQuery(undefined);
  const { data: myPayments, isLoading: isLoadingPayments } = useGetMyPaymentsQuery(undefined);
  
  const isPageLoading = isLoadingQuotes || isLoadingPayments || isLoadingStatus;
  console.log(statusData);
  const [triggerConnect, { isLoading: isConnecting }] = useConnectStripeMutation();
  const [createCheckout, { isLoading: isCreatingSession }] = useCreateCheckoutSessionMutation();

  const stripeDetails = statusData?.data;
  const stripeStatus = stripeDetails?.hasSavedPaymentMethod ? "connected" : "not-connected";
  const activeQuote = quotesData?.data?.find((quoteGroup: any) => quoteGroup.quoteGroupId === selectedQuoteGroupId)
    || quotesData?.data?.find((quoteGroup: any) => quoteGroup.isAccepted)
    || quotesData?.data?.[0];

  // Auto-redirect if already paid
  useEffect(() => {
    if (myPayments?.data && myPayments.data.length > 0 && quotesData?.data) {
      const activeQuoteGroup = activeQuote;
      console.log("myPayments", myPayments)
      console.log("activeQuoteGroup", activeQuoteGroup)
      const hasPaid = myPayments.data.some((p: any) =>
        (p.status === "SUCCESS" || p.status === "PAID") &&
        (p.quoteId === activeQuoteGroup?.quoteGroupId ||
          activeQuoteGroup?.quotes?.some((pq: any) => pq.id === p.quoteId))
      );

      if (hasPaid) {
        toast.info("Payment already completed. Redirecting to dashboard...");
        router.push("/dashboard");
      }
    }
  }, [myPayments, quotesData, router, activeQuote]);


  const connectStripe = async () => {
    try {
      const payloadQuoteGroupId = selectedQuoteGroupId || activeQuote?.quoteGroupId;
      const response = await triggerConnect({ quoteGroupId: payloadQuoteGroupId }).unwrap();
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to connect to Stripe");
    }
  };

  const handlePayment = async () => {
    if (!activeQuote) {
      toast.error("No active quote found to pay");
      return;
    }

    try {
      const response = await createCheckout({
        quoteGroupId: activeQuote.quoteGroupId,
        setupFee: activeQuote.setupFee,
        totalMonthlyCharge: activeQuote.totalMonthlyCharge,
      }).unwrap();

      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create checkout session");
    }
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 h-dvh w-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4">
      <PaymentHeader />

      <StepIndicator currentStep={3} />

      <div className="container mx-auto  border border-primary/40 rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Payment details */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-secondary mb-1">
              Complete Payment
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please carefully review the policy documents and complete payment for the selected pet coverage.
            </p>

            <div className="mb-4">
              <h3 className="text-sm font-bold text-secondary mb-1">
                Payment Details
              </h3>
              <p className="text-xs text-muted-foreground">
                Use Stripe to securely add your payment method and complete
                activation.
              </p>
            </div>

            {/* Stripe card */}
            <div className="bg-muted-foreground/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="textmd:text-lg font-bold text-secondary">
                    Stripe Payment
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Fast, secure checkout powered by Stripe
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`w-2 h-2 rounded-full ${stripeStatus === "connected"
                      ? "bg-emerald-500"
                      : "bg-red-400"
                      }`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {stripeStatus === "connected"
                      ? "Connected"
                      : "Not Connected"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 text-right">Account Status</span>
              </div>

              {stripeStatus === "connected" ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 mb-3">
                    Billing contact
                  </p>
                  {[
                    { label: "Customer ID", value: stripeDetails?.stripeCustomerId || "N/A" },
                    { label: "Payment Method", value: stripeDetails?.hasSavedPaymentMethod ? "Saved" : "Not Found" },
                    { label: "Connection", value: stripeDetails?.isStripeConnected ? "Active" : "Inactive" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-start py-1.5 gap-4"
                    >
                      <span className="text-xs text-slate-500 shrink-0">{label}</span>
                      <span className="text-xs font-semibold text-slate-700 text-right break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <Button
                  onClick={connectStripe}
                  disabled={isConnecting}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      Redirecting to Stripe...
                    </>
                  ) : (
                    "Connect Stripe"
                  )}
                </Button>
              )}
            </div>

            <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-teal-50 border border-teal-100">
              <CheckCircle2
                size={14}
                className="text-teal-500 mt-0.5 shrink-0"
              />
              <p className="text-xs text-teal-700">
                Your card details are entered and stored with Stripe, not in
                your dashboard.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="text-secondary cursor-pointer rounded border border-muted-foreground/20 bg-white px-4 py-2 text-sm font-medium"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Right - Order summary */}
          <div className="bg-muted-foreground/10 rounded-2xl p-5 h-fit">
            <h3 className="text-sm font-bold text-slate-700 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4 pb-4 border-b border-slate-200">
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">
                  Initial Setup Fee
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  ${activeQuote?.setupFee?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">
                    Monthly Premium
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    ${activeQuote?.totalMonthlyCharge?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Starting in 14 days
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-bold text-slate-700">
                Due Today
              </span>
              <span className="text-2xl font-bold text-slate-800">
                ${activeQuote?.setupFee?.toFixed(2) || "0.00"}
              </span>
            </div>

            <Button
              className="w-full bg-primary cursor-pointer text-white font-semibold"
              disabled={stripeStatus !== "connected" || isCreatingSession}
              onClick={handlePayment}
            >
              {isCreatingSession ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Preparing Payment...
                </>
              ) : (
                `Pay $${activeQuote?.setupFee?.toFixed(2) || "0.00"}`
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Lock size={11} className="text-slate-400" />
              <span className="text-xs text-slate-400">
                Secure Encrypted Checkout
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
