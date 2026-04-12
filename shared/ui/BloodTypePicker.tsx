// shared/ui/BloodTypePicker.tsx
"use client";

import { cn } from "@/shared/lib/utils";
import type { BloodType } from "@/features/patients/types/patient.types";
import { BLOOD_TYPE_LABELS } from "@/features/patients/types/patient.types";

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
      <p className="text-[11px] text-red-600 font-medium leading-relaxed mb-3">Tipo de sangre</p>
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
                "h-10 w-full rounded-sm cursor-pointer text-sm font-semibold transition-all duration-200 shadow",
                "focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                selected
                  ? "bg-red-600 border-red-600 text-white shadow-md"
                  : "bg-white border-red-200 text-red-600 hover:bg-red-50",
              )}
            >
              <span className="flex items-center justify-center gap-0.5">
                {group}
                <span className={cn("text-[10px]", selected ? "text-red-300" : "text-red-700")}>{isPositive ? "+" : "−"}</span>
              </span>
            </button>
          );
        })}

        <div className="col-span-4">
          <p className="text-[11px] text-red-600 font-medium leading-relaxed mt-2 mb-1">En caso de desconocer</p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleSelect("UNKNOWN")}
            className={cn(
              "h-10 w-full rounded-md cursor-pointer border text-xs font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-slate-200 focus:ring-offset-1",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              isSelected("UNKNOWN")
                ? "bg-slate-500 border-slate-500 text-white"
                : "bg-white border-red-200 text-red-400 hover:bg-red-50",
            )}
          >
            Desconocido
          </button>
        </div>
      </div>

      {/* Error message elegante */}
      {error && (
        <p className="text-xs font-medium text-rose-500 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-rose-400" />
          {error}
        </p>
      )}
    </div>
  );
}
