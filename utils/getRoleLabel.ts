import { Role } from "@/types/users.types";

export const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    badgeClass: string;
  }
> = {
  ADMIN_SYSTEM: {
    label: "Administrador del sistema",
    badgeClass: "bg-red-100 text-red-700",
  },

  MAIN_DOCTOR: {
    label: "Doctor principal",
    badgeClass: "bg-purple-100 text-purple-700",
  },

  DOCTOR: {
    label: "Doctor",
    badgeClass: "bg-blue-100 text-blue-700",
  },

  RECEPTIONIST: {
    label: "Recepcionista",
    badgeClass: "bg-green-100 text-green-700",
  },

  PATIENT: {
    label: "Paciente",
    badgeClass: "bg-green-100 text-green-700",
  },
};
