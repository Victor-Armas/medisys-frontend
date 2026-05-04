import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";
import { useFormContext } from "react-hook-form";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
}

export function DateField({ label, name, disabled }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">{label}</label>

      <input
        type="date"
        disabled={disabled}
        className="w-full px-3 py-2.5 bg-fondo-inputs rounded-sm text-sm text-encabezado outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all disabled:opacity-50"
        {...register(name)}
      />
    </div>
  );
}
