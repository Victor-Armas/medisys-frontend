// features/patients/components/sections/SectionContactInfo.tsx
"use client";

import { Mail, Phone } from "lucide-react";

import { Input } from "@/shared/ui/input";
import { PatientFormData } from "../../schemas/patient.schema";
import { useFormContext } from "react-hook-form";

export function SectionContactInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormData>();
  return (
    <div className="space-y-3">
      <Input
        label="Teléfono *"
        icon={Phone}
        type="tel"
        inputMode="tel"
        error={errors.phone?.message as string}
        {...register("phone")}
      />
      <Input label="Email" icon={Mail} type="email" error={errors.email?.message as string} {...register("email")} />
    </div>
  );
}
