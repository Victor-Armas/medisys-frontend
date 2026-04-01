import { User } from "./users.types";
import type { DoctorProfile as PrismaDoctor, Schedule, DoctorClinic } from "@db/models";

// ─── Horarios del doctor ─────────────────────────────────────
export interface DoctorSchedule extends Schedule {
  id: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

// ─── Consultorio resumido ─────────────────────────────────────
export interface DoctorClinicItem extends DoctorClinic {
  id: string;
  isPrimary: boolean;
  isActive: boolean;
  assignedAt: Date;
  schedules: DoctorSchedule[];
  clinic: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    isActive: boolean;
  };
}

// ─── Perfil médico completo ───────────────────────────────────
// Refleja exactamente el modelo DoctorProfile de Prisma
export interface DoctorProfile extends PrismaDoctor {
  id: string;
  // Dirección (NOT NULL en Prisma)
  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;
  // Datos profesionales
  professionalLicense: string; // NOT NULL en Prisma
  specialty: string | null; // opcional
  university: string | null; // opcional
  fullTitle: string | null; // opcional
  signatureUrl: string | null; // sube por Cloudinary
  createdAt: Date;
  isAvailable: boolean;
  doctorClinics: DoctorClinicItem[];
}

// ─── Payload POST /api/doctors ────────────────────────────────
// Crear usuario + perfil médico desde cero en una sola operación

export interface CreateDoctorPayload
  // 1. Extraemos los campos de la cuenta (User) [cite: 4]
  extends
    Pick<User, "email" | "password" | "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal" | "phone">,
    Pick<PrismaDoctor, "professionalLicense" | "address" | "numHome" | "colony" | "city" | "state" | "zipCode" | "specialty" | "university" | "fullTitle"> {
  clinicIds?: string[];
}

// ─── Payload POST /api/doctors/assign ────────────────────────
// Asignar perfil médico a usuario que ya existe
export interface AssignDoctorPayload extends Pick<
  PrismaDoctor,
  "professionalLicense" | "address" | "numHome" | "colony" | "city" | "state" | "zipCode" | "specialty" | "university" | "fullTitle"
> {
  userId: string;
  clinicIds?: string[];
}

// ─── Type guard ───────────────────────────────────────────────
export function isDoctor(u: Pick<User, "role">) {
  return u.role === "DOCTOR" || u.role === "MAIN_DOCTOR";
}
