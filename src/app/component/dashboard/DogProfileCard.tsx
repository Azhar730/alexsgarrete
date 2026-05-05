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

      <Link href={`/dashboard/${dog.id}`}>
      <Button
        variant="ghost"
        size="lg"
        className="w-full text-primary cursor-pointer hover:text-slate-700 hover:bg-slate-50 mt-auto"
      >
        See Details
      </Button>
      </Link>
    </div>
  );
}
