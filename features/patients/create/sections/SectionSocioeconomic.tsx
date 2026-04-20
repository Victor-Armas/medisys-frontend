import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { PatientFormData } from "../../schemas/patient.schema";
import { EDUCATION_LABELS, MARITAL_STATUS_LABELS } from "../../constants/patient.constants";
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
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Estado civil</label>
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 bg-fondo-inputs rounded-md text-sm text-subtitulo outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all appearance-none"
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
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Ocupación</label>
          <Input className="" label="Ocupación" error={errors.occupation?.message as string} {...register("occupation")} />
        </div>

        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Escolaridad</label>
          <Controller
            name="educationLevel"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-4 py-3 bg-fondo-inputs rounded-md text-sm text-subtitulo outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all appearance-none"
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
