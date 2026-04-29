"use client";

import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Payment Summary Cards ─────────────────────────────────────────────────

export function PaymentSummaryCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-xs text-slate-400 font-medium mb-1">Current Plan Amount</p>
        <p className="text-3xl font-bold text-slate-800">$45.00</p>
        <p className="text-xs text-slate-400 mt-1">Billed monthly on the 1st</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-xs text-slate-400 font-medium mb-1">Next Payment</p>
        <p className="text-3xl font-bold text-slate-800">Oct 1</p>
        <p className="text-xs text-slate-400 mt-1">Total due: $45.00</p>
      </div>
    </div>
  );
}

// ─── Payment Method ────────────────────────────────────────────────────────

export function PaymentMethod() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">Payment Method</h3>
      <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <span className="text-blue-600 font-bold text-sm italic">stripe</span>
          <div>
            <p className="text-sm font-semibold text-slate-700">Visa •••• 4832</p>
            <p className="text-xs text-slate-400">Expires 09/27</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 size={15} />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="mt-3 text-xs text-slate-500 hover:text-slate-700 gap-1.5"
      >
        <Plus size={13} />
        Add
      </Button>
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

export function BillingHistory() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-800 mb-4">Billing History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-4">
                Date
              </th>
              <th className="text-left text-xs font-medium text-slate-400 pb-2 pr-4">
                Description
              </th>
              <th className="text-right text-xs font-medium text-slate-400 pb-2 pr-4">
                Amount
              </th>
              <th className="text-right text-xs font-medium text-slate-400 pb-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {billingRecords.map((record) => (
              <tr key={record.id}>
                <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">
                  {record.date}
                </td>
                <td className="py-3 pr-4 text-slate-700 font-medium">
                  {record.description}
                </td>
                <td className="py-3 pr-4 text-right text-slate-700 font-semibold whitespace-nowrap">
                  ${record.amount.toFixed(2)}
                </td>
                <td className="py-3 text-right">
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs px-2">
                    Paid
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
