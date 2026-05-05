// features/patients/create/GenderToggle.tsx
"use client";

import { cn } from "@/shared/lib/utils";
import { useFormContext, Controller } from "react-hook-form";
import type { PatientFormData } from "../schemas/patient.schema";
import { GENDER_LABELS } from "../constants/patient.constants";

const GENDERS = Object.entries(GENDER_LABELS) as [string, string][];

export function GenderToggle() {
  const {
    control,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Sexo biológico *</label>
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <div className="flex gap-1.5">
            {GENDERS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => field.onChange(value)}
                className={cn(
                  "flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  field.value === value
                    ? "bg-principal text-white shadow-sm"
                    : "bg-fondo-inputs text-subtitulo hover:text-encabezado",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      />
      {errors.gender && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.gender.message as string}</p>}
    </div>
  );
}
