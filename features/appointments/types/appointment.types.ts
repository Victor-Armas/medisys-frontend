import type { CalendarEvent } from "@/shared/calendar/types";

// ─── Enums ────────────────────────────────────────────────────────────────────

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type AppointmentType = "IN_PERSON" | "HOME_VISIT" | "VIRTUAL";

export type BookingSource = "STAFF" | "WHATSAPP" | "PORTAL" | "PHONE";

// ─── Entidades anidadas ────────────────────────────────────────────────────────

interface AppointmentPatientBase {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  phone: string | null;
}

interface AppointmentPatientDetail extends AppointmentPatientBase {
  middleName: string | null;
  lastNameMaternal: string | null;
  email: string | null;
  birthDate: string;
  bloodType: string | null;
}

interface AppointmentClinicRef {
  id: string;
  name: string;
}

interface AppointmentDoctorUser {
  id: string;
  firstName: string;
  lastNamePaternal: string;
}

interface AppointmentDoctorProfile {
  user: AppointmentDoctorUser;
}

interface AppointmentDoctorClinic {
  id: string;
  clinic: AppointmentClinicRef;
  doctorProfile: AppointmentDoctorProfile;
}

// ─── Appointment shapes ────────────────────────────────────────────────────────

interface AppointmentCoreFields {
  id: string;
  startTime: string; // ISO UTC string del backend
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  bookedVia: BookingSource;
  reason: string | null;
  guestName: string | null;
  guestPhone: string | null;
  doctorClinic: AppointmentDoctorClinic;
}

export interface AppointmentListItem extends AppointmentCoreFields {
  patient: AppointmentPatientBase | null;
}

export interface AppointmentDetail extends AppointmentCoreFields {
  internalNotes: string | null;
  homeAddress: string | null;
  waPhoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  patient: AppointmentPatientDetail | null;
}

// ─── Recurso de calendario (columna de médico en day view) ────────────────────

export interface DoctorResource {
  doctorClinicId: string;
  userId: string;
  firstName: string;
  lastNamePaternal: string;
  photoUrl: string | null;
  specialty: string | null;
  clinicId: string;
  clinicName: string;
  clinicBrandColor: string | null;
  isPrimary: boolean;
}

// ─── Evento de calendario ─────────────────────────────────────────────────────
// Extiende CalendarEvent del shared con campos tipados del appointment

export interface AppointmentCalendarEvent extends CalendarEvent {
  id: string; // override: siempre string para appointments
  resourceId: string; // doctorClinicId — requerido en eventos de cita
  appointmentId: string;
  status: AppointmentStatus;
  isPast: boolean;
}

// ─── API payloads ─────────────────────────────────────────────────────────────

export interface CreateAppointmentPayload {
  doctorClinicId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  type: AppointmentType;
  patientId?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  reason?: string;
  internalNotes?: string;
  homeAddress?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: AppointmentStatus;
  reason?: string;
}

export interface ListAppointmentsQuery {
  dateFrom?: string;
  dateTo?: string;
  status?: AppointmentStatus;
  clinicId?: string;
  doctorUserId?: string;
  page?: number;
  limit?: number;
}

export interface AppointmentsListResponse {
  appointments: AppointmentListItem[];
  total: number;
  page: number;
  limit: number;
}

// ─── Slot de disponibilidad ───────────────────────────────────────────────────

// Record<"YYYY-MM-DD", "HH:MM"[]>
export type AvailabilitySlotsMap = Record<string, string[]>;

// ─── Búsqueda de pacientes ────────────────────────────────────────────────────

export interface PatientSearchResult {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  phone: string | null;
  curp: string | null;
}

// ─── Clínica con médicos (shape del endpoint GET /clinics) ────────────────────

interface ClinicDoctorUser {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  photoUrl: string | null;
  isActive: boolean;
}

interface ClinicDoctorProfile {
  id: string;
  specialty: string | null;
  user: ClinicDoctorUser;
}

interface ClinicDoctorClinic {
  id: string;
  isPrimary: boolean;
  isActive: boolean;
  doctorProfile: ClinicDoctorProfile;
}

export interface ClinicWithDoctors {
  id: string;
  name: string;
  brandColor: string | null;
  isActive: boolean;
  doctorClinics: ClinicDoctorClinic[];
}
