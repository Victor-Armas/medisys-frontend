// shared/ui/BloodTypePicker.tsx
"use client";

import { cn } from "@/shared/lib/utils";
import type { BloodType } from "@/features/patients/types/patient.types";
import { BLOOD_TYPE_LABELS } from "@/features/patients/constants/patient.constants";

const BLOOD_TYPES = Object.keys(BLOOD_TYPE_LABELS) as BloodType[];

interface Props {
  value?: BloodType;
  onChange: (value?: BloodType) => void;
  error?: string;
  disabled?: boolean;
}

export function BloodTypePicker({ value, onChange, error, disabled }: Props) {
  const handleSelect = (bt: BloodType) => {
    onChange(value === bt ? undefined : bt);
  };

  const isSelected = (bt: BloodType) => value === bt;

  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider mb-3 text-red-600 dark:text-red-400">Tipo de sangre</p>

      {/* Grid compacto y elegante */}
      <div className="grid grid-cols-4 gap-3">
        {BLOOD_TYPES.filter((bt) => bt !== "UNKNOWN").map((bt) => {
          const selected = isSelected(bt);
          const isPositive = bt.includes("POSITIVE");
          const group = bt.split("_")[0];

          return (
            <button
              key={bt}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(bt)}
              className={cn(
                "h-10 w-full rounded-md text-sm font-bold transition-all duration-200 shadow-sm border",
                "focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-1 dark:focus:ring-offset-slate-900",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                selected
                  ? "bg-red-600 border-red-600 text-white shadow-md dark:bg-red-500 dark:border-red-500"
                  : "bg-white border-red-200 text-red-600 hover:bg-red-50 dark:bg-white/5 dark:border-red-900/30 dark:text-red-300 dark:hover:bg-red-950/40",
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                {group}
                <span className={cn("text-[10px]", selected ? "text-red-200" : "text-red-700 dark:text-red-400/80")}>
                  {isPositive ? "+" : "−"}
                </span>
              </span>
            </button>
          );
        })}

        <div className="col-span-4">
          <p className="text-[11px] font-bold uppercase tracking-wider mt-4 mb-2 text-red-600 dark:text-red-400">
            En caso de desconocer
          </p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSelect("UNKNOWN")}
            className={cn(
              "h-10 w-full rounded-md border text-xs font-bold transition-all duration-200 shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-slate-500/20",
              isSelected("UNKNOWN")
                ? "bg-slate-600 border-slate-600 text-white dark:bg-slate-500 dark:border-slate-500"
                : "bg-white border-red-200 text-red-400 hover:bg-red-50 dark:bg-white/5 dark:border-red-900/30 dark:text-red-400/60 dark:hover:bg-red-950/40",
            )}
          >
            Desconocido
          </button>
        </div>
      </div>

      {/* Error message elegante */}
      {error && (
        <p className="text-xs font-medium text-rose-500 dark:text-rose-400 flex items-center gap-1.5 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          {error}
        </p>
      )}
    </div>
  );
}
