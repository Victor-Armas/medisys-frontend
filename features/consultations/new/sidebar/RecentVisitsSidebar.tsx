"use client";
import { Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePatientConsultations } from "../../hooks/useConsultation";
import { formatDate } from "@/shared/utils/date.utils";
import { ECGLoader } from "@/shared/ui/ECGLoader";

interface Props {
  patientId: string | null;
}

export function RecentVisitsSidebar({ patientId }: Props) {
  const { data: consultations = [], isLoading } = usePatientConsultations(patientId);
  const recent = consultations.slice(0, 3);

  return (
    <div className="bg-interior rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-principal" />
        <h3 className="text-xs font-bold text-encabezado uppercase tracking-wider">Últimas visitas</h3>
      </div>
      {isLoading && <ECGLoader />}
      {!isLoading && recent.length === 0 && <p className="text-xs text-subtitulo text-center py-3">No hay visitas registradas</p>}
      {!isLoading &&
        recent.map((c) => (
          <div key={c.id} className="border-l-2 border-principal/30 pl-3 flex flex-col gap-0.5">
            <p className="text-[10px] text-subtitulo font-medium">{formatDate(c.consultedAt)}</p>
            <p className="text-xs text-encabezado leading-snug line-clamp-2">{c.diagnoses[0]?.description ?? c.reasonForVisit}</p>
            {c.id && (
              <Link
                href={`/admin/consultations/${c.id}`}
                className="text-[10px] text-principal hover:underline flex items-center gap-0.5 mt-0.5"
              >
                Ver nota completa <ChevronRight size={10} />
              </Link>
            )}
          </div>
        ))}
      {!isLoading && consultations.length > 3 && (
        <Link
          href={`/admin/patients/${patientId}`}
          className="text-xs text-principal hover:underline text-center font-medium mt-1"
        >
          Ver historial completo
        </Link>
      )}
    </div>
  );
}
