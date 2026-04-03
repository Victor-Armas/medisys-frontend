// features/users/components/profile/clinic-detail/availability/availability.types.ts

import type { ScheduleOverrideType } from "@features/clinics/types/clinic.types";
import { DoctorClinicItem } from "./doctors.types";

export type ViewMode = "week" | "month";

// Un bloque visual contiguo de tiempo (09:00–13:00)
export interface TimeBlock {
  startTime: string;
  endTime: string;
}

// Clasificación de un día para colorear y mostrar
export type DayKind =
  | "base" // horario normal de scheduleRanges
  | "custom" // override CUSTOM (horario distinto)
  | "available" // override AVAILABLE (día extra)
  | "unavailable" // override UNAVAILABLE (inhábil)
  | "rest"; // sin slots, sin override — descanso

export interface ResolvedDay {
  dateStr: string; // "2026-04-01"
  kind: DayKind;
  blocks: TimeBlock[]; // bloques contiguos de disponibilidad
  overrideNote: string | null;
  overrideType: ScheduleOverrideType | null;
  totalMinutes: number;
}

export interface AvailabilityData {
  rangeFrom: string;
  rangeTo: string;
  days: Record<string, ResolvedDay>; // key = "YYYY-MM-DD"
}

// Props compartidas entre vistas
export interface AvailabilityViewProps {
  data: AvailabilityData;
  viewMode: ViewMode;
}

// Input del hook y del componente orquestador
export type ClinicAvailabilityInput = Pick<DoctorClinicItem, "doctorClinicId" | "scheduleRanges" | "scheduleOverrides"> & { slotDurationMinutes: number };
