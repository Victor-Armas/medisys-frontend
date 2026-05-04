"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { ConsultationFormValues } from "../schemas/consultation.schema";
import { cn } from "@/shared/lib/utils";
import { DoctorClinic } from "../types/consultation.types";

interface Props {
  doctorClinic: DoctorClinic[];
}

export default function ClinicSelect({ doctorClinic }: Props) {
  const { register, control } = useFormContext<ConsultationFormValues>();

  const doctorClinicId = useWatch({ control, name: "doctorClinicId" });

  // 👉 No render si solo hay 1 (ya se auto-setea)
  if (doctorClinic.length <= 1) return null;

  const showWarning = !doctorClinicId;

  return (
    <div className="relative inline-block">
      {/* Select */}
      <select
        {...register("doctorClinicId", {
          required: "Selecciona una clínica",
        })}
        className={cn(
          "bg-inner-secundario text-secundario dark:text-white text-sm py-2 px-3 shadow-sm font-medium rounded-sm outline-none transition text-center",
          showWarning && "ring-2 ring-secundario",
        )}
      >
        <option value="" disabled>
          Selecciona clínica
        </option>

        {doctorClinic.map((clinic) => (
          <option key={clinic.id} value={clinic.id}>
            {clinic.clinicName}
          </option>
        ))}
      </select>

      {/* 🔥 Pulso flotante */}
      {showWarning && (
        <span className="absolute -top-1 -right-1 flex size-3 pointer-events-none">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secundario opacity-75"></span>
          <span className="relative inline-flex size-3 rounded-full bg-secundario"></span>
        </span>
      )}
    </div>
  );
}
