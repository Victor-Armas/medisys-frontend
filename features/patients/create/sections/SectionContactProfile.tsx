// features/patients/create/sections/SectionContactProfile.tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { Mail, Phone } from "lucide-react";
import type { PatientFormData } from "../../schemas/patient.schema";
import { EDUCATION_LABELS, MARITAL_STATUS_LABELS } from "../../constants/patient.constants";

export function SectionContactProfile() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  const selectClass = cn(
    "w-full px-4 py-3 bg-fondo-inputs rounded-sm text-sm text-encabezado",
    "outline-none focus:ring-2 focus:ring-principal/40 transition-all appearance-none",
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {/* Teléfono */}
      <Input
        label="Teléfono *"
        icon={Phone}
        type="tel"
        placeholder="10 dígitos"
        error={errors.phone?.message as string}
        {...register("phone")}
      />

      {/* Correo */}
      <div className="md:col-span-1 lg:col-span-2">
        <Input
          label="Correo electrónico"
          icon={Mail}
          placeholder="ejemplo@correo.com"
          error={errors.email?.message as string}
          {...register("email")}
        />
      </div>

      {/* Estado civil */}
      <div className="flex flex-col gap-1">
        <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Estado civil</label>
        <Controller
          name="maritalStatus"
          control={control}
          render={({ field }) => (
            <select {...field} className={selectClass}>
              <option value="">Seleccione...</option>
              {Object.entries(MARITAL_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      {/* Ocupación */}
      <div className="flex flex-col gap-1">
        <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Ocupación</label>
        <Input
          label="Ocupación"
          placeholder="Ej. Empleado, Estudiante..."
          error={errors.occupation?.message as string}
          {...register("occupation")}
        />
      </div>

      {/* Escolaridad */}
      <div className="flex flex-col gap-1">
        <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Escolaridad</label>
        <Controller
          name="educationLevel"
          control={control}
          render={({ field }) => (
            <select {...field} className={selectClass}>
              <option value="">Seleccione...</option>
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
  );
}
