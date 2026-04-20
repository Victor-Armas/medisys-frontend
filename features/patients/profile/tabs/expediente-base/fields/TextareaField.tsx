import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";
import { useFormContext } from "react-hook-form";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
  rows?: number;
  placeholder?: string;
}

export function TextareaField({ label, name, disabled, rows = 2, placeholder }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">{label}</label>
      <textarea
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 bg-fondo-inputs border border-transparent rounded-sm text-sm text-encabezado outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all resize-none disabled:opacity-50"
        {...register(name)}
      />
    </div>
  );
}
