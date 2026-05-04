"use client";

import { FileText } from "lucide-react";
import { ConsultationResponse } from "../../types/consultation.types";

interface Props {
  c: ConsultationResponse;
}

export default function NotesConsultationDetail({ c }: Props) {
  return (
    <div className="bg-interior rounded-sm shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FileText size={15} className="text-principal" />
        <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Nota Clínica</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Motivo de consulta", value: c.reasonForVisit },
          { label: "Padecimiento actual", value: c.currentCondition },
          { label: "Exploración física", value: c.physicalExamFindings },
          { label: "Estudios / Laboratorios", value: c.labResultsSummary },
          { label: "Plan de tratamiento", value: c.treatmentPlan },
          { label: "Indicaciones al paciente", value: c.patientInstructions },
        ].map(
          ({ label, value }) =>
            value && (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-subtitulo mb-1">{label}</p>
                <p className="text-sm text-encabezado whitespace-pre-wrap bg-fondo-inputs rounded-lg p-3">{value}</p>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
