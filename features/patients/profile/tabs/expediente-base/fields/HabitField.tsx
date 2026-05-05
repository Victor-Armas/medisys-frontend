import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import type { HabitStatus } from "../../../../types/patient.types";
import { Cigarette, Activity, HelpCircle, Martini } from "lucide-react";
import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";
import { HABIT_LABELS } from "@/features/patients/constants/patient.constants";

const ICON_MAP = {
  cigarette: Cigarette,
  alcohol: Martini,
  activity: Activity,
  unknown: HelpCircle,
};

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  detailName: keyof MedicalHistoryFormData;
  disabled: boolean;
  icon: keyof typeof ICON_MAP;
}

export function HabitField({ label, name, detailName, disabled, icon }: Props) {
  const { register, watch, setValue } = useFormContext<MedicalHistoryFormData>();
  const OPTIONS: HabitStatus[] = ["NEVER", "FORMER", "CURRENT", "UNKNOWN"];
  const current = watch(name) as HabitStatus;
  const showDetail = current === "FORMER" || current === "CURRENT";
  const Icon = ICON_MAP[icon];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className=" text-principal" size={18} strokeWidth={2.4} />
        <label className="block text-[10.5px] font-bold text-encabezado uppercase tracking-wider">{label}</label>
      </div>
      <div className="relative flex gap-1 bg-fondo-inputs rounded-lg p-1">
        {OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) {
                setValue(name, current === status ? "UNKNOWN" : status, {
                  shouldDirty: true,
                });
              }
            }}
            className={cn(
              "flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-colors duration-200",
              current === status ? "bg-principal text-white shadow-sm" : "text-subtitulo hover:bg-interior/70",
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
          placeholder="Especificar detalles..."
          className="w-full px-3 py-2 bg-fondo-inputs rounded-sm text-xs text-encabezado outline-none focus:border-2 focus:border-principal transition-all"
          {...register(detailName)}
        />
      )}
    </div>
  );
}
