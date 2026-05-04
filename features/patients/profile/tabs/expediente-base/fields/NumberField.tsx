import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";
import { Input } from "@/shared/ui/input";
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
      <Input
        type="number"
        min={0}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name, {
          setValueAs: (v) => (v === "" ? undefined : Number(v)),
        })}
      />
    </div>
  );
}
