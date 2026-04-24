import type { AppointmentStatus, DoctorResource } from "../types/appointment.types";

// Paleta de 8 colores distintos para médicos (en orden de asignación)
export const DOCTOR_COLOR_PALETTE = [
  "#3B82F6", // azul
  "#10B981", // esmeralda
  "#F59E0B", // ámbar
  "#EF4444", // rojo
  "#8B5CF6", // violeta
  "#EC4899", // rosa
  "#14B8A6", // teal
  "#F97316", // naranja
] as const;

export type DoctorColorHex = (typeof DOCTOR_COLOR_PALETTE)[number];

// Retorna el color del médico: override del usuario → paleta por índice
export function getDoctorColor(doctorClinicId: string, resources: DoctorResource[], overrides: Record<string, string>): string {
  const override = overrides[doctorClinicId];
  if (override) return override;
  const index = resources.findIndex((r) => r.doctorClinicId === doctorClinicId);
  const safeIndex = Math.max(0, index);
  return DOCTOR_COLOR_PALETTE[safeIndex % DOCTOR_COLOR_PALETTE.length];
}

// Convierte hex → rgba para fondos de eventos
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
}

export const STATUS_CONFIG: Record<AppointmentStatus, StatusConfig> = {
  PENDING: { label: "Pendiente", color: "#D97706", bgColor: "#FEF3C7" },
  CONFIRMED: { label: "Confirmada", color: "#2563EB", bgColor: "#EFF6FF" },
  IN_PROGRESS: { label: "En consulta", color: "#7C3AED", bgColor: "#F5F3FF" },
  COMPLETED: { label: "Completada", color: "#059669", bgColor: "#ECFDF5" },
  CANCELLED: { label: "Cancelada", color: "#DC2626", bgColor: "#FEF2F2" },
  NO_SHOW: { label: "No asistió", color: "#6B7280", bgColor: "#F3F4F6" },
};
