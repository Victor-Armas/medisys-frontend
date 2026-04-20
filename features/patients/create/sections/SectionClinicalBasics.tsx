// features/patients/components/sections/SectionClinicalBasics.tsx
"use client";

import { } from "lucide-react";
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
    <div className="">
      <div>
        <Controller
          name="bloodType"
          control={control}
          render={({ field }) => (
            <BloodTypePicker
              value={field.value as BloodType}
              onChange={field.onChange}
              error={errors.bloodType?.message as string}
            />
          )}
        />
        {/* <p className="text-[10px] text-subtitulo mt-2 ml-1">Visible en la cabecera del expediente. Crítico en urgencias.</p> */}
      </div>
    </div>
  );
}
