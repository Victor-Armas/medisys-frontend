// features/patients/create/sections/SectionDemographics.tsx
"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { GenderToggle } from "../GenderToggle";
import type { PatientFormData } from "../../schemas/patient.schema";

export function SectionDemographics() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  const birthDate = watch("birthDate");

  const age = useMemo(() => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate + "T00:00:00");
    if (isNaN(birth.getTime())) return null;
    let calculated = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculated--;
    }
    return calculated >= 0 ? calculated : null;
  }, [birthDate]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Fecha de nacimiento */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">
            Fecha de nacimiento *
          </label>
          <input
            type="date"
            className={cn(
              "w-full px-4 py-3 bg-fondo-inputs rounded-sm text-sm text-encabezado",
              "outline-none focus:ring-2 focus:ring-principal/40 transition-all",
              errors.birthDate && "focus:ring-red-400",
            )}
            {...register("birthDate")}
          />
          {errors.birthDate && (
            <p className="text-[11px] text-red-500 font-medium ml-1">{errors.birthDate.message as string}</p>
          )}
        </div>

        {/* Edad calculada */}
        <div className="flex flex-col gap-1">
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">
            Edad
          </label>
          <div className="w-full px-4 py-3 bg-disable/50 rounded-sm text-sm text-subtitulo select-none">
            {age !== null ? `${age} años` : "—"}
          </div>
        </div>
      </div>

      {/* Sexo biológico */}
      <GenderToggle />
    </div>
  );
}
