"use client";

import { formatFullDate } from "@/shared/utils/date.utils";
import { ConsultationResponse } from "../../types/consultation.types";
import { Stethoscope } from "lucide-react";
import { CONSULTATION_TYPE_LABELS } from "../../constants/vital-signs.constants";

interface Props {
  c: ConsultationResponse;
}

export default function PatientConsultationDetail({ c }: Props) {
  const doctor = c.doctorClinic.doctorProfile.user;
  return (
    <div className="bg-interior rounded-sm shadow-sm p-5">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-encabezado">
            {c.patient.firstName} {c.patient.middleName} {c.patient.lastNamePaternal} {c.patient.lastNameMaternal}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-subtitulo flex-wrap">
            <span>
              Folio: <span className="font-semibold text-principal">{c.folioNumber}</span>
            </span>
            <span>·</span>
            <span>{formatFullDate(c.consultedAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <Stethoscope size={13} />
              Dr. {doctor.firstName} {doctor.lastNamePaternal}
            </span>
            <span>·</span>
            <span className="bg-inner-principal text-principal dark:text-white text-[11px] font-semibold px-2 py-0.5 rounded-full">
              {CONSULTATION_TYPE_LABELS[c.consultationType] ?? c.consultationType}
            </span>
          </div>
        </div>
        {c.patient.allergies.length > 0 && (
          <div className="bg-negative/10 border border-negative/30 rounded-lg px-3 py-2 max-w-xs">
            <p className="text-[10px] font-bold text-negative-text uppercase tracking-wide">Alergias</p>
            <p className="text-xs text-negative-text mt-0.5">{c.patient.allergies.map((a) => a.substance).join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
