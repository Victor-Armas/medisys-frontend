import { Role } from "@/types/users.types";

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN_SYSTEM: "Administrador del sistema",
  MAIN_DOCTOR: "Doctor principal",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Recepcionista",
  PATIENT: "paciente",
};

export const ROLE_BADGE: Record<Role, string> = {
  ADMIN_SYSTEM:
    "bg-[#eeedfe] text-[#3c3489] border-[#afa9ec] dark:bg-[#26215c] dark:text-[#cecbf6] dark:border-[#534ab7]",
  MAIN_DOCTOR:
    "bg-[#eeedfe] text-[#534ab7] border-[#afa9ec] dark:bg-[#26215c] dark:text-[#afa9ec] dark:border-[#534ab7]",
  DOCTOR:
    "bg-[#e1f5ee] text-[#085041] border-[#5dcaa5] dark:bg-[#04342c] dark:text-[#9fe1cb] dark:border-[#0f6e56]",
  RECEPTIONIST:
    "bg-[#f1efe8] text-[#5f5e5a] border-[#b4b2a9] dark:bg-[#2c2c2a] dark:text-[#d3d1c7] dark:border-[#5f5e5a]",
  PATIENT:
    "bg-[#f1efe8] text-[#5f5e5a] border-[#b4b2a9] dark:bg-[#2c2c2a] dark:text-[#d3d1c7] dark:border-[#5f5e5a]",
};

// Avatar gradient por rol
export const ROLE_AVATAR_GRADIENT: Record<Role, string> = {
  ADMIN_SYSTEM: "from-[#534ab7] to-[#26215c]",
  MAIN_DOCTOR: "from-[#7c6ab5] to-[#4a3fa0]",
  DOCTOR: "from-[#1d9e75] to-[#085041]",
  RECEPTIONIST: "from-[#888780] to-[#5f5e5a]",
  PATIENT: "from-[#888780] to-[#5f5e5a]",
};
