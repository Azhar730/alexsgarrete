import { Pencil } from "lucide-react";
import { StepId } from "./application";
import { useApplication } from "./application-context";

interface ReviewSectionProps {
  icon: React.ReactNode;
  title: string;
  stepId: StepId;
  children: React.ReactNode;
}

export function ReviewSection({
  icon,
  title,
  stepId,
  children,
}: ReviewSectionProps) {
  const { goToStep } = useApplication();

  return (
    <div className="border border-gray-100 rounded-xl bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{icon}</span>
          <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        </div>
        <button
          type="button"
          onClick={() => goToStep(stepId)}
          className="flex items-center gap-1.5 text-xs font-medium text-[#5C7FC4] hover:text-[#4A6BAF] transition-colors px-2 py-1 rounded hover:bg-blue-50"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </div>
      <div className="border-t border-gray-100 pt-3">{children}</div>
    </div>
  );
}

// ─── Review data row ──────────────────────────────────────────────────────────
interface ReviewRowProps {
  label: string;
  value?: string | null;
  fullWidth?: boolean;
}

export function ReviewRow({ label, value, fullWidth }: ReviewRowProps) {
  if (!value) return null;
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
      <p className="text-sm text-gray-800 font-medium mt-0.5">
        {value || "—"}
      </p>
    </div>
  );
}
