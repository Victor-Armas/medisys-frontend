// features/patients/create/sections/SectionPersonalInfo.tsx
"use client";

import { Hash } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import type { PatientFormData } from "../../schemas/patient.schema";

export function SectionPersonalInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <Input label="Nombre *" error={errors.firstName?.message as string} {...register("firstName")} />
      <Input label="Segundo Nombre" error={errors.middleName?.message as string} {...register("middleName")} />
      <Input label="Primer apellido *" error={errors.lastNamePaternal?.message as string} {...register("lastNamePaternal")} />
      <Input label="Segundo apellido" error={errors.lastNameMaternal?.message as string} {...register("lastNameMaternal")} />
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
    </div>
  );
}
