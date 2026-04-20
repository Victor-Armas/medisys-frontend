import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  steps: readonly string[];
  currentStep: number;
}

export function StepperHeader({ steps, currentStep }: Props) {
  return (
    <div className="px-6 pt-5 pb-4 ">
      <div className="flex items-center justify-center max-w-md mx-auto">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                  i < currentStep && "bg-principal  text-white",
                  i === currentStep && " text-principal  bg-inner-principal ",
                  i === currentStep && i === steps.length - 1 && "text-white",
                  i > currentStep && "bg-inner-secundario text-secundario",
                )}
              >
                {i < currentStep ? <Check size={16} strokeWidth={3} /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold tracking-tight transition-colors",
                  i === currentStep ? "text-principal" : "text-secundario",
                )}
              >
                {label}
              </span>
            </div>

            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-3 mb-6 transition-colors duration-500",
                  i < currentStep ? "bg-principal" : "bg-secundario",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
