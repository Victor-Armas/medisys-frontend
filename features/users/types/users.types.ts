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
export { getFullName, getInitials } from "@/shared/utils/user.utils";
