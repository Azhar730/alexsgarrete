"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApplication } from "./application-context";
import { StepId, STEPS } from "./application";

export function ApplicationSidebar() {
  const { currentStep, goToStep, isStepComplete } = useApplication();

  return (
    <aside className="w-full md:w-44 shrink-0 md:pt-8 md:pl-6 md:pr-2">
      <h2 className="text-sm font-bold text-gray-900 mb-6 tracking-tight">
        Application Flow
      </h2>

      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-4 md:gap-0 pb-4 md:pb-0 scrollbar-hide">
        {STEPS.map((step, index) => {
          const completed = isStepComplete(step.id as StepId);
          const active = currentStep === step.id;
          const accessible = completed || active;

          return (
            <div key={step.id} className="flex flex-row md:flex-col items-center md:items-start shrink-0">
              {/* Step row */}
              <button
                onClick={() => accessible && goToStep(step.id as StepId)}
                disabled={!accessible}
                className={cn(
                  "flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3 text-center md:text-left py-1 rounded-lg transition-colors",
                  accessible
                    ? "cursor-pointer hover:bg-gray-50"
                    : "cursor-default"
                )}
              >
                {/* Circle indicator */}
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all",
                    completed
                      ? "bg-[#5C7FC4] border-[#5C7FC4]"
                      : active
                      ? "border-[#5C7FC4] bg-white"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {completed ? (
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-bold leading-none",
                        active ? "text-[#5C7FC4]" : "text-gray-400"
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div className="min-w-0 flex flex-col items-center md:items-start">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight whitespace-nowrap",
                      active
                        ? "text-gray-900"
                        : completed
                        ? "text-gray-700"
                        : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-0.5 leading-none whitespace-nowrap hidden md:block",
                      active || completed ? "text-gray-400" : "text-gray-300"
                    )}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </button>

              {/* Connector line (not after last) */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block ml-3 w-px h-5 bg-gray-200" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
