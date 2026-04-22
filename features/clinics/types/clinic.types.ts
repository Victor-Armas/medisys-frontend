// clinic.types.ts

import { BaseDoctorClinic, BaseDoctorProfile } from "@/features/users/types/doctors.types";
export type { BaseScheduleOverride as ScheduleOverride, BaseScheduleRange as ScheduleRange } from "./schedule.types";
import { BaseScheduleOverride, BaseScheduleRange } from "./schedule.types";
import { BaseUser } from "@/features/users/types/users.types";

// ─── Entidad Base  ─────────────────────────────────────────────
export interface BaseClinic {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  logoPublicId: string | null;
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
  updatedAt: string;
}

// ─── Agregados (Consultas con Relaciones) ─────────────────────
export interface DoctorInClinicContext extends BaseDoctorClinic {
  scheduleRanges: BaseScheduleRange[];
  scheduleOverrides: BaseScheduleOverride[];
  doctorProfile: Pick<
    BaseDoctorProfile,
    "id" | "specialty" | "professionalLicense" | "isAvailable" | "defaultAppointmentDuration" | "canManageOwnSchedule"
  > & {
    user: Pick<
      BaseUser,
      "id" | "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal" | "photoUrl" | "phone" | "isActive"
    >;
  };
}

export interface ClinicWithRelations extends BaseClinic {
  doctorClinics: DoctorInClinicContext[];
}

export type Clinic = ClinicWithRelations;
export type DoctorInClinic = DoctorInClinicContext;

// ─── Payloads / DTOs ──────────────────────────────────────────
export interface CreateClinicPayload
  extends
    Pick<BaseClinic, "name">,
    Partial<
      Pick<
        BaseClinic,
        "phone" | "email" | "address" | "city" | "state" | "zipCode" | "rfc" | "professionalLicense" | "brandColor" | "maxDoctors"
      >
    > {}

export type UpdateClinicPayload = Partial<CreateClinicPayload>;

// Schedules
export type CreateScheduleRangePayload = Pick<
  BaseScheduleRange,
  "doctorClinicId" | "weekDay" | "startTime" | "endTime" | "dateFrom" | "dateTo"
>;
export type UpdateScheduleRangePayload = Partial<
  Pick<BaseScheduleRange, "startTime" | "endTime" | "dateFrom" | "dateTo" | "isActive">
>;

export type CreateScheduleOverridePayload = Pick<
  BaseScheduleOverride,
  "doctorClinicId" | "date" | "type" | "startTime" | "endTime" | "note"
>;

export type UpdateScheduleOverridePayload = Partial<
  Pick<BaseScheduleOverride, "date" | "type" | "startTime" | "endTime" | "note">
>;

// ─── UI Types ─────────────────────────────────────────────────
export type ClinicModalState = "none" | "create-clinic" | "edit-clinic" | "add-schedule" | "add-override" | "assign-doctor";

export interface ActiveModalContext {
  doctorClinicId: string;
  doctorName: string;
  doctorProfileId: string;
  prefillDate?: string;
}

export interface AssignDoctorPayload {
  doctorProfileId: string;
  isPrimary?: boolean;
}

export interface DeactivateDoctorArgs {
  clinicId: string;
  doctorProfileId: string;
}
