import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import type { MedicalHistoryFormData } from "../schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
}

export function CheckField({ label, name, disabled }: Props) {
  const { register } = useFormContext<MedicalHistoryFormData>();

  return (
    <label className={cn("flex items-center gap-2.5 cursor-pointer group", disabled && "cursor-not-allowed opacity-60")}>
      <input
        type="checkbox"
        disabled={disabled}
        className="w-4 h-4 rounded border-border-strong text-brand focus:ring-brand"
        {...register(name)}
      />
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
    </label>
  );
}
