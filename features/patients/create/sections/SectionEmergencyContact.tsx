// features/patients/components/sections/SectionEmergencyContact.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { PatientFormData } from "../../schemas/patient.schema";
import { Input } from "@/shared/ui/input";
import { Phone, User, Users } from "lucide-react";

export function SectionEmergencyContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  return (
    <div className="space-y-3">
      <Input
        label="Nombre del contacto"
        icon={User}
        error={errors.emergencyContactName?.message as string}
        {...register("emergencyContactName")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Parentesco"
          icon={Users}
          placeholder="Ej: Esposo/a, Hijo/a"
          error={errors.emergencyContactRelation?.message as string}
          {...register("emergencyContactRelation")}
        />
        <Input
          label="Teléfono de emergencia"
          icon={Phone}
          type="tel"
          error={errors.emergencyContactPhone?.message as string}
          {...register("emergencyContactPhone")}
        />
      </div>
    </div>
  );
}
