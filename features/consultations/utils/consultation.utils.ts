import dayjs from "dayjs";

export const calculateAge = (birthDate: string): number => dayjs().diff(dayjs(birthDate), "year");

export const buildConsultationStorageKey = (appointmentId: string | null, patientId: string | null): string =>
  `consultation-draft-${appointmentId ?? "no-appt"}-${patientId ?? "no-patient"}`;

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const GENDER_LABELS: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};

export const STATUS_BADGE: Record<string, string> = {
  FIRST_VISIT: "bg-inner-secundario text-secundario",
  FOLLOW_UP: "bg-inner-principal text-principal dark:text-white",
  URGENT: "bg-negative/20 text-negative-text",
  ROUTINE: "bg-positive text-positive-text",
  PROCEDURE: "bg-wairning/20 text-wairning-text",
};

export const TYPE_LABELS: Record<string, string> = {
  FIRST_VISIT: "Primera vez",
  FOLLOW_UP: "Seguimiento",
  URGENT: "Urgencia",
  ROUTINE: "Rutina",
  PROCEDURE: "Procedimiento",
};

export const DIAG_TYPE: Record<string, string> = {
  DEFINITIVE: "Definitivo",
  PRESUMPTIVE: "Presuntivo",
  ASSOCIATED: "Asociado",
  COMPLICATION: "Complicación",
};
