"use client";

import { Fragment, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const isSuccessfulPayment = (payment: any) => {
  const status = payment?.status?.toUpperCase?.();
  return status === "SUCCESS" || status === "PAID";
};

const asNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// ─── Payment Summary Cards ─────────────────────────────────────────────────

export function PaymentSummaryCards({ payments }: { payments: any[] }) {
  const allPayments = payments || [];
  const successfulPayments = allPayments.filter(isSuccessfulPayment);
  const totalPaidAmount = successfulPayments.reduce(
    (sum, payment) => sum + asNumber(payment?.amount),
    0
  );

  const latestMonthlyPayment = allPayments.find(
    (payment) => payment?.type === "MONTHLY_PREMIUM"
  );
  const pendingMonthlyPayments = allPayments.filter(
    (payment) => payment?.type === "MONTHLY_PREMIUM" && payment?.status === "PENDING"
  );

  const currentPlanAmount = pendingMonthlyPayments.length > 0
    ? pendingMonthlyPayments.reduce((sum, payment) => sum + asNumber(payment.amount), 0)
    : asNumber(latestMonthlyPayment?.amount ?? latestMonthlyPayment?.quoteInfo?.pet?.petCharge);

  const activeMonthlyCount = pendingMonthlyPayments.length;

  const paidPetNames = Array.from(
    new Set(
      successfulPayments
        .map((payment) => payment?.quoteInfo?.pet?.name || payment?.petName)
        .filter(Boolean)
    )
  );

  const paymentMethod = allPayments.find((payment) => payment?.paymentMethod)?.paymentMethod;
  const hasSuccessfulMonthlyPayment = successfulPayments.some(
    (payment) => payment?.type === "MONTHLY_PREMIUM"
  );
  const hasMonthlySchedule = allPayments.some(
    (payment) => payment?.type === "MONTHLY_PREMIUM"
  );
  const isAutoMonthlyBillingActive = Boolean(hasSuccessfulMonthlyPayment && (paymentMethod || hasMonthlySchedule));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
        </div>
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Total Monthly Premium</p>
        </div>
        <p className="text-4xl font-extrabold text-slate-800 mb-2">${currentPlanAmount.toFixed(2)}<span className="text-lg font-medium text-slate-500">/mo</span></p>
        <p className="text-sm text-slate-600 mb-3 font-medium">
          {activeMonthlyCount > 0
            ? `Total across ${activeMonthlyCount} scheduled monthly payment${activeMonthlyCount > 1 ? 's' : ''}`
            : "No active monthly schedules found"}
        </p>
        <div className="mt-auto">
          <Badge
            className={cn(
              "border-none text-[11px] uppercase px-3 py-1 font-bold",
              isAutoMonthlyBillingActive || hasMonthlySchedule
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            )}
          >
            {isAutoMonthlyBillingActive || hasMonthlySchedule ? "Auto Monthly Billing Active" : "Billing Not Setup"}
          </Badge>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider mb-1">Total Paid To Date</p>
        <p className="text-4xl font-extrabold text-slate-800 mb-2">${totalPaidAmount.toFixed(2)}</p>
        <p className="text-sm text-slate-600 mb-2 font-medium">{successfulPayments.length} successful transactions</p>
        <div className="text-sm text-slate-500 flex flex-col gap-1 mt-auto">
          <span className="font-semibold">Paid for:</span>
          <span className="truncate">{paidPetNames.length > 0 ? paidPetNames.join(", ") : "No pet linked yet"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Payment Method ────────────────────────────────────────────────────────

export function PaymentMethod({
  payments,
  stripePaymentMethods = [],
}: {
  payments: any[];
  stripePaymentMethods?: any[];
}) {
  const stripeMethod = stripePaymentMethods[0]
    ? {
      provider: "stripe",
      last4: stripePaymentMethods[0]?.last4,
      expiryMonth: stripePaymentMethods[0]?.expMonth,
      expiryYear: stripePaymentMethods[0]?.expYear,
    }
    : null;

  const method = stripeMethod || payments.find((payment) => payment?.paymentMethod)?.paymentMethod;

  if (!method) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Saved Payment Method</h3>
      <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 font-bold text-base italic capitalize">{method.provider}</span>
          <div>
            <p className="text-base font-semibold text-slate-700">Card •••• {method.last4}</p>
            <p className="text-sm text-slate-400 font-medium">Expires {method.expiryMonth}/{method.expiryYear}</p>
          </div>
        </div>
        <div className="h-8 w-8 flex items-center justify-center text-emerald-500 bg-emerald-50 rounded-full">
          <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px] uppercase">Default</Badge>
        </div>
      </div>
    </div>
  );
}

export function BillingHistory({ payments }: { payments: any[] }) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset current page when the filtered payments array changes
  useEffect(() => {
    setCurrentPage(1);
  }, [payments.length]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <p className="text-slate-500 font-medium">No payment history found.</p>
      </div>
    );
  }

  const totalItems = payments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedPayments = payments.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, activePage - 1);
      let end = Math.min(totalPages - 1, activePage + 1);
      
      if (activePage <= 2) {
        end = 3;
      } else if (activePage >= totalPages - 1) {
        start = totalPages - 2;
      }
      
      if (start > 2) {
        pages.push("...");
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push("...");
      }
      
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Billing History</h3>
      
      {/* Desktop view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4 w-8"></th>
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4">Date</th>
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4">Description</th>
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4">Pet</th>
              <th className="text-right text-sm font-medium text-slate-400 pb-2 pr-4">Amount</th>
              <th className="text-right text-sm font-medium text-slate-400 pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedPayments.map((record) => {
              const isExpanded = Boolean(expandedRows[record.id]);
              const petName = record.quoteInfo?.pet?.name || record.petName || "Policy payment";

              const isScheduled = record.source === "stripe_subscription" && record.status === "PENDING";
              const displayStatus = isScheduled ? "UPCOMING" : record.status;
              const displayDate = isScheduled && record.nextBillingAt
                ? new Date(Number(record.nextBillingAt) * 1000).toLocaleDateString()
                : new Date(record.createdAt).toLocaleDateString();

              return (
                <Fragment key={record.id}>
                  <tr>
                    <td className="py-3 pr-2 align-middle">
                      <button
                        type="button"
                        onClick={() => toggleRow(record.id)}
                        className="text-slate-500 hover:text-slate-700 focus:outline-none"
                        aria-label={isExpanded ? "Collapse payment details" : "Expand payment details"}
                      >
                        <ChevronRight
                          size={16}
                          className={cn(
                            "transition-transform duration-200",
                            isExpanded ? "rotate-90" : "rotate-0"
                          )}
                        />
                      </button>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 whitespace-nowrap text-sm">
                      {displayDate}
                    </td>
                    <td className="py-3 pr-4 text-slate-700 font-medium text-sm">
                      {record.description || (record.type === "MONTHLY_PREMIUM" ? "Monthly premium payment" : "Initial setup fee and policy activation")}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 text-sm">
                      {petName}
                    </td>
                    <td className="py-3 pr-4 text-right text-slate-700 font-bold whitespace-nowrap text-sm">
                      ${asNumber(record.amount).toFixed(2)}
                    </td>
                    <td className="py-3 text-right">
                      <Badge className={cn(
                        "text-[11px] uppercase px-2.5 py-0.5 border-none",
                        record.status === "SUCCESS" || record.status === "PAID"
                          ? "bg-emerald-100 text-emerald-700"
                          : displayStatus === "UPCOMING"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      )}>
                        {displayStatus}
                      </Badge>
                    </td>
                  </tr>
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-none"
                      >
                        <td></td>
                        <td colSpan={5} className="p-0">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden pb-3 pr-4"
                          >
                            <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                              <p><span className="font-semibold text-slate-700">Paid Pets:</span> {petName}</p>
                              <p><span className="font-semibold text-slate-700">Payment Type:</span> {record.type || "N/A"}</p>
                              <p><span className="font-semibold text-slate-700">Transaction ID:</span> {record.transactionId || "N/A"}</p>
                            </div>
                          </motion.div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="block sm:hidden space-y-3">
        {paginatedPayments.map((record) => {
          const isExpanded = Boolean(expandedRows[record.id]);
          const petName = record.quoteInfo?.pet?.name || record.petName || "Policy payment";

          const isScheduled = record.source === "stripe_subscription" && record.status === "PENDING";
          const displayStatus = isScheduled ? "UPCOMING" : record.status;
          const displayDate = isScheduled && record.nextBillingAt
            ? new Date(Number(record.nextBillingAt) * 1000).toLocaleDateString()
            : new Date(record.createdAt).toLocaleDateString();

          return (
            <div key={record.id} className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2 max-w-[70%]">
                  <button
                    type="button"
                    onClick={() => toggleRow(record.id)}
                    className="text-slate-500 hover:text-slate-700 mt-0.5 focus:outline-none"
                    aria-label={isExpanded ? "Collapse payment details" : "Expand payment details"}
                  >
                    <ChevronRight
                      size={18}
                      className={cn(
                        "transition-transform duration-200",
                        isExpanded ? "rotate-90" : "rotate-0"
                      )}
                    />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {record.description || (record.type === "MONTHLY_PREMIUM" ? "Monthly premium payment" : "Initial setup fee and policy activation")}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{displayDate} • Pet: {petName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">${asNumber(record.amount).toFixed(2)}</p>
                  <div className="mt-1">
                    <Badge className={cn(
                      "text-[10px] uppercase px-2 py-0.5 border-none font-semibold",
                      record.status === "SUCCESS" || record.status === "PAID"
                        ? "bg-emerald-100 text-emerald-700"
                        : displayStatus === "UPCOMING"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                    )}>
                      {displayStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600 space-y-1">
                      <p><span className="font-semibold text-slate-700">Paid Pets:</span> {petName}</p>
                      <p><span className="font-semibold text-slate-700">Payment Type:</span> {record.type || "N/A"}</p>
                      <p><span className="font-semibold text-slate-700">Transaction ID:</span> {record.transactionId || "N/A"}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-slate-800">{endIndex}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalItems}</span> transactions
          </p>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              disabled={activePage === 1}
              onClick={() => setCurrentPage(activePage - 1)}
              className={cn(
                "px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer",
                activePage === 1
                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95"
              )}
            >
              Previous
            </button>
            
            {getPageNumbers().map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-slate-400"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page as number)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-md border transition-all cursor-pointer",
                    activePage === page
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95"
                  )}
                >
                  {page}
                </button>
              );
            })}

            <button
              type="button"
              disabled={activePage === totalPages}
              onClick={() => setCurrentPage(activePage + 1)}
              className={cn(
                "px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer",
                activePage === totalPages
                  ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95"
              )}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
