import type { DateRangeKey } from "../types/dashboard.types";

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmada",
  IN_PROGRESS: "En curso",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  NO_SHOW: "No se presentó",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f97316",
  CONFIRMED: "#3b82f6",
  IN_PROGRESS: "#8b5cf6",
  COMPLETED: "#22c55e",
  CANCELLED: "#ef4444",
  NO_SHOW: "#94a3b8",
};

export const CONSULTATION_TYPE_LABELS: Record<string, string> = {
  FIRST_VISIT: "Primera vez",
  FOLLOW_UP: "Seguimiento",
  URGENT: "Urgencia",
  ROUTINE: "Rutina",
  PROCEDURE: "Procedimiento",
};

export const APPOINTMENT_TYPE_LABELS: Record<string, string> = {
  IN_PERSON: "Presencial",
  HOME_VISIT: "Domicilio",
  VIRTUAL: "Virtual",
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};

export const CHART_COLORS = ["#7405a6", "#3b82f6", "#22c55e", "#f97316", "#ec4899", "#06b6d4", "#eab308", "#6366f1"] as const;

export interface DateRangeOption {
  key: DateRangeKey;
  label: string;
}

export const DATE_RANGE_OPTIONS: DateRangeOption[] = [
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
  { key: "3m", label: "3 meses" },
  { key: "thisMonth", label: "Este mes" },
  { key: "custom", label: "Personalizado" },
];
