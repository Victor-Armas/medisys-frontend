export type ScheduleOverrideType = "AVAILABLE" | "UNAVAILABLE" | "CUSTOM";

// ─── Modelos Base de Horarios (1:1 con Prisma) ──────────────────
export interface BaseScheduleRange {
  id: string;
  doctorClinicId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  dateFrom: string;
  dateTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BaseScheduleOverride {
  id: string;
  doctorClinicId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: ScheduleOverrideType;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleRange = BaseScheduleRange;
export type ScheduleOverride = BaseScheduleOverride;
