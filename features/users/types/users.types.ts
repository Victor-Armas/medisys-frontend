import type { User as PrismaUser, Role as PrismaRole } from "@db/models";
import { DoctorProfile } from "./doctors.types";

// ─── Roles ────────────────────────────────────────────────────
export type Role = PrismaRole;
export type StaffRole = Exclude<Role, "PATIENT">;
export type TabFilter = "all" | StaffRole;
export type ModalState = "none" | "create-user-unified" | "assign-doctor";
// ─── Entidad principal ────────────────────────────────────────
export interface User extends Omit<PrismaUser, "photoPublicId"> {
  doctorProfile?: DoctorProfile | null;
}

// ─── Payload POST /api/users ──────────────────────────────────
// Solo los campos que el endpoint CreateUserDTO espera.
// No hereda User completo para evitar incompatibilidades de tipo.
export interface CreateUserPayload extends Pick<
  PrismaUser,
  "email" | "password" | "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal" | "phone"
> {
  role: StaffRole;
}

// ─── Helpers ──────────────────────────────────────────────────
export function getFullName(u: Pick<User, "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal">) {
  return [u.firstName, u.middleName, u.lastNamePaternal, u.lastNameMaternal].filter(Boolean).join(" ");
}

export function getInitials(u: Pick<User, "firstName" | "lastNamePaternal">) {
  return `${u.firstName[0] ?? ""}${u.lastNamePaternal[0] ?? ""}`.toUpperCase();
}
