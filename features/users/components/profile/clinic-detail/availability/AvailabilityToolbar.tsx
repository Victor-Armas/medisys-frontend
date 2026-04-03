// features/users/components/profile/clinic-detail/availability/AvailabilityToolbar.tsx

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@shared/lib/utils";
import { ViewMode } from "@/features/users/types/availability.types";

interface Props {
  periodLabel: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function AvailabilityToolbar({ periodLabel, viewMode, onViewModeChange, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
      {/* Navegación */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-secondary hover:text-brand hover:border-brand/40 transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold text-text-primary min-w-[160px] text-center capitalize">{periodLabel}</span>
        <button
          onClick={onNext}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-border-default text-text-secondary hover:text-brand hover:border-brand/40 transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={onToday}
          className="px-3 h-7 text-xs font-medium rounded-lg border border-border-default text-text-secondary hover:text-brand hover:border-brand/40 transition-colors cursor-pointer"
        >
          Hoy
        </button>
      </div>

      {/* Selector de vista */}
      <div className="flex items-center bg-bg-base border border-border-default rounded-lg p-0.5">
        {(["week", "month"] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md transition-all",
              viewMode === mode ? "bg-brand text-white shadow-sm" : "text-text-secondary hover:text-text-primary cursor-pointer",
            )}
          >
            {mode === "week" ? "Semana" : "Mes"}
          </button>
        ))}
      </div>
    </div>
  );
}
