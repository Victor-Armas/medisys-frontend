// features/clinics/components/doctor-card/DoctorScheduleCalendar.tsx
"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IlamyCalendar } from "@ilamy/calendar";
import type { CalendarEvent } from "@ilamy/calendar";
import { isAxiosError } from "axios";
import type { ScheduleRange, ScheduleOverride } from "@features/clinics/types/clinic.types";
import { useUpdateSchedule, useUpdateScheduleOverride } from "@features/clinics/hooks";

dayjs.extend(utc);

// ─── Convención de IDs para recuperar metadata sin extendedProps ──
// range:{rangeId}:{originalDateFrom}:{originalDateTo}
// override:{overrideId}:{overrideType}

type EventKind = "range" | "override";

interface ParsedEventId {
  kind: EventKind;
  recordId: string;
  meta: string[]; // campos adicionales según kind
}

function encodeRangeId(rangeId: string, dateFrom: string, dateTo: string) {
  return `range:${rangeId}:${dateFrom}:${dateTo}`;
}

function encodeOverrideId(overrideId: string, type: string) {
  return `override:${overrideId}:${type}`;
}

function parseEventId(id: string): ParsedEventId | null {
  const parts = id.split(":");
  if (parts.length < 2) return null;
  const kind = parts[0] as EventKind;
  const recordId = parts[1];
  const meta = parts.slice(2);
  return { kind, recordId, meta };
}

// ─── Colores ──────────────────────────────────────────────────────
const COLORS = {
  BASE: { bg: "#7c6ab5", text: "#ffffff" },
  CUSTOM: { bg: "#f59e0b", text: "#ffffff" },
  AVAILABLE: { bg: "#10b981", text: "#ffffff" },
  UNAVAILABLE: { bg: "#ef4444", text: "#ffffff" },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────
function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

// Expande un ScheduleRange en eventos concretos para el rango visible
function expandRange(range: ScheduleRange, viewStart: Date, viewEnd: Date): CalendarEvent[] {
  console.log(range);
  const events: CalendarEvent[] = [];
  const from = new Date(Math.max(new Date(range.dateFrom + "T00:00:00Z").getTime(), viewStart.getTime()));
  const to = new Date(Math.min(new Date(range.dateTo + "T00:00:00Z").getTime(), viewEnd.getTime()));

  const current = new Date(from);
  while (current <= to) {
    if (current.getUTCDay() === range.weekDay) {
      const dateStr = toDateStr(current);
      events.push({
        id: encodeRangeId(range.id, range.dateFrom, range.dateTo),
        title: "Consulta",
        start: dayjs.utc(`${dateStr}T${range.startTime}:00`),
        end: dayjs.utc(`${dateStr}T${range.endTime}:00`),
        backgroundColor: COLORS.BASE.bg,
        color: COLORS.BASE.text,
      });
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return events;
}

// Convierte override a evento
function overrideToEvent(override: ScheduleOverride): CalendarEvent | null {
  const c = COLORS[override.type];
  const dateStr = override.date.slice(0, 10);

  if (override.type === "UNAVAILABLE") {
    return {
      id: encodeOverrideId(override.id, override.type),
      title: override.note ?? "No disponible",
      start: dayjs.utc(dateStr),
      end: dayjs.utc(dateStr),
      allDay: true,
      backgroundColor: c.bg,
      color: c.text,
    };
  }

  if (override.startTime && override.endTime) {
    const label = override.note ?? (override.type === "AVAILABLE" ? "Día extra" : "Horario especial");
    return {
      id: encodeOverrideId(override.id, override.type),
      title: label,
      start: dayjs.utc(`${dateStr}T${override.startTime}:00`),
      end: dayjs.utc(`${dateStr}T${override.endTime}:00`),
      backgroundColor: c.bg,
      color: c.text,
    };
  }

  return null;
}

// ─── Componente ───────────────────────────────────────────────────
interface Props {
  doctorClinicId: string;
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
  canManage: boolean;
  isPaused: boolean;
  onAddSchedule: (doctorClinicId: string, prefillDate?: string) => void;
  onAddOverride: (doctorClinicId: string, prefillDate?: string) => void;
}

export function DoctorScheduleCalendar({
  doctorClinicId,
  scheduleRanges,
  scheduleOverrides,
  canManage,
  isPaused,
  onAddSchedule,
  onAddOverride,
}: Props) {
  const updateSchedule = useUpdateSchedule();
  const updateOverride = useUpdateScheduleOverride();

  // Fechas del mes actual para la vista inicial
  const now = new Date();
  const viewStart = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
  const viewEnd = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0));

  const events = useMemo(() => {
    const overrideDates = new Set(scheduleOverrides.map((o) => o.date.slice(0, 10)));

    const rangeEvents = scheduleRanges.flatMap((range) => {
      const expanded = expandRange(range, viewStart, viewEnd);
      // Excluir días que tienen override — el override tiene prioridad visual
      return expanded.filter((e) => {
        const dateStr = (e.start as dayjs.Dayjs).format("YYYY-MM-DD");
        return !overrideDates.has(dateStr);
      });
    });

    const overrideEvents = scheduleOverrides.map(overrideToEvent).filter((e): e is CalendarEvent => e !== null);

    return [...rangeEvents, ...overrideEvents];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleRanges, scheduleOverrides]);

  // Click en celda vacía → abrir modal con fecha prellenada
  function handleCellClick(info: { start: dayjs.Dayjs }) {
    if (!canManage || isPaused) return;
    const dateStr = info.start.format("YYYY-MM-DD");
    if (dateStr < getTodayStr()) return; // Punto 1
    onAddSchedule(doctorClinicId, dateStr);
  }

  // Click en evento → abrir override modal
  function handleEventClick(event: CalendarEvent) {
    if (!canManage || isPaused) return;
    const dateStr = (event.start as dayjs.Dayjs).format("YYYY-MM-DD");
    if (dateStr < getTodayStr()) return;
    onAddOverride(doctorClinicId, dateStr);
  }

  // Drag & drop / resize
  async function handleEventUpdate(event: CalendarEvent) {
    if (!canManage || isPaused) return;

    const parsed = parseEventId(event.id as string);
    if (!parsed) return;

    const newDateStr = (event.start as dayjs.Dayjs).format("YYYY-MM-DD");
    if (newDateStr < getTodayStr()) return; // Punto 1

    try {
      if (parsed.kind === "range") {
        const [originalDateFrom, originalDateTo] = parsed.meta;
        const start = event.start as dayjs.Dayjs;
        const end = event.end as dayjs.Dayjs;

        // Calcular desplazamiento de días para actualizar dateFrom/dateTo
        const daysMoved = start.diff(dayjs.utc(`${originalDateFrom}T00:00:00`), "day");
        const newDateFrom = dayjs.utc(originalDateFrom).add(daysMoved, "day").format("YYYY-MM-DD");
        const newDateTo = dayjs.utc(originalDateTo).add(daysMoved, "day").format("YYYY-MM-DD");

        await updateSchedule.mutateAsync({
          id: parsed.recordId,
          payload: {
            startTime: start.format("HH:mm"),
            endTime: end.format("HH:mm"),
            dateFrom: newDateFrom,
            dateTo: newDateTo,
          },
        });
      } else if (parsed.kind === "override") {
        const start = event.start as dayjs.Dayjs;
        const end = event.end as dayjs.Dayjs;

        await updateOverride.mutateAsync({
          id: parsed.recordId,
          payload: {
            date: newDateStr,
            startTime: event.allDay ? undefined : start.format("HH:mm"),
            endTime: event.allDay ? undefined : end.format("HH:mm"),
          },
        });
      }
    } catch (err) {
      if (isAxiosError(err)) {
        console.error("Error al actualizar:", err.response?.data?.message);
      }
    }
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border-default" style={{ height: 520 }}>
      <IlamyCalendar
        events={events}
        initialView="week"
        firstDayOfWeek="monday"
        locale="es"
        timezone="America/Mexico_City"
        timeFormat="24-hour"
        disableDragAndDrop={!canManage || isPaused}
        disableCellClick={!canManage || isPaused}
        onCellClick={handleCellClick}
        onEventClick={handleEventClick}
        onEventUpdate={handleEventUpdate}
        stickyViewHeader
        // ── Header personalizado: sin botones New ni Export ──
        headerComponent={
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-bg-surface">
            <span className="text-sm font-semibold text-text-primary">Horario de atención</span>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-brand-gradient-from" />
                Consulta
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                Especial
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                Extra
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                Inhábil
              </div>
            </div>
          </div>
        }
        renderEvent={(event) => {
          const parsed = parseEventId(event.id as string);
          const isOverride = parsed?.kind === "override";
          const overrideType = parsed?.meta?.[0];

          return (
            <div className="flex flex-col px-1.5 py-1 h-full overflow-hidden text-white text-[11px] leading-tight">
              <span className="font-semibold truncate">{event.title}</span>
              {!event.allDay && (
                <span className="opacity-80 text-[10px]">
                  {(event.start as dayjs.Dayjs).format("HH:mm")}
                  {" – "}
                  {(event.end as dayjs.Dayjs).format("HH:mm")}
                </span>
              )}
              {isOverride && overrideType && overrideType !== "BASE" && (
                <span className="mt-auto text-[9px] font-bold uppercase tracking-wide opacity-75 border border-white/30 px-1 rounded w-fit">
                  {overrideType === "UNAVAILABLE" ? "Inhábil" : overrideType === "CUSTOM" ? "Especial" : "Extra"}
                </span>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
