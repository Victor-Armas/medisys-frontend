"use client";

import { hexToRgba, STATUS_CONFIG } from "../../utils/appointment.colors";
import type { AppointmentCalendarEvent } from "../../types/appointment.types";

interface Props {
  event: AppointmentCalendarEvent;
  variant?: "chip" | "block"; // chip → mes, block → semana/día
  clinicColor?: string;
  onClick?: (event: AppointmentCalendarEvent) => void;
}

export function AppointmentEventChip({ event, variant = "chip", clinicColor, onClick }: Props) {
  // El color base (dominante) es el del doctor
  const docColor = event.color ?? "#7405a6";
  // El color de acento (borde) será el de la clínica, o el del doctor si no se provee
  const accentColor = clinicColor ?? docColor;

  const statusConfig = STATUS_CONFIG[event.status];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!event.isPast && onClick) onClick(event);
  };

  if (variant === "chip") {
    return (
      <div
        onClick={handleClick}
        title={`${event.title} — ${statusConfig.label}`}
        className={`flex items-center gap-1 rounded-sm px-1.5 py-px mb-[2px] overflow-hidden h-5 transition-all ${
          event.isPast ? "opacity-50 cursor-default" : "cursor-pointer hover:brightness-95"
        }`}
        style={{ backgroundColor: hexToRgba(docColor, 0.15) }}
      >
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: event.isPast ? "#9CA3AF" : docColor }} />
        <span className="text-[9px] font-semibold truncate" style={{ color: docColor }}>
          {event.title}
        </span>
      </div>
    );
  }

  // variant === "block" — para semana/día
  return (
    <div
      onClick={handleClick}
      className={`w-full h-full rounded-sm px-2 py-1 overflow-hidden transition-all ${
        event.isPast ? "opacity-50 cursor-default" : "cursor-pointer hover:brightness-95"
      }`}
      style={{
        backgroundColor: hexToRgba(docColor, 0.12), // Fondo suave del doctor
        borderLeft: `4px solid ${accentColor}`, // Borde grueso de la clínica
      }}
    >
      <p className="text-[10px] font-bold leading-tight truncate" style={{ color: docColor }}>
        {event.title}
      </p>
      <p className="text-[9px] font-medium leading-tight truncate mt-0.5" style={{ color: statusConfig.color }}>
        {statusConfig.label}
      </p>
    </div>
  );
}
