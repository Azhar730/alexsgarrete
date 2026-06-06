import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DogProfile } from ".";
import Image from "next/image";
import Link from "next/link";

const statusConfig: Record<
  DogProfile["status"],
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "quote-ready": {
    label: "Quote Ready",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  "quote-accepted": {
    label: "Quote Accepted",
    className: "bg-teal-100 text-teal-700 border-teal-200",
  },
  "quote-rejected": {
    label: "Quote Rejected",
    className: "bg-rose-100 text-rose-700 border-rose-200",
  },
  incomplete: {
    label: "Incomplete",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export default function DogProfileCard({
  dog,
  acceptedQuoteSigned = false,
  onViewAgreement,
  hasValidQuoteGroup = false,
  hasValidAgreement = false,
}: {
  dog: DogProfile;
  acceptedQuoteSigned?: boolean;
  onViewAgreement?: (quoteGroupId: string) => void;
  hasValidQuoteGroup?: boolean;
  hasValidAgreement?: boolean;
}) {
  const status = statusConfig[dog.status];
  const showPayNow = dog.status === "quote-accepted" && acceptedQuoteSigned;
  const actionHref = dog.status === "quote-ready"
    ? `/dashboard/quote/review${dog.quoteGroupId ? `?quoteGroupId=${dog.quoteGroupId}` : ""}`
    : showPayNow
      ? `/dashboard/quote/payment${dog.quoteGroupId ? `?quoteGroupId=${dog.quoteGroupId}` : ""}`
      : `/dashboard/quote/agreement${dog.quoteGroupId ? `?quoteGroupId=${dog.quoteGroupId}` : ""}`;
  const actionLabel = dog.status === "quote-ready"
    ? "Accept Quote"
    : showPayNow
      ? "Pay Now"
      : "Sign";
  const actionClassName = dog.status === "quote-ready"
    ? "bg-[#5C7FC4] hover:bg-[#4A6BAF]"
    : showPayNow
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-teal-600 hover:bg-teal-700";
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Image + Name */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-primary">
          <Image
            src={dog.imageUrl}
            alt={dog.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-secondary text-lg">{dog.name}</p>
          <p className="text-sm text-muted-foreground">
            {dog.breed} • {dog.age} yrs
          </p>
        </div>
        <Badge className={cn("text-xs px-2 py-0.5 border", status.className)}>
          {status.label}
        </Badge>
      </div>
 
      {/* Billing info */}
      <div className="grid grid-cols-2 gap-3 rounded bg-primary/10 px-8 py-4 border border-slate-100">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
            Monthly Fee
          </p>
          <p className="text-base font-bold text-secondary">
            {dog.monthlyFee ? `$${dog.monthlyFee.toFixed(2)}` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
            Next Billing
          </p>
          <p className="text-base font-bold text-secondary">
            {dog.nextBilling ?? "N/A"}
          </p>
        </div>
      </div>
 
      <div className="flex flex-col gap-2 mt-auto">
        <div className="flex gap-2">
          <Link href={`/dashboard/${dog.id}`} className="flex-1">
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer border border-slate-200 rounded-xl text-sm font-semibold py-2 h-auto"
            >
              See Details
            </Button>
          </Link>
          {hasValidAgreement && dog.quoteGroupId && (
            <div className="flex-1">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => onViewAgreement?.(dog.quoteGroupId!)}
                className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer border border-slate-200 rounded-xl text-sm font-semibold py-2 h-auto"
              >
                See Agreement
              </Button>
            </div>
          )}
          {hasValidQuoteGroup && (dog.status === "quote-ready" || (dog.status === "quote-accepted" && !acceptedQuoteSigned)) && (
            <Link
              href={actionHref}
              className="flex-1"
            >
              <Button
                size="lg"
                className={cn(
                  "w-full cursor-pointer rounded-xl text-sm font-semibold py-2 h-auto text-white transition-colors shadow-sm",
                  actionClassName
                )}
              >
                {actionLabel}
              </Button>
            </Link>
          )}
        </div>
        {showPayNow && (
          <Link href={actionHref} className="w-full">
            <Button
              size="lg"
              className={cn(
                "w-full cursor-pointer rounded-xl text-sm font-semibold py-2.5 h-auto text-white transition-colors shadow-sm",
                actionClassName
              )}
            >
              {actionLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
