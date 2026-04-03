// features/users/components/profile/clinic-detail/availability/AvailabilityMonthView.tsx

import { AvailabilityData, ResolvedDay } from "@/features/users/types/availability.types";
import { fromDateStr, toDateStr } from "@/features/users/utils/ availability.utils";
import { cn } from "@shared/lib/utils";

interface Props {
  data: AvailabilityData;
}

const WEEK_HEADERS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const KIND_DOT: Record<ResolvedDay["kind"], string> = {
  base: "bg-brand",
  custom: "bg-amber-500",
  available: "bg-emerald-500",
  unavailable: "bg-red-500",
  rest: "bg-transparent",
};

const KIND_BG: Record<ResolvedDay["kind"], string> = {
  base: "bg-brand/10 border-brand/20",
  custom: "bg-amber-500/10 border-amber-500/20",
  available: "bg-emerald-500/10 border-emerald-500/20",
  unavailable: "bg-red-500/10 border-red-500/20",
  rest: "bg-transparent border-transparent",
};

function getTodayStr(): string {
  return toDateStr(new Date());
}

export function AvailabilityMonthView({ data }: Props) {
  const today = getTodayStr();

  // Calcular offset del primer día (lunes = 0)
  const firstDate = fromDateStr(data.rangeFrom);
  const firstWeekDay = firstDate.getUTCDay(); // 0=Dom..6=Sáb
  const offset = (firstWeekDay + 6) % 7; // offset desde lunes

  // Construir celdas
  const dayCells: (ResolvedDay | null)[] = Array(offset).fill(null);
  let current = data.rangeFrom;
  while (current <= data.rangeTo) {
    dayCells.push(data.days[current] ?? null);
    const d = fromDateStr(current);
    d.setUTCDate(d.getUTCDate() + 1);
    current = toDateStr(d);
  }

  // Rellenar hasta completar última semana
  while (dayCells.length % 7 !== 0) dayCells.push(null);

  return (
    <div>
      {/* Cabecera días semana */}
      <div className="grid grid-cols-7 mb-1">
        {WEEK_HEADERS.map((h) => (
          <div key={h} className="text-[10px] font-bold text-text-secondary text-center py-1 uppercase tracking-wide">
            {h}
          </div>
        ))}
      </div>

      {/* Grid días */}
      <div className="grid grid-cols-7 gap-1">
        {dayCells.map((day, i) => {
          if (!day) return <div key={i} />;

          const isToday = day.dateStr === today;
          const isPast = day.dateStr < today;
          const dayNum = fromDateStr(day.dateStr).getUTCDate();

          return (
            <div
              key={day.dateStr}
              className={cn(
                "rounded-lg border p-1.5 min-h-[52px] flex flex-col items-center gap-1 transition-colors",
                KIND_BG[day.kind],
                isToday && "ring-2 ring-brand ring-offset-1",
                isPast && "opacity-50",
              )}
            >
              <span className={cn("text-[11px] font-bold", isToday ? "text-brand" : "text-text-primary")}>{dayNum}</span>

              {day.kind !== "rest" && <div className={cn("w-1.5 h-1.5 rounded-full", KIND_DOT[day.kind])} />}

              {day.blocks.length > 0 && (
                <span className="text-[9px] font-semibold text-text-secondary text-center leading-tight">
                  {day.blocks[0].startTime}
                  {day.blocks.length > 1 && <span className="block">+{day.blocks.length - 1}</span>}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border-default/50">
        {[
          { kind: "base", label: "Horario normal" },
          { kind: "custom", label: "Horario especial" },
          { kind: "available", label: "Día extra" },
          { kind: "unavailable", label: "Inhábil" },
        ].map(({ kind, label }) => (
          <div key={kind} className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", KIND_DOT[kind as ResolvedDay["kind"]])} />
            <span className="text-[10px] text-text-secondary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
