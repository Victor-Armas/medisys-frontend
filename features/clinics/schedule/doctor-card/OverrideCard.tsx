import dayjs from "dayjs";
import { ScheduleOverride } from "../../types/clinic.types";
import { cn } from "@/shared/lib/utils";
import { OVERRIDE_CONFIG } from "../../constants/calendar.constants";
import { Clock, Trash2 } from "lucide-react";

interface OverrideCardProps {
  override: ScheduleOverride; // Forzamos que reciba la estructura exacta
  isPaused: boolean;
  canManage: boolean;
  onDelete: () => void; // Tipamos la función de callback
}

export function OverrideCard({ override, isPaused, canManage, onDelete }: OverrideCardProps) {
  const config = OVERRIDE_CONFIG[override.type];
  const date = dayjs(override.date);

  return (
    <div
      className={cn(
        "group relative rounded-sm flex items-center justify-between py-3 px-3 transition-all bg-external shadow-lg hover:shadow-xl",
        isPaused && "opacity-40 grayscale pointer-events-none",
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Acento lateral (Ahora se adapta a la altura del contenido) */}
        <div className={cn("w-1 min-h-[32px] self-stretch rounded-full shrink-0", config.dot || "bg-principal")} />

        <div className="flex flex-col justify-center gap-1 min-w-0">
          {/* Fila Superior: Fecha y Etiqueta */}
          <div className="flex items-center gap-2 leading-none">
            <span className="text-[12px] font-bold text-encabezado whitespace-nowrap">{date.format("DD MMM.")}</span>
            <span className="text-[10px] font-medium text-subtitulo/70 capitalize">{date.format("dddd")}</span>
            <span className={cn("text-[8px] px-1.5 py-[2px] rounded uppercase font-bold tracking-wider ml-1", config.badge)}>
              {config.label}
            </span>
          </div>

          {/* Fila Inferior: Horario y Nota */}
          <div className="flex items-center gap-2 text-[10px] leading-none mt-0.5">
            {override.startTime ? (
              <div className="flex items-center gap-1 font-semibold text-principal">
                <Clock size={11} strokeWidth={2.5} />
                <span className="tabular-nums">
                  {override.startTime} - {override.endTime}
                </span>
              </div>
            ) : (
              <span className="font-medium text-subtitulo/50">Jornada completa</span>
            )}

            {/* Separador limpio y Nota truncada */}
            {override.note && (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1 h-1 rounded-full bg-disable/60 shrink-0" />
                <span className="text-subtitulo/80 truncate" title={override.note}>
                  {override.note}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acción de eliminar: Más discreta */}
      {canManage && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-negative-text bg-negative hover:bg-negative-hover hover:text-negative-text transition-all active:scale-90"
          title="Eliminar excepción"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
