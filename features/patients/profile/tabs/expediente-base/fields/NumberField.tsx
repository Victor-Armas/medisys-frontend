import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";
import { useFormContext } from "react-hook-form";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
  placeholder?: string;
}

export function NumberField({ label, name, disabled, placeholder }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">{label}</label>
      <input
        type="number"
        min={0}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2.5 bg-[#F5F7FA] border border-transparent rounded-xl text-sm text-encabezado outline-none focus:border-brand transition-all disabled:opacity-50"
        {...register(name, {
          setValueAs: (v) => (v === "" ? undefined : Number(v)),
        })}
      />
    </div>
  );
}
