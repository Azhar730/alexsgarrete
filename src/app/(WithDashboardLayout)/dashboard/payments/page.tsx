"use client";

import { useMemo, useState } from "react";
import AppLayout from "@/app/component/dashboard/AppLayout";
import { BillingHistory, PaymentMethod, PaymentSummaryCards } from "@/app/component/dashboard/PaymentComponents";
import { useGetStripeOverviewQuery } from "@/redux/api/paymentApi";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type PaymentFilter = "ALL" | "INITIAL" | "MONTHLY";

export default function PaymentsPage() {
  const [filter, setFilter] = useState<PaymentFilter>("ALL");
  const { data: overviewResponse, isLoading } = useGetStripeOverviewQuery();

  const overviewData = overviewResponse?.data;
  const payments = overviewData?.local?.allPayments || [];
  const stripePaymentMethods = overviewData?.stripe?.paymentMethods || [];

  const filteredPayments = useMemo(() => {
    switch (filter) {
      case "INITIAL":
        return payments.filter((payment: any) => payment?.type === "SETUP_FEE");
      case "MONTHLY":
        return payments.filter((payment: any) => payment?.type === "MONTHLY_PREMIUM");
      default:
        return payments;
    }
  }, [filter, payments]);

  const tabCount = {
    ALL: payments.length,
    INITIAL: payments.filter((payment: any) => payment?.type === "SETUP_FEE").length,
    MONTHLY: payments.filter((payment: any) => payment?.type === "MONTHLY_PREMIUM").length,
  };

  const filterTabs: { key: PaymentFilter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "INITIAL", label: "Initial" },
    { key: "MONTHLY", label: "Monthly" },
  ];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading payment history...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Payments & Billing</h1>
          <p className="text-base text-slate-500 mt-1.5">
            Review your transaction history and manage your payment methods.
          </p>
        </div>

        <PaymentSummaryCards payments={payments} />
        <PaymentMethod payments={payments} stripePaymentMethods={stripePaymentMethods} />

        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                  filter === tab.key
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {tab.label} ({tabCount[tab.key]})
              </button>
            ))}
          </div>
        </div>

        <BillingHistory payments={filteredPayments} />
      </div>
    </AppLayout>
  );
}
