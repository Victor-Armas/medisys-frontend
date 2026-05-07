"use client";

import { hexToRgba, STATUS_CONFIG } from "../../utils/appointment.colors";
import type { AppointmentCalendarEvent, BookingSource } from "../../types/appointment.types";
import { Globe, Phone, LayoutPanelLeft, MessageCircleCheck, LucideIcon, Check, Ban, CalendarX } from "lucide-react";

const SOURCE_ICONS: Record<BookingSource, { icon: LucideIcon; color?: string }> = {
  STAFF: { icon: LayoutPanelLeft },
  WHATSAPP: { icon: MessageCircleCheck, color: "text-positive-text fill-positive" },
  PORTAL: { icon: Globe },
  PHONE: { icon: Phone },
};

const FINAL_STATUS_STYLES: Partial<Record<AppointmentCalendarEvent["status"], { bg: string; text: string; icon: LucideIcon }>> = {
  COMPLETED: {
    bg: "var(--color-positive)",
    text: "var(--color-positive-text)",
    icon: Check,
  },
  CANCELLED: {
    bg: "var(--color-negative)",
    text: "var(--color-negative-text)",
    icon: Ban,
  },
  NO_SHOW: {
    bg: "var(--color-disable)",
    text: "white",
    icon: CalendarX,
  },
} as const;

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

  const finalStatusStyle = FINAL_STATUS_STYLES[event.status];
  const isFinalStatus = !!finalStatusStyle;

  if (variant === "chip") {
    return (
      <div
        onClick={handleClick}
        title={`${event.title} — ${statusConfig.label}`}
        className={`flex items-center gap-1 rounded-sm px-1.5 py-px mb-[2px] overflow-hidden h-5 transition-all ${
          event.isPast ? "opacity-50 cursor-default" : "cursor-pointer hover:brightness-95"
        }`}
        style={!isFinalStatus ? { backgroundColor: hexToRgba(docColor, 0.15) } : { backgroundColor: finalStatusStyle.bg }}
      >
        {isFinalStatus ? (
          <finalStatusStyle.icon size={10} />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: event.isPast ? "#9CA3AF" : docColor }} />
        )}
        <span
          className="text-[9px] font-semibold truncate flex-1"
          style={!isFinalStatus ? { color: docColor } : { color: finalStatusStyle.text }}
        >
          {(
            {
              COMPLETED: "COMPLETADO",
              CANCELLED: "CANCELADO",
              NO_SHOW: "NO ACUDIÓ",
            } as Partial<Record<typeof event.status, string>>
          )[event.status] || event.title}
        </span>
        {(() => {
          const config = SOURCE_ICONS[event.bookedVia];
          const Icon = config.icon;
          return <Icon size={10} className={`opacity-60 ${config.color}`} />;
        })()}
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
      style={
        !isFinalStatus
          ? {
              backgroundColor: hexToRgba(docColor, 0.12), // Fondo suave del doctor
              borderLeft: `4px solid ${accentColor}`, // Borde grueso de la clínica
            }
          : { backgroundColor: finalStatusStyle.bg }
      }
    >
      <div className="flex items-start justify-between gap-1">
        <p
          className="text-[10px] font-bold leading-tight truncate flex-1"
          style={!isFinalStatus ? { color: docColor } : { color: finalStatusStyle.text }}
        >
          {event.title}
        </p>
        {(() => {
          const config = SOURCE_ICONS[event.bookedVia];
          const Icon = config.icon;
          return <Icon size={10} className={`opacity-60 shrink-0 mt-0.5 ${config.color}`} />;
        })()}
      </div>
      <p className="text-[9px] font-medium leading-tight truncate mt-0.5" style={{ color: statusConfig.color }}>
        {statusConfig.label}
      </p>
    </div>
  );
}
