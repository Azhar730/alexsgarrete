"use client";

import AppLayout from "@/app/component/dashboard/AppLayout";
import { BillingHistory, PaymentMethod, PaymentSummaryCards } from "@/app/component/dashboard/PaymentComponents";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  const { data: paymentsResponse, isLoading } = useGetMyPaymentsQuery(undefined);
  const payments = paymentsResponse?.data || [];

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
        <PaymentMethod payments={payments} />
        <BillingHistory payments={payments} />
      </div>
    </AppLayout>
  );
}
