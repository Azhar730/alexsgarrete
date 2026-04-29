import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DogProfile } from ".";

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
  incomplete: {
    label: "Incomplete",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export default function DogProfileCard({ dog }: { dog: DogProfile }) {
  const status = statusConfig[dog.status];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Image + Name */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-slate-100">
          <img
            src={dog.imageUrl}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-base">{dog.name}</p>
          <p className="text-xs text-slate-400">
            {dog.breed} • {dog.age} yrs
          </p>
        </div>
        <Badge className={cn("text-xs px-2 py-0.5 border", status.className)}>
          {status.label}
        </Badge>
      </div>

      {/* Billing info */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
            Monthly Fee
          </p>
          <p className="text-sm font-bold text-slate-700">
            {dog.monthlyFee ? `$${dog.monthlyFee.toFixed(2)}` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
            Next Billing
          </p>
          <p className="text-sm font-bold text-slate-700">
            {dog.nextBilling ?? "N/A"}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full text-slate-500 text-xs hover:text-slate-700 hover:bg-slate-50 mt-auto"
      >
        See Details
      </Button>
    </div>
  );
}
