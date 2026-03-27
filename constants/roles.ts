import { Role } from "@/types/users.types";
import type { LucideIcon } from "lucide-react";
import {
  UserRound,
  Stethoscope,
  ShieldCheck,
  Heart,
  Crown,
} from "lucide-react";

type RoleConfig = {
  label: string;
  desc: string;
  icon: LucideIcon;
  colors: {
    from: string;
    to: string;
    light: string;
    text: string;
  };
  badge: string;
  gradient: string;
};

export const getRoleConfig = (role: Role): RoleConfig => {
  switch (role) {
    case "ADMIN_SYSTEM":
      return {
        label: "Administrador del sistema",
        desc: "Acceso total a la configuración",
        icon: ShieldCheck,
        colors: {
          from: "#6b46c1",
          to: "#44337a",
          light: "rgba(107,70,193,0.08)",
          text: "#6b46c1",
        },
        badge:
          "text-purple-600 bg-linear-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 shadow-sm shadow-purple-500/10",
        gradient: "from-purple-600 to-purple-900",
      };

    case "MAIN_DOCTOR":
      return {
        label: "Doctorprincipal",
        desc: "Gestión principal de pacientes y médicos",
        icon: Crown,
        colors: {
          from: "#9f7aea",
          to: "#553c9a",
          light: "rgba(159,122,234,0.08)",
          text: "#9f7aea",
        },
        badge:
          "text-purple-400 bg-linear-to-br from-purple-400/20 to-purple-400/5 border-purple-400/30 shadow-sm shadow-purple-400/10",
        gradient: "from-purple-400 to-purple-700",
      };

    case "DOCTOR":
      return {
        label: "Doctor",
        desc: "Perfil médico completo y recetas",
        icon: Stethoscope,
        colors: {
          from: "#38a169",
          to: "#22543d",
          light: "rgba(56,161,105,0.08)",
          text: "#38a169",
        },
        badge:
          "text-green-600 bg-linear-to-br from-green-500/20 to-green-500/5 border-green-500/30 shadow-sm shadow-green-500/10",
        gradient: "from-green-500 to-green-700",
      };

    case "RECEPTIONIST":
      return {
        label: "Recepcionista",
        desc: "Citas y recepción de pacientes",
        icon: UserRound,
        colors: {
          from: "#3182ce",
          to: "#2b6cb0",
          light: "rgba(49,130,206,0.08)",
          text: "#3182ce",
        },
        badge:
          "text-sky-600 bg-linear-to-br from-sky-500/20 to-sky-500/5 border-sky-500/30 shadow-sm shadow-sky-500/10",
        gradient: "from-sky-500 to-sky-700",
      };

    case "PATIENT":
      return {
        label: "Paciente",
        desc: "Acceso a su historial y citas",
        icon: Heart,
        colors: {
          from: "#718096",
          to: "#4a5568",
          light: "rgba(113,128,150,0.08)",
          text: "#718096",
        },
        badge:
          "text-gray-600 bg-linear-to-br from-gray-500/20 to-gray-500/5 border-gray-500/30 shadow-sm shadow-gray-500/10",
        gradient: "from-gray-400 to-gray-600",
      };
  }
};
