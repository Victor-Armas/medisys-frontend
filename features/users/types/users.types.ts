// users.types.ts

import { DoctorProfileWithRelations } from "./doctors.types";

export type Role = "ADMIN_SYSTEM" | "MAIN_DOCTOR" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";
export type StaffRole = Exclude<Role, "PATIENT">;
export type ScheduleOverrideType = "AVAILABLE" | "UNAVAILABLE" | "CUSTOM";

// ─── Entidad Base (1:1 con Prisma) ────────────────────────────
export interface BaseUser {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  middleName: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;
  role: Role;
  photoUrl: string | null;
  photoPublicId: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Agregados (Consultas con Relaciones) ─────────────────────
export interface User extends BaseUser {
  doctorProfile?: DoctorProfileWithRelations | null;
}

// ─── Payloads / DTOs ──────────────────────────────────────────
export interface CreateUserPayload extends Pick<
  BaseUser,
  "email" | "password" | "firstName" | "lastNamePaternal" | "lastNameMaternal"
> {
  middleName?: string | null;
  phone?: string | null;
  role: StaffRole;
}

export type UpdateUserPayload = Partial<
  Pick<BaseUser, "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal" | "phone" | "role" | "isActive">
>;
// ─── UI Types & Helpers ───────────────────────────────────────
export type TabFilter = "all" | StaffRole;
export type ModalState = "none" | "create-user-unified" | "assign-doctor";

export function getFullName(u: Pick<BaseUser, "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal">) {
  return [u.firstName, u.middleName, u.lastNamePaternal, u.lastNameMaternal].filter(Boolean).join(" ");
}

export function getInitials(u: Pick<BaseUser, "firstName" | "lastNamePaternal">) {
  return `${u.firstName[0] ?? ""}${u.lastNamePaternal[0] ?? ""}`.toUpperCase();
}
