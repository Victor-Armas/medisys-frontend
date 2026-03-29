import { DoctorProfile } from "./doctors.types";

// ─── Roles ────────────────────────────────────────────────────
export type StaffRole =
  | "ADMIN_SYSTEM"
  | "MAIN_DOCTOR"
  | "DOCTOR"
  | "RECEPTIONIST";
export type Role = StaffRole | "PATIENT";

export type TabFilter =
  | "all"
  | "DOCTOR"
  | "MAIN_DOCTOR"
  | "RECEPTIONIST"
  | "ADMIN_SYSTEM";

export type ModalState = "none" | "create-user-unified" | "assign-doctor";
// ─── Entidad principal ────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;
  role: Role;
  phone?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  doctorProfile?: DoctorProfile | null;
}

// ─── Payload POST /api/users ──────────────────────────────────
// Solo los campos que el endpoint CreateUserDTO espera.
// No hereda User completo para evitar incompatibilidades de tipo.
export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;
  role: StaffRole;
  phone?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────
export function getFullName(
  u: Pick<
    User,
    "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal"
  >
) {
  return [u.firstName, u.middleName, u.lastNamePaternal, u.lastNameMaternal]
    .filter(Boolean)
    .join(" ");
}

export function getInitials(u: Pick<User, "firstName" | "lastNamePaternal">) {
  return `${u.firstName[0] ?? ""}${u.lastNamePaternal[0] ?? ""}`.toUpperCase();
}

// Alias para compatibilidad — usar User directamente en código nuevo
