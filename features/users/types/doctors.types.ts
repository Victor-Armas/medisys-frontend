import type { User } from "./users.types";

/* ─────────────────────────────────────────────
   Horarios del doctor
───────────────────────────────────────────── */

export interface DoctorSchedule {
  id: string;
  doctorClinicId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  dateFrom: string;
  dateTo: string;
  isActive: boolean;
}

export type ScheduleOverrideType = "AVAILABLE" | "UNAVAILABLE" | "CUSTOM";

export interface ScheduleOverrides {
  id: string;
  doctorClinicId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: ScheduleOverrideType;
  note: string | null;
}

/* ─────────────────────────────────────────────
   Consultorio resumido
───────────────────────────────────────────── */

export interface DoctorClinicItem {
  id: string;
  doctorClinicId: string;

  isPrimary: boolean;
  isActive: boolean;

  assignedAt: string;

  scheduleRanges: DoctorSchedule[];
  scheduleOverrides: ScheduleOverrides[];

  clinic: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    isActive: boolean;
  };
}

/* ─────────────────────────────────────────────
   Perfil médico completo
───────────────────────────────────────────── */

export interface DoctorProfile {
  id: string;

  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;

  defaultAppointmentDuration: number;

  professionalLicense: string;

  specialty: string | null;
  university: string | null;
  fullTitle: string | null;

  signatureUrl: string | null;

  createdAt: string;

  isAvailable: boolean;

  doctorClinics: DoctorClinicItem[];
}

/* ─────────────────────────────────────────────
   Payload crear doctor
───────────────────────────────────────────── */

export interface CreateDoctorPayload extends Pick<
  User,
  "email" | "password" | "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal" | "phone"
> {
  professionalLicense: string;

  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;

  specialty?: string | null;
  university?: string | null;
  fullTitle?: string | null;

  clinicIds?: string[];
}

/* ─────────────────────────────────────────────
   Payload asignar doctor existente
───────────────────────────────────────────── */

export interface AssignDoctorPayload {
  userId: string;

  professionalLicense: string;

  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;

  specialty?: string | null;
  university?: string | null;
  fullTitle?: string | null;

  clinicIds?: string[];
}

/* ─────────────────────────────────────────────
   Type guard
───────────────────────────────────────────── */

export function isDoctor(u: Pick<User, "role">) {
  return u.role === "DOCTOR" || u.role === "MAIN_DOCTOR";
}
