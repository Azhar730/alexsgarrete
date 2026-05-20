"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Payment Summary Cards ─────────────────────────────────────────────────

export function PaymentSummaryCards({ payments }: { payments: any[] }) {

  console.log("Payments data in summary cards:", payments);
  const latestPayment = payments?.[0];
  const petCharge = latestPayment?.quoteInfo?.pet?.petCharge || "0.00";
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm text-slate-500 font-medium mb-1">Current Plan Amount</p>
        <p className="text-3xl font-bold text-slate-800">${petCharge}</p>
        <p className="text-sm text-slate-500 mt-1">Billed monthly</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <p className="text-sm text-slate-500 font-medium mb-1">Total Payments</p>
        <p className="text-3xl font-bold text-slate-800">{payments?.length || 0}</p>
        <p className="text-sm text-slate-500 mt-1">Successful transactions</p>
      </div>
    </div>
  );
}

// ─── Payment Method ────────────────────────────────────────────────────────

export function PaymentMethod({ payments }: { payments: any[] }) {
  const method = payments?.[0]?.paymentMethod;

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

// ─── Billing History ───────────────────────────────────────────────────────

const billingRecords = [
  {
    id: "1",
    date: "Sep 1, 2023",
    description: "Pawsure Monthly - Buster",
    amount: 45.0,
    status: "paid" as const,
  },
  {
    id: "2",
    date: "Aug 1, 2023",
    description: "Pawsure Monthly - Buster",
    amount: 45.0,
    status: "paid" as const,
  },
  {
    id: "3",
    date: "Jul 1, 2023",
    description: "Initial Setup & First Month",
    amount: 60.0,
    status: "paid" as const,
  },
];

export function BillingHistory({ payments }: { payments: any[] }) {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <p className="text-slate-500 font-medium">No payment history found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Billing History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4">Date</th>
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4">Description</th>
              <th className="text-left text-sm font-medium text-slate-400 pb-2 pr-4">Pet</th>
              <th className="text-right text-sm font-medium text-slate-400 pb-2 pr-4">Amount</th>
              <th className="text-right text-sm font-medium text-slate-400 pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {payments.map((record) => (
              <tr key={record.id}>
                <td className="py-3 pr-4 text-slate-600 whitespace-nowrap text-sm">
                  {new Date(record.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 pr-4 text-slate-700 font-medium text-sm">
                  {record.description}
                </td>
                <td className="py-3 pr-4 text-slate-600 text-sm">
                  {record.quoteInfo?.pet?.name || "N/A"}
                </td>
                <td className="py-3 pr-4 text-right text-slate-700 font-bold whitespace-nowrap text-sm">
                  ${record.amount}
                </td>
                <td className="py-3 text-right">
                  <Badge className={cn(
                    "text-[11px] uppercase px-2.5 py-0.5 border-none",
                    record.status === "SUCCESS" || record.status === "PAID" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-amber-100 text-amber-700"
                  )}>
                    {record.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
