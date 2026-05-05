// features/patients/create/sections/SectionClinicalBasics.tsx
"use client";

import { Controller, useFormContext } from "react-hook-form";
import { BloodTypePicker } from "@/shared/ui/BloodTypePicker";
import type { BloodType } from "../../types/patient.types";
import { PatientFormData } from "../../schemas/patient.schema";

export function SectionClinicalBasics() {
  const {
    control,
    formState: { errors },
  } = useFormContext<PatientFormData>();

  return (
    <Controller
      name="bloodType"
      control={control}
      render={({ field }) => (
        <BloodTypePicker
          value={field.value as BloodType}
          onChange={field.onChange}
          error={errors.bloodType?.message as string}
          compact
        />
      )}
    />
  );
}
