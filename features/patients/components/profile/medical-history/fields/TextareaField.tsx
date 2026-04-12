import { useFormContext } from "react-hook-form";
import type { MedicalHistoryFormData } from "../schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
  rows?: number;
}

export function TextareaField({ label, name, disabled, rows = 2 }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">{label}</label>
      <textarea
        rows={rows}
        disabled={disabled}
        placeholder={disabled ? "—" : "Escribir aquí…"}
        className="w-full px-3 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all resize-none disabled:opacity-50"
        {...register(name)}
      />
    </div>
  );
}
