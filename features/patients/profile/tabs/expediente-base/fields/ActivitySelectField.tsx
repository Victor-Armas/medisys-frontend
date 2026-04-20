import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { PHYSICAL_ACTIVITY_OPTIONS } from "@/shared/utils/activiti.utils";
import { Dumbbell } from "lucide-react";
import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
}

export function ActivitySelectField({ label, name, disabled }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  const grouped = PHYSICAL_ACTIVITY_OPTIONS.reduce<Record<string, typeof PHYSICAL_ACTIVITY_OPTIONS>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-1">
      {/* LABEL */}
      <div className="flex items-center gap-2">
        <Dumbbell className="text-principal" size={18} strokeWidth={2.5} />
        <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">{label}</label>
      </div>

      {/* SELECT */}
      <select
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2.5 bg-fondo-inputs focus:border  rounded-xl text-sm text-encabezado",
          "outline-none focus:border-principal focus:ring-2 focus:ring-inner-principal transition-all",
          "disabled:opacity-50",
        )}
        {...register(name)}
      >
        <option value="">Seleccionar...</option>

        {Object.entries(grouped).map(([category, items]) => (
          <optgroup key={category} label={category}>
            {items.map((item) => (
              <option key={item.id} value={item.value}>
                {item.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
