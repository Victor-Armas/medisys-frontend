import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import type { HabitStatus } from "../../../../types/patient.types";
import { HABIT_LABELS } from "../../../../types/patient.types";
import type { MedicalHistoryFormData } from "../schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  detailName: keyof MedicalHistoryFormData;
  disabled: boolean;
}

export function HabitField({ label, name, detailName, disabled }: Props) {
  const { register, watch, setValue } = useFormContext<MedicalHistoryFormData>();

  const current = watch(name) as HabitStatus;
  const showDetail = current === "FORMER" || current === "CURRENT";

  return (
    <div className="space-y-3">
      <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">{label}</label>
      <div className="grid grid-cols-2 gap-1.5">
        {(["NEVER", "FORMER", "CURRENT", "UNKNOWN"] as HabitStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setValue(name, current === status ? "UNKNOWN" : status, { shouldDirty: true });
              }
            }}
            className={cn(
              "px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all",
              current === status
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-bg-surface border-border-default text-text-secondary hover:border-brand/40",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {HABIT_LABELS[status]}
          </button>
        ))}
      </div>
      {showDetail && (
        <input
          type="text"
          disabled={disabled}
          placeholder="Cantidad, frecuencia, años…"
          className="w-full px-3 py-2 bg-bg-surface border border-border-default rounded-xl text-xs text-text-primary outline-none focus:border-brand transition-all"
          {...register(detailName)}
        />
      )}
    </div>
  );
}
