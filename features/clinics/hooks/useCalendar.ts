import dayjs from "dayjs";
import type { CalendarEvent, CellClickInfo } from "@ilamy/calendar";
import { CustomCalendarEvent, parseEventId } from "./useCalendarEvents";
import { useCallback, useState } from "react";
import { useRemoveSchedule, useRemoveScheduleOverride, useUpdateScheduleOverride } from "./useClinics";
import { isAxiosError } from "axios";

interface Params {
  doctorClinicId: string;
  canManage: boolean;
  isPaused: boolean;
  onAddSchedule: (doctorClinicId: string, prefillDate?: string) => void;
}

export interface UseCalendarReturn {
  // Cell
  handleCellClick: (info: CellClickInfo) => void;
  // Event click
  handleEventClick: (event: CalendarEvent) => void;
  // Drag & drop
  handleEventUpdate: (event: CalendarEvent) => Promise<void>;
  // Confirm dialog state
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  setSelectedEvent: (event: CustomCalendarEvent | null) => void;
  handleConfirmDelete: () => Promise<void>;
  selectedEvent: CustomCalendarEvent | null;
}

export function useCalendar({ doctorClinicId, canManage, isPaused, onAddSchedule }: Params): UseCalendarReturn {
  const [selectedEvent, setSelectedEvent] = useState<CustomCalendarEvent | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const removeSchedule = useRemoveSchedule();
  const removeOverride = useRemoveScheduleOverride();
  const updateDateDrag = useUpdateScheduleOverride();

  const today = dayjs().startOf("day");

  // ── Cell click → open AddSchedule modal ───────────────────────────────────
  const handleCellClick = useCallback(
    (info: CellClickInfo) => {
      if (!canManage || isPaused) return;
      const dateStr = info.start.format("YYYY-MM-DD");
      if (dayjs(dateStr).isBefore(today, "day")) return;
      onAddSchedule(doctorClinicId, dateStr);
    },
    [canManage, isPaused, today, onAddSchedule, doctorClinicId],
  );

  // ── Event click → open confirm delete ─────────────────────────────────────
  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      if (!canManage || isPaused) return;
      const parsed = parseEventId(event.id as string);
      if (!parsed) return;
      if (dayjs(parsed.dateStr).isBefore(today, "day")) return;
      setSelectedEvent(event as CustomCalendarEvent);
      setConfirmOpen(true);
    },
    [canManage, isPaused, today],
  );

  // ── Confirm delete ─────────────────────────────────────────────────────────
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedEvent) return;
    const parsed = parseEventId(selectedEvent.id as string);
    if (!parsed) return;

    try {
      if (parsed.kind === "OVERRIDE") {
        //REMOVER OVERRIDE
        await removeOverride.mutateAsync(parsed.overrideId);
      } else {
        //REMOVER RANGE
        await removeSchedule.mutateAsync(parsed.rangeId);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        console.error("Error al eliminar:", err.response?.data?.message);
      }
    } finally {
      setConfirmOpen(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent, removeOverride, removeSchedule]);

  // ── Drag & Drop ────────────────────────────────────────────────────────────
  // Solo overrides son reposicionables. BASE bloqueado para no mutar
  // rangos recurrentes por accidente.
  const handleEventUpdate = useCallback(
    async (event: CalendarEvent) => {
      if (!canManage || isPaused) return;
      const parsed = parseEventId(event.id as string);
      if (!parsed || parsed.kind !== "OVERRIDE") return;
      const newDate = (event.start as dayjs.Dayjs).format("YYYY-MM-DD");
      if (dayjs(newDate).isBefore(today, "day")) return;
      // Conectar useUpdateScheduleOverride aquí cuando se active D&D completo
      await updateDateDrag.mutateAsync({
        id: parsed.overrideId,
        payload: {
          date: newDate,
        },
      });
    },
    [canManage, isPaused, today, updateDateDrag],
  );

  return {
    confirmOpen,
    selectedEvent,
    handleConfirmDelete,
    setSelectedEvent,
    setConfirmOpen,
    handleEventUpdate,
    handleCellClick,
    handleEventClick,
  };
}
