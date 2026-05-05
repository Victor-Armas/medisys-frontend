// features/patients/profile/tabs/expediente-base/fields/DateField.tsx
import { Controller, useFormContext } from "react-hook-form";
import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled: boolean;
}

export function DateField({ label, name, disabled }: Props) {
  const { control } = useFormContext<MedicalHistoryFormData>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const rawValue = field.value as string | null | undefined;
        const displayValue = rawValue ? String(rawValue).slice(0, 10) : "";

        return (
          <div className="space-y-1">
            <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">{label}</label>
            <input
              type="date"
              disabled={disabled}
              value={displayValue}
              onChange={(e) => {
                field.onChange(e.target.value || null);
              }}
              className="w-full px-3 py-2.5 bg-fondo-inputs rounded-sm text-sm text-encabezado outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all disabled:opacity-50"
            />
          </div>
        );
      }}
    />
  );
}
