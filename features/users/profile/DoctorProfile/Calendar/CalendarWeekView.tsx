import { useClinicSchedule } from "@/features/users/hooks/useClinicSchedule";
import { DoctorClinicItem } from "@/features/users/types";
import { cn } from "@/shared/lib/utils";

interface Props {
  dc: DoctorClinicItem;
  baseDate: Date; // <--- NUEVO
}

export default function CalendarWeekView({ dc, baseDate }: Props) {
  // Le pasamos la baseDate al hook para que calcule la semana correcta
  const { currentWeek } = useClinicSchedule(dc, baseDate);

  return (
    <div className="flex flex-col gap-3 w-full max-h-56 overflow-y-auto pr-2 scrollbar-hide">
      {currentWeek.map((slot, index) => {
        let pillColorClass = "bg-principal"; // por defecto regular
        if (slot.type === "unavailable") pillColorClass = "bg-gray-400";
        else if (slot.type === "extra") pillColorClass = "bg-green-500";
        else if (slot.type === "custom") pillColorClass = "bg-amber-500";

        return (
          <div key={index} className="flex items-center gap-4 w-full shrink-0">
            {/* Etiqueta del Día */}
            <span
              className={cn(
                "w-8 text-[11px] font-extrabold tracking-wider",
                slot.isActive ? "text-encabezado" : "text-subtitulo/40",
              )}
            >
              {slot.dayName}
            </span>

            {/* Contenedor de la Barra (El fondo gris) */}
            <div className="flex-1 h-8 bg-fondo-inputs rounded-full flex items-center px-1 relative overflow-hidden">
              {slot.isActive && (
                // Píldora de horario
                <div
                  className={cn(
                    "h-6 rounded-full text-white text-[11px] font-semibold flex items-center justify-center min-w-[130px] px-4 shadow-sm transition-all",
                    pillColorClass,
                    slot.isLate && !slot.isCentered ? "absolute right-1" : slot.isCentered ? "absolute left-1/2 -translate-x-1/2" : "absolute left-1",
                  )}
                >
                  {slot.time}
                </div>
              )}
            </div>

            {/* Total de Horas */}
            <span className={cn("w-5 text-right text-xs font-bold", slot.isActive ? "text-encabezado" : "text-subtitulo/40")}>
              {slot.hours}
            </span>
          </div>
        );
      })}
    </div>
  );
}
