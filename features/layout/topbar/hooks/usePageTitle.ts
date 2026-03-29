import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Resumen general del consultorio",
  },
  "/patients": { title: "Pacientes", subtitle: "Gestión de pacientes" },
  "/appointments": { title: "Citas", subtitle: "Agenda médica" },
  "/records": { title: "Expedientes", subtitle: "Historial clínico" },
  "/prescriptions": { title: "Recetas", subtitle: "Recetas médicas" },
  "/users": {
    title: "Usuarios",
    subtitle: "Gestión de médicos, recepcionistas y administradores",
  },
  "/settings": { title: "Configuración", subtitle: "Ajustes del sistema" },
};

export function usePageTitle() {
  const pathname = usePathname();
  return (
    Object.entries(PAGE_TITLES).find(([route]) =>
      pathname.startsWith(route)
    )?.[1] ?? { title: "MediSys", subtitle: "Panel de control" }
  );
}
