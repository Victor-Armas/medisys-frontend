"use client";

import { useClinicSchedule } from "@/features/users/hooks/useClinicSchedule";
import { DoctorClinicItem } from "@/features/users/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  dc: DoctorClinicItem;
  baseDate: Date; // <--- NUEVO
}

const WEEK_HEADERS = ["L", "M", "M", "J", "V", "S", "D"];

export default function CalendarMonthView({ dc, baseDate }: Props) {
  // Le pasamos la baseDate al hook para que dibuje el mes correcto
  const { currentMonth } = useClinicSchedule(dc, baseDate);

  const emptyCells = Array.from({ length: currentMonth.offset });

  return (
    <div className="w-full">
      {/* Cabecera de días (L, M, M...) */}
      <div className="grid grid-cols-7 mb-3">
        {WEEK_HEADERS.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-subtitulo uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Grid del Calendario */}
      <div className="grid grid-cols-7 gap-1.5">
        {emptyCells.map((_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}

        {currentMonth.days.map((day) => {
          let dotColorClass = "bg-principal"; 
          if (day.isUnavailable) dotColorClass = "bg-gray-400";
          else if (day.isExtraTime) dotColorClass = "bg-amber-500";

          return (
            <div key={day.dateStr} className={"h-8 flex flex-col items-center justify-center relative group cursor-default" + (day.isUnavailable ? " opacity-50 bg-gray-50 rounded-md" : "")}>
              <span
                className={cn(
                  "text-[12px] font-semibold transition-colors",
                  (day.isActive || day.isUnavailable) ? "text-encabezado" : "text-subtitulo/40",
                  day.isUnavailable && "line-through text-subtitulo/60" 
                )}
              >
                {day.dayNumber}
              </span>

              {(day.isActive || day.isUnavailable) && <span className={cn("w-1 h-1 rounded-full mt-0.5", dotColorClass)} />}
            </div>
          )
        })}
      </div>
    </div>
  );
}
