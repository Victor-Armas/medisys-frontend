// features/users/components/profile/clinic-detail/availability/AvailabilityWeekView.tsx

import { useMemo } from "react";
import { AvailabilityData, ResolvedDay } from "@/features/users/types/availability.types";
import { formatDisplayDate, toDateStr } from "@/features/users/utils/availability.utils";
import { cn } from "@shared/lib/utils";

interface Props {
  data: AvailabilityData;
}

const KIND_STYLES: Record<ResolvedDay["kind"], string> = {
  base: "bg-brand/80 text-white",
  custom: "bg-amber-500 text-white",
  available: "bg-emerald-500 text-white",
  unavailable: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30",
  rest: "bg-bg-subtle text-text-disabled",
};

const KIND_LABEL: Record<ResolvedDay["kind"], string> = {
  base: "",
  custom: "Especial",
  available: "Día extra",
  unavailable: "Inhábil",
  rest: "Descanso",
};

function formatHours(minutes: number): string {
  if (minutes === 0) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function getTodayStr(): string {
  return toDateStr(new Date());
}

export function AvailabilityWeekView({ data }: Props) {
  const today = getTodayStr();

  // Construir array ordenado de días del rango desde el objeto ya resuelto
  const days = useMemo(() => {
    return Object.keys(data.days)
      .sort()
      .map((key) => data.days[key]);
  }, [data.days]);

  return (
    <div className="space-y-2">
      {days.map((day) => {
        const isToday = day.dateStr === today;
        const isPast = day.dateStr < today;
        const hasBlocks = day.blocks.length > 0;

        return (
          <div
            key={day.dateStr}
            className={cn(
              "flex items-start gap-3 rounded-xl p-2.5 transition-colors",
              isToday && "bg-brand/5 border border-brand/20",
              isPast && !isToday && "opacity-60",
            )}
          >
            {/* Etiqueta de fecha */}
            <div className="w-24 shrink-0 pt-1">
              <p className={cn("text-[11px] font-bold uppercase tracking-wide", isToday ? "text-brand" : "text-text-secondary")}>
                {formatDisplayDate(day.dateStr)}
              </p>
              {isToday && <span className="text-[9px] font-bold text-brand uppercase tracking-wider">Hoy</span>}
            </div>

            {/* Bloques o estado vacío */}
            <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[32px]">
              {!hasBlocks ? (
                <span className={cn("text-xs px-3 py-1.5 rounded-lg w-full text-center font-medium", KIND_STYLES[day.kind])}>
                  {day.overrideNote ?? KIND_LABEL[day.kind]}
                </span>
              ) : (
                <>
                  {day.blocks.map((block, i) => (
                    <span
                      key={i}
                      className={cn(
                        "text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5",
                        KIND_STYLES[day.kind],
                      )}
                    >
                      {block.startTime} – {block.endTime}
                      {/* Badge de tipo si no es base */}
                      {day.kind !== "base" && i === 0 && (
                        <span className="text-[9px] font-bold uppercase tracking-wide opacity-80 border border-current/30 px-1 rounded">
                          {KIND_LABEL[day.kind]}
                        </span>
                      )}
                    </span>
                  ))}
                  {/* Total horas */}
                  {day.totalMinutes > 0 && (
                    <span className="text-[10px] font-semibold text-text-secondary ml-auto">{formatHours(day.totalMinutes)}</span>
                  )}
                </>
              )}
            </div>

            {/* Nota del override */}
            {day.overrideNote && hasBlocks && (
              <span className="text-[10px] italic text-text-secondary truncate max-w-[120px] pt-1.5 shrink-0">
                &quot;{day.overrideNote}&quot;
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
