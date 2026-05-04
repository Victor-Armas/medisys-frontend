"use client";

import { cn } from "@/shared/lib/utils";
import { ConsultationResponse } from "../../types/consultation.types";
import { DIAG_TYPE } from "../../utils/consultation.utils";

interface Props {
  c: ConsultationResponse;
}

export default function DiagnosesConsultationDetail({ c }: Props) {
  return (
    <div className="bg-interior rounded-sm shadow-sm p-5">
      <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider mb-3">Diagnósticos</h2>
      <div className="flex flex-col gap-2">
        {c.diagnoses.map((d) => (
          <div
            key={d.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              d.isMain ? "bg-principal/5 border border-principal/20" : "bg-fondo-inputs",
            )}
          >
            <div className="flex-1">
              {d.icd10Code && <span className="text-[10px] font-mono text-principal font-bold mr-2">{d.icd10Code}</span>}
              <span className="text-sm text-encabezado">{d.description}</span>
              {d.notes && <p className="text-xs text-subtitulo mt-1">{d.notes}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {d.isMain && (
                <span className="text-[10px] bg-principal text-white px-2 py-0.5 rounded-full font-semibold">Principal</span>
              )}
              <span className="text-[10px] text-subtitulo">{DIAG_TYPE[d.diagnosisType]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
