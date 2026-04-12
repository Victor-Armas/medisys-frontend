import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PatientFormData } from "../../validations/patient.schema";
import { EDUCATION_LABELS, MARITAL_STATUS_LABELS } from "../../types/patient.types";
import { Input } from "@/shared/ui/input";

export default function SectionSocioeconomic() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PatientFormData>();
  return (
    <div>
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">Estado civil</label>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-md text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all appearance-none"
              >
                <option value="">No especificado</option>
                {Object.entries(MARITAL_STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">Ocupación</label>
          <Input className="" label="Ocupación" error={errors.occupation?.message as string} {...register("occupation")} />
        </div>

        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">Escolaridad</label>
          <Controller
            name="educationLevel"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-md text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all appearance-none"
              >
                <option value="">No especificado</option>
                {Object.entries(EDUCATION_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            )}
          />
        </div>
      </div>
    </div>
  );
}
