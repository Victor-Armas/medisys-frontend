"use client";

import { cn } from "@/shared/lib/utils";
import { Ban, Clock, Check, LucideIcon } from "lucide-react";
// Importamos tus constantes y el tipo
import { OVERRIDE_CONFIG, CALENDAR_COLORS } from "@/features/clinics/constants/calendar.constants";
import { ScheduleOverrideType } from "@/features/clinics/types/schedule.types";

/**
 * Mapeo local de iconos.
 * Mantenemos esto aquí porque los iconos son una decisión de esta vista específica.
 */
const TYPE_ICONS: Record<ScheduleOverrideType, LucideIcon> = {
  UNAVAILABLE: Ban,
  CUSTOM: Clock,
  AVAILABLE: Check,
};

interface Props {
  selectedType: ScheduleOverrideType;
  onSelect: (type: ScheduleOverrideType) => void;
}

export function OverrideTypeSelector({ selectedType, onSelect }: Props) {
  // Obtenemos las llaves de tu configuración para iterar
  const options = Object.keys(OVERRIDE_CONFIG) as ScheduleOverrideType[];

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((value) => {
        const config = OVERRIDE_CONFIG[value];
        const colors = CALENDAR_COLORS[value];
        const Icon = TYPE_ICONS[value];
        const isSelected = selectedType === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            // Accesibilidad: indica si el botón está "presionado"
            aria-pressed={isSelected}
            className={cn(
              "group relative flex flex-col items-center justify-center p-3 rounded-sm text-center transition-all duration-200",
              "hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:outline-none",
              isSelected ? "shadow-sm z-10 " : " text-subtitulo",
            )}
            // Aplicamos los colores de BASE, CUSTOM, etc., solo si está seleccionado
            style={
              isSelected
                ? {
                    borderColor: colors.bg,
                    backgroundColor: `${colors.bg}10`, // 10% de opacidad del color base
                    color: colors.bg,
                  }
                : {}
            }
          >
            {/* Contenedor del Icono */}
            <div
              className={cn(
                "mb-2 p-2 rounded-full transition-colors",
                isSelected ? "bg-white " : "bg-disable group-hover:bg-inner-secundario",
              )}
            >
              <Icon size={18} strokeWidth={isSelected ? 2.5 : 2} style={isSelected ? { color: colors.bg } : {}} />
            </div>

            {/* Texto del Label */}
            <div className="space-y-0.5">
              <p
                className={cn(
                  "text-[10px] font-bold uppercase tracking-tight leading-none",
                  isSelected ? "text-encabezado" : "text-subtitulo group-hover:text-encabezado",
                )}
              >
                {config.label}
              </p>
            </div>

            {/* El Dot indicador (reutilizando tu constante) */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", config.dot)} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
