"use client";

import { cn } from "@/shared/lib/utils";
import { RefreshCw } from "lucide-react";
import { DATE_RANGE_OPTIONS } from "../constants/dashboard.constants";
import type { DateRangeKey } from "../types/dashboard.types";

interface DateRangeSelectorProps {
  activeRange: DateRangeKey;
  customFrom: string;
  customTo: string;
  isFetching: boolean;
  onRangeChange: (key: DateRangeKey) => void;
  onCustomFromChange: (value: string) => void;
  onCustomToChange: (value: string) => void;
  onRefresh: () => void;
}

export function DateRangeSelector({
  activeRange,
  customFrom,
  customTo,
  isFetching,
  onRangeChange,
  onCustomFromChange,
  onCustomToChange,
  onRefresh,
}: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center bg-fondo-inputs rounded-lg p-1 gap-0.5">
        {DATE_RANGE_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onRangeChange(option.key)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
              activeRange === option.key ? "bg-principal text-white shadow-sm" : "text-subtitulo hover:text-encabezado",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {activeRange === "custom" && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => onCustomFromChange(e.target.value)}
            className="bg-fondo-inputs rounded-lg px-3 py-1.5 text-xs text-encabezado outline-none focus:ring-2 focus:ring-principal/30"
          />
          <span className="text-subtitulo text-xs">—</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => onCustomToChange(e.target.value)}
            className="bg-fondo-inputs rounded-lg px-3 py-1.5 text-xs text-encabezado outline-none focus:ring-2 focus:ring-principal/30"
          />
        </div>
      )}

      <button
        type="button"
        onClick={onRefresh}
        disabled={isFetching}
        className="p-2 rounded-lg bg-fondo-inputs text-subtitulo hover:text-principal transition-colors disabled:opacity-50"
        aria-label="Actualizar datos"
      >
        <RefreshCw size={14} className={cn(isFetching && "animate-spin")} />
      </button>
    </div>
  );
}
