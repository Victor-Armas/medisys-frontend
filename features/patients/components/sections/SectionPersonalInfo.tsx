// features/patients/components/sections/SectionPersonalInfo.tsx
"use client";

import { Hash } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { GENDER_LABELS } from "../../types/patient.types";
import type { PatientFormData } from "../../validations/patient.schema";

export function SectionPersonalInfo() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  return (
    <div className="space-y-5">
      {/* ── Nombre completo estructurado ── */}
      <div>
        {/* <p className="text-[10.5px] font-bold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <User size={11} />
          Nombre completo
        </p> */}
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nombre(s) *" error={errors.firstName?.message as string} {...register("firstName")} />
          <Input label="Segundo nombre" error={errors.middleName?.message as string} {...register("middleName")} />
          <Input
            label="Apellido paterno *"
            error={errors.lastNamePaternal?.message as string}
            {...register("lastNamePaternal")}
          />
          <Input label="Apellido materno" error={errors.lastNameMaternal?.message as string} {...register("lastNameMaternal")} />
        </div>
      </div>

      {/* ── Datos demográficos ── */}
      <div>
        <div className="grid grid-cols-2 gap-3">
          {/* Fecha de nacimiento */}
          <div className="space-y-1">
            <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">
              Fecha de nacimiento *
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-md text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
              {...register("birthDate")}
            />
            {errors.birthDate && (
              <p className="text-[11px] text-red-500 font-medium ml-1">{errors.birthDate.message as string}</p>
            )}
          </div>

          {/* Género */}
          <div className="space-y-1">
            <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">Género *</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-md text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all appearance-none"
                >
                  <option value="">Seleccionar</option>
                  {Object.entries(GENDER_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.gender && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.gender.message as string}</p>}
          </div>

          {/* CURP */}
          <div className="col-span-2">
            <Input
              label="CURP"
              icon={Hash}
              className="uppercase font-mono tracking-widest text-xs"
              placeholder="XAXX010101HXXXXX00"
              error={errors.curp?.message as string}
              {...register("curp", {
                setValueAs: (v: string) => v?.toUpperCase() ?? "",
              })}
            />
            <p className="text-[10px] text-text-disabled ml-1 mt-1">Opcional. Requerido para documentos legales y facturación.</p>
          </div>
        </div>
      </div>

      {/* ── Datos socioeconómicos (colapsables visualmente) ── */}
    </div>
  );
}
