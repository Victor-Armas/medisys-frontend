"use client";

import dayjs from "dayjs";
import { CustomCalendarEvent, parseEventId } from "../../hooks/useCalendarEvents";

interface Props {
  event: CustomCalendarEvent;
}

const TYPE_LABEL: Record<string, string> = {
  CUSTOM: "Especial",
  AVAILABLE: "Día extra",
  UNAVAILABLE: "Inhábil",
  BASE: "Horario Laboral",
};

const TYPE_COLOR: Record<string, string> = {
  CUSTOM: "text-orange-500",
  AVAILABLE: "text-green-500",
  UNAVAILABLE: "text-red-500",
  BASE: "text-purple-500",
};

export function DeleteScheduleMessage({ event }: Props) {
  const parsed = parseEventId(event.id as string);
  if (!parsed) return null;

  const dateFormatted = dayjs(parsed.dateStr).format("dddd, DD [de] MMMM [de] YYYY");
  const startTime = (event.start as dayjs.Dayjs).format("HH:mm");
  const endTime = (event.end as dayjs.Dayjs).format("HH:mm");
  const typeLabel = TYPE_LABEL[event.type ?? ""] || "Horio Laboral";
  const typeColor = TYPE_COLOR[event.type ?? ""] || "text-gray-500";

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* Mensaje introductorio */}
      <p className="text-sm text-muted-foreground">¿Estás seguro de que deseas eliminar este registro de la agenda?</p>

      {/* Tarjeta de detalles */}
      <div className="bg-slate-50 dark:bg-white/5 border border-border-default rounded-xl p-4">
        <div className="flex flex-col gap-1">
          {/* Tipo de evento */}
          {event.type && <span className={`text-xs font-bold uppercase tracking-wider ${typeColor}`}>{typeLabel}</span>}

          {/* Fecha */}
          <h4 className="font-bold text-foreground capitalize">{dateFormatted}</h4>

          {/* Horario */}
          <span className="text-sm text-muted-foreground">{event.allDay ? "Todo el día" : `${startTime} - ${endTime}`}</span>

          {/* Título opcional */}
          {event.title && <p className="text-xs italic mt-2 pt-2 border-t border-border-default/50 opacity-80">{event.title}</p>}
        </div>
      </div>

      {/* Advertencia */}
      <p className="text-xs text-red-500 font-semibold uppercase tracking-tight">
        Esta acción eliminará el bloque permanentemente
      </p>
    </div>
  );
}
