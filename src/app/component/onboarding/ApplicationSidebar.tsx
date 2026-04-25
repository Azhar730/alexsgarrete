"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApplication } from "./application-context";
import { StepId, STEPS } from "./application";

export function ApplicationSidebar() {
  const { currentStep, goToStep, isStepComplete } = useApplication();

  return (
    <aside className="w-44 shrink-0 pt-8 pl-6 pr-2">
      <h2 className="text-sm font-bold text-gray-900 mb-6 tracking-tight">
        Application Flow
      </h2>

      <nav className="flex flex-col">
        {STEPS.map((step, index) => {
          const completed = isStepComplete(step.id as StepId);
          const active = currentStep === step.id;
          const accessible = completed || active;

          return (
            <div key={step.id} className="flex flex-col">
              {/* Step row */}
              <button
                onClick={() => accessible && goToStep(step.id as StepId)}
                disabled={!accessible}
                className={cn(
                  "flex items-start gap-3 text-left py-1 rounded-lg transition-colors",
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
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
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
                      "text-xs mt-0.5 leading-none",
                      active || completed ? "text-gray-400" : "text-gray-300"
                    )}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </button>

              {/* Connector line (not after last) */}
              {index < STEPS.length - 1 && (
                <div className="ml-3 w-px h-5 bg-gray-200" />
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
