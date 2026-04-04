import { DoctorProfile } from "./doctors.types";

// ─── Roles ────────────────────────────────────────────────────

export type Role = "ADMIN_SYSTEM" | "MAIN_DOCTOR" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";

export type StaffRole = Exclude<Role, "PATIENT">;

export type TabFilter = "all" | StaffRole;

export type ModalState = "none" | "create-user-unified" | "assign-doctor";

// ─── Entidad principal ────────────────────────────────────────

export interface User {
  id: string;

  email: string;
  password?: string;

  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;

  role: Role;

  photoUrl?: string | null;

  phone?: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;

  doctorProfile?: DoctorProfile | null;
}

// ─── Payload POST /api/users ──────────────────────────────────

export interface CreateUserPayload {
  email: string;
  password: string;

  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;

  phone?: string | null;

  role: StaffRole;
}

// ─── Helpers ──────────────────────────────────────────────────

export function getFullName(u: Pick<User, "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal">) {
  return [u.firstName, u.middleName, u.lastNamePaternal, u.lastNameMaternal].filter(Boolean).join(" ");
}

export function getInitials(u: Pick<User, "firstName" | "lastNamePaternal">) {
  return `${u.firstName[0] ?? ""}${u.lastNamePaternal[0] ?? ""}`.toUpperCase();
}
