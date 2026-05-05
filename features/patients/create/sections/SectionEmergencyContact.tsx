// features/patients/create/sections/SectionEmergencyContact.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { Phone, User, Users } from "lucide-react";
import type { PatientFormData } from "../../schemas/patient.schema";

export function SectionEmergencyContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  return (
    <div className="space-y-4">
      <Input
        label="Nombre del contacto"
        icon={User}
        error={errors.emergencyContactName?.message as string}
        {...register("emergencyContactName")}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Parentesco"
          icon={Users}
          placeholder="Seleccione..."
          error={errors.emergencyContactRelation?.message as string}
          {...register("emergencyContactRelation")}
        />
        <Input
          label="Teléfono"
          icon={Phone}
          type="tel"
          error={errors.emergencyContactPhone?.message as string}
          {...register("emergencyContactPhone")}
        />
      </div>
    </div>
  );
}
