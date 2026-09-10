"use client";
import { Check } from "lucide-react";

export function Stepper({ steps, step }: { steps: string[]; step: number }) {
  return (
    <div className="mt-3 flex items-center justify-center gap-2 px-6">
      {steps.map((label, i) => {
        const isActive = i === step;
        const isCompleted = i < step;
        return (
          <div key={label} className="flex items-center">
            <span
              className={[
                "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                  : isCompleted
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500",
              ].join(" ")}
            >
              <span className="flex size-3.5 items-center justify-center rounded-full border border-current bg-white">
                {isCompleted ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span
                    className={[
                      "h-1.5 w-1.5 rounded-full",
                      isActive ? "bg-white" : "bg-current",
                    ].join(" ")}
                  />
                )}
              </span>
              {label}
            </span>
            {i < steps.length - 1 && (
              <div className="mx-1.5 h-px w-5 flex-shrink-0 bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
