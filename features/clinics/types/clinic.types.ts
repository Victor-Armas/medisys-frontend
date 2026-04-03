import type { EventInput } from "@fullcalendar/core";

export type ScheduleOverrideType = "AVAILABLE" | "UNAVAILABLE" | "CUSTOM";

export interface ScheduleRange {
  id: string;
  doctorClinicId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  dateFrom: string;
  dateTo: string;
  isActive: boolean;
}

export interface ScheduleOverride {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  type: ScheduleOverrideType;
  note: string | null;
}

export interface DoctorInClinic {
  id: string;
  isPrimary: boolean;
  isActive: boolean;
  assignedAt: string;
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
  doctorProfile: {
    id: string;
    specialty: string | null;
    professionalLicense: string;
    isAvailable: boolean;
    defaultAppointmentDuration: number;
    canManageOwnSchedule: boolean;
    user: {
      id: string;
      firstName: string;
      middleName: string | null;
      lastNamePaternal: string;
      lastNameMaternal: string;
      photoUrl: string | null;
      phone: string | null;
      isActive: boolean;
    };
  };
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  rfc: string | null;
  professionalLicense: string | null;
  brandColor: string | null;
  maxDoctors: number;
  isActive: boolean;
  createdAt: string;
  doctorClinics: DoctorInClinic[];
}

export interface CreateClinicPayload {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  rfc?: string;
  professionalLicense?: string;
  brandColor?: string;
  maxDoctors?: number;
}

export type UpdateClinicPayload = Partial<CreateClinicPayload>;

export interface CreateScheduleRangePayload {
  doctorClinicId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  dateFrom: string;
  dateTo: string;
}

export interface CreateScheduleOverridePayload {
  doctorClinicId: string;
  date: string;
  type: ScheduleOverrideType;
  startTime?: string;
  endTime?: string;
  note?: string;
}

// Estado del modal — tipado centralizado
export type ClinicModalState = "none" | "create-clinic" | "edit-clinic" | "add-schedule" | "add-override";

// Contexto de modal activo — evita variables sueltas en ClinicsPanelClient
export interface ActiveModalContext {
  doctorClinicId: string;
  doctorName: string;
  doctorProfileId: string; // Para multi-consultorio futuro
  prefillDate?: string;
}

export interface ClinicCalendarEvent extends EventInput {
  extendedProps: {
    type: ScheduleOverrideType | "BASE";
    note: string | null;
  };
}

// Payloads para PATCH
export interface UpdateScheduleRangePayload {
  startTime?: string;
  endTime?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export interface UpdateScheduleOverridePayload {
  date?: string;
  type?: ScheduleOverrideType;
  startTime?: string;
  endTime?: string;
  note?: string;
}
