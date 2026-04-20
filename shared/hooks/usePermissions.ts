"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";

// ─── Role sets ────────────────────────────────────────────────────────────────

const ADMIN_ROLES = ["ADMIN_SYSTEM", "MAIN_DOCTOR"] as const;
// const STAFF_ROLES = ["ADMIN_SYSTEM", "MAIN_DOCTOR", "RECEPTIONIST"] as const;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Single source of truth for UI permission guards.
 * Never duplicate role checks across components — import from here.
 *
 * Rules mirror the backend RBAC guards exactly so the UI
 * degrades gracefully before the API ever rejects a request.
 */
export function usePermissions(roleOverride?: string) {
  const user = useAuthStore((s) => s.user);
  const storeRole = useAuthStore((s) => s.user?.role ?? "");

  const role = roleOverride ?? storeRole;
  const isAdminOrMain = (ADMIN_ROLES as readonly string[]).includes(role);

  return {
    userId: user?.id,
    role,

    // ── Users module ──────────────────────────────────────────────────────────
    /** Can access /users route */
    canAccessUsers: isAdminOrMain,
    /** Can create or assign users/doctors */
    canManageUsers: isAdminOrMain,

    // ── Clinics module ────────────────────────────────────────────────────────
    /** Can create, edit, toggle or delete a clinic */
    canManageClinics: isAdminOrMain,
    /** Can assign a doctor to a clinic */
    canAssignDoctorToClinic: isAdminOrMain,

    // ── Doctor schedule ───────────────────────────────────────────────────────
    /** Can toggle canManageOwnSchedule for any doctor */
    canGrantSchedulePermission: isAdminOrMain,
    /** Can add/edit schedule ranges for any doctor */
    canManageAnySchedule: isAdminOrMain,

    // ── Profile ───────────────────────────────────────────────────────────────
    /** Can edit another user's profile */
    canEditOtherProfiles: isAdminOrMain,

    // ── Convenience ───────────────────────────────────────────────────────────
    isAdminOrMain,
    isDoctor: role === "DOCTOR",
    isReceptionist: role === "RECEPTIONIST",
    isPatient: role === "PATIENT",
  };
}
