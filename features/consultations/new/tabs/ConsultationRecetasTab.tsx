"use client";
import { Pill, ExternalLink, Calendar } from "lucide-react";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { usePatientPrescriptionsHistory } from "../../hooks/useConsultation";
import { cn } from "@/shared/lib/utils";
import { formatDate } from "@/shared/utils/date.utils";

interface Props {
  patientId: string;
}

const STATUS_CONFIG = {
  ISSUED: { label: "Emitida", cls: "bg-positive text-positive-text" },
  DRAFT: { label: "Borrador", cls: "bg-wairning/20 text-wairning-text" },
  CANCELLED: { label: "Cancelada", cls: "bg-negative/20 text-negative-text" },
};

export function ConsultationRecetasTab({ patientId }: Props) {
  const { data: prescriptions = [], isLoading } = usePatientPrescriptionsHistory(patientId);

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <ECGLoader />
      </div>
    );

  if (prescriptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-disable p-12 text-center">
        <Pill size={28} className="text-subtitulo mx-auto mb-3" />
        <p className="text-sm font-semibold text-encabezado">Sin recetas anteriores</p>
        <p className="text-xs text-subtitulo mt-1">El historial de recetas del paciente aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pb-6">
      <div className="flex items-center gap-2 mb-1">
        <Pill size={15} className="text-principal" />
        <h3 className="text-sm font-bold text-encabezado">Historial de recetas</h3>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-principal text-white">{prescriptions.length}</span>
      </div>

      {prescriptions.map((rx) => {
        const cfg = STATUS_CONFIG[rx.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT;
        return (
          <div key={rx.id} className="bg-interior rounded-md shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-card-header">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-principal">{rx.folioNumber}</span>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", cfg.cls)}>{cfg.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] text-subtitulo">
                  <Calendar size={10} />
                  {formatDate(rx.issuedAt)}
                </div>
                {rx.pdfUrl && (
                  <a
                    href={rx.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-semibold text-principal hover:underline"
                  >
                    <ExternalLink size={10} /> Ver PDF
                  </a>
                )}
              </div>
            </div>

            {/* Doctor/clinic */}
            <div className="px-4 py-2 text-[10px] text-subtitulo">
              Dr. <span className="font-semibold text-encabezado">{rx.doctorName}</span>
              {" · "}
              {rx.clinicName}
            </div>

            {/* Items */}
            <div className="px-4 py-3 flex flex-col gap-1.5">
              {rx.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-inner-principal text-principal text-[9px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-medium text-encabezado">{item.medicationName}</span>
                  </div>
                  <span className="text-subtitulo shrink-0 ml-2">
                    {item.dose} · {item.frequency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
