import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
}

export function ObstetricMetricField({ label, name, disabled }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  return (
    <div
      className={cn(
        "flex flex-col p-3.5 bg-[#F5F7FA] rounded-xl border border-transparent transition-all focus-within:border-brand focus-within:ring-1 focus-within:ring-brand",
        disabled && "opacity-60",
      )}
    >
      <label className="text-[9px] font-bold text-subtitulo uppercase tracking-wider mb-1">{label}</label>
      <input
        type="number"
        min={0}
        disabled={disabled}
        className="w-full bg-transparent text-xl font-bold text-[#8B2FA1] outline-none disabled:opacity-50"
        {...register(name, {
          setValueAs: (v) => (v === "" ? undefined : Number(v)),
        })}
      />
    </div>
  );
}
