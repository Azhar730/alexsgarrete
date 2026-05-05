import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BillingSummaryCardProps {
  monthlyPremium: number;
  addOnsWellness: number;
  paymentMethodLast4: string;
  nextPaymentDate: string;
  onManageClick?: () => void;
}

interface BillingRowProps {
  label: string;
  value: React.ReactNode;
  bold?: boolean;
  separator?: boolean;
}

function BillingRow({ label, value, bold, separator }: BillingRowProps) {
  return (
    <>
      {separator && <hr className="border-dashed border-gray-200 my-1" />}
      <div className="flex items-center justify-between py-3">
        <span
          className={`text-sm ${
            bold ? "font-bold text-gray-900" : "text-gray-500"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-sm ${
            bold ? "font-bold text-gray-900" : "text-gray-700"
          }`}
        >
          {value}
        </span>
      </div>
    </>
  );
}

export function BillingSummaryCard({
  monthlyPremium,
  addOnsWellness,
  paymentMethodLast4,
  nextPaymentDate,
  onManageClick,
}: BillingSummaryCardProps) {
  const fmt = (n: number) =>
    n === 0 ? "$0.00" : `$${n.toFixed(2)}`;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-sm px-5 py-6 sm:px-7 sm:py-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-gray-900">Billing Summary</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onManageClick}
          className="text-xs text-gray-400 hover:text-gray-700 h-auto py-1 px-2 rounded-lg"
        >
          Manage
        </Button>
      </div>

      <div className="divide-y divide-gray-100">
        <BillingRow label="Monthly Premium" value={fmt(monthlyPremium)} />
        <BillingRow label="Add-ons (Wellness)" value={fmt(addOnsWellness)} />
        <BillingRow
          label="Payment Method"
          value={
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="tracking-widest text-gray-700 text-xs">
                ···· {paymentMethodLast4}
              </span>
            </span>
          }
        />
        <BillingRow
          label="Total Monthly"
          value={fmt(monthlyPremium + addOnsWellness)}
          bold
          separator
        />
        <BillingRow label="Next Payment Date" value={nextPaymentDate} />
      </div>
    </div>
  );
}
