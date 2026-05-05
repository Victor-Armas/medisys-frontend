"use client";

import Link from "next/link";
import { CalendarDays, FileText, Stethoscope } from "lucide-react";
import { usePatientConsultationTimeline } from "@/features/consultations/hooks/useConsultation";
import { cn } from "@/shared/lib/utils";

interface Props {
  patientId: string;
}

function formatDateTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("es-MX", { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function VisitHistoryPanel({ patientId }: Props) {
  const { data = [], isLoading } = usePatientConsultationTimeline(patientId);

  if (isLoading) {
    return <div className="h-56 rounded-2xl bg-interior animate-pulse" />;
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-default p-8 text-center space-y-2 bg-interior">
        <div className="mx-auto h-11 w-11 rounded-2xl bg-principal/10 text-principal flex items-center justify-center">
          <Stethoscope size={18} />
        </div>
        <h3 className="text-sm font-bold text-encabezado">No hay registro</h3>
        <p className="text-xs text-subtitulo">Aún no existen consultas registradas para este paciente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays size={16} className="text-principal" />
        <h4 className="text-sm font-bold text-encabezado">Historial de consultas</h4>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-principal/10 text-principal">{data.length}</span>
      </div>

      <div className="space-y-3">
        {data.map((c) => {
          const doctor = `${c.doctorClinic.doctorProfile.user.firstName} ${c.doctorClinic.doctorProfile.user.lastNamePaternal}`;
          return (
            <div key={c.id} className="rounded-2xl border border-disable/30 bg-interior overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-disable/20 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-encabezado truncate">{c.folioNumber}</span>
                    <span className="text-[10px] font-bold text-subtitulo truncate">· {formatDateTime(c.consultedAt)}</span>
                  </div>
                  <p className="text-[11px] text-subtitulo mt-1 truncate">
                    {doctor} · {c.doctorClinic.clinic.name}
                  </p>
                  <p className="text-xs font-semibold text-encabezado mt-2 line-clamp-2">{c.reasonForVisit}</p>
                </div>
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-subtitulo">Documentos de la consulta</p>
                  <span className="text-[10px] font-bold text-subtitulo">{c.medicalFiles.length}</span>
                </div>

                {c.medicalFiles.length === 0 ? (
                  <p className="text-xs text-subtitulo italic">Sin documentos asociados a esta consulta.</p>
                ) : (
                  <div className="space-y-2">
                    {c.medicalFiles.map((f) => (
                      <Link
                        key={f.id}
                        href={f.fileUrl}
                        target="_blank"
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-3 py-2 bg-fondo-inputs hover:bg-fondo-inputs/80 transition-colors",
                        )}
                      >
                        <div className="h-8 w-8 rounded-xl bg-principal/10 text-principal flex items-center justify-center shrink-0">
                          <FileText size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-encabezado truncate">{f.fileName}</p>
                          <p className="text-[10px] text-subtitulo truncate">{f.description ?? "Sin descripción"}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

