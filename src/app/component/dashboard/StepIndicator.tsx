import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [1, 2, 3];

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all",
              step <= currentStep
                ? "bg-primary border-primary text-white"
                : "bg-white border-slate-300 text-slate-400"
            )}
          >
            {step}
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "w-16 h-0.5",
                step < currentStep ? "bg-primary" : "bg-slate-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
