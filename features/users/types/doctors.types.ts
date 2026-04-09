// doctors.types.ts
import { BaseScheduleOverride, BaseScheduleRange } from "@/features/clinics/types/schedule.types";
import { BaseUser } from "./users.types";
import { BaseClinic } from "@/features/clinics/types/clinic.types";

// ─── Entidad Base ─────────────────────────────────────────────
export interface BaseDoctorProfile {
  id: string;
  userId: string;
  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;
  specialty: string | null;
  professionalLicense: string;
  university: string | null;
  fullTitle: string | null;
  signatureUrl: string | null;
  signaturePublicId: string | null;
  isAvailable: boolean;
  defaultAppointmentDuration: number;
  canManageOwnSchedule: boolean;
  createdAt: string;
  updatedAt: string;
}

// Relación Base Médico-Consultorio [cite: 39, 40, 41]
export interface BaseDoctorClinic {
  id: string;
  doctorProfileId: string;
  clinicId: string;
  isPrimary: boolean;
  isActive: boolean;
  assignedAt: string;
}

// ─── Agregados (Consultas con Relaciones) ─────────────────────
export interface DoctorClinicWithRelations extends BaseDoctorClinic {
  scheduleRanges: BaseScheduleRange[];
  scheduleOverrides: BaseScheduleOverride[];
  // Solo traemos la info vital de la clínica para evitar anidar infinitamente
  clinic: Pick<BaseClinic, "id" | "name" | "slug" | "city" | "isActive">;
}

export interface DoctorProfileWithRelations extends BaseDoctorProfile {
  doctorClinics: DoctorClinicWithRelations[];
}

export type DoctorProfile = DoctorProfileWithRelations;
export type DoctorClinicItem = DoctorClinicWithRelations;

// ─── Payloads / DTOs ──────────────────────────────────────────

// Agrupamos los campos requeridos para reutilizarlos en ambos payloads
type DoctorProfileRequiredInputs = Pick<
  BaseDoctorProfile,
  "professionalLicense" | "address" | "numHome" | "colony" | "city" | "state" | "zipCode"
>;

type DoctorProfileOptionalInputs = Partial<Pick<BaseDoctorProfile, "specialty" | "university" | "fullTitle">>;

export interface CreateDoctorPayload
  extends
    Pick<BaseUser, "email" | "password" | "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal" | "phone">,
    DoctorProfileRequiredInputs,
    DoctorProfileOptionalInputs {
  clinicIds?: string[];
}

export interface AssignDoctorPayload extends DoctorProfileRequiredInputs, DoctorProfileOptionalInputs {
  userId: string;
  clinicIds?: string[];
}

export type UpdateDoctorProfilePayload = Partial<
  Pick<
    BaseDoctorProfile,
    | "address"
    | "numHome"
    | "colony"
    | "city"
    | "state"
    | "zipCode"
    | "specialty"
    | "professionalLicense"
    | "university"
    | "fullTitle"
    | "defaultAppointmentDuration"
    | "canManageOwnSchedule"
    | "isAvailable"
  >
>;

// ─── Type Guard ───────────────────────────────────────────────
export function isDoctor(u: Pick<BaseUser, "role">) {
  return u.role === "DOCTOR" || u.role === "MAIN_DOCTOR";
}
