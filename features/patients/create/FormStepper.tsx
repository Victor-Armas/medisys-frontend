// features/patients/create/FormStepper.tsx
"use client";

import { Fragment } from "react";
import { cn } from "@/shared/lib/utils";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
}

interface Props {
  steps: FormStep[];
  activeStep: string;
  onStepClick: (id: string) => void;
}

export function FormStepper({ steps, activeStep, onStepClick }: Props) {
  const activeIndex = steps.findIndex((s) => s.id === activeStep);

  return (
    <nav className="flex items-center overflow-x-auto scrollbar-none">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isCompleted = index < activeIndex && activeIndex >= 0;

        return (
          <Fragment key={step.id}>
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              className={cn(
                "group flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg transition-all shrink-0",
                isActive && "bg-principal/8",
                !isActive && "hover:bg-fondo-inputs/60",
              )}
            >
              {/* Circle */}
              <span
                className={cn(
                  "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  isActive && "bg-principal text-white shadow-sm shadow-principal/30",
                  isCompleted && "bg-principal/15 text-principal",
                  !isActive && !isCompleted && "bg-fondo-inputs text-subtitulo",
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </span>

              {/* Label */}
              <div className="hidden sm:block text-left min-w-0">
                <p
                  className={cn(
                    "text-xs font-semibold leading-tight truncate",
                    isActive && "text-principal",
                    isCompleted && "text-principal/60",
                    !isActive && !isCompleted && "text-subtitulo",
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-[10px] text-subtitulo leading-tight mt-0.5 truncate hidden md:block">{step.description}</p>
                )}
              </div>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-1.5 transition-colors min-w-[20px] shrink-0",
                  isCompleted ? "bg-principal/30" : "bg-disable",
                )}
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
