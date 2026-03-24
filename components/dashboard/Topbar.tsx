"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Resumen general del consultorio",
  },
  "/patients": { title: "Pacientes", subtitle: "Gestión de pacientes" },
  "/appointments": { title: "Citas", subtitle: "Agenda médica" },
  "/records": { title: "Expedientes", subtitle: "Historial clínico" },
  "/prescriptions": { title: "Recetas", subtitle: "Recetas médicas" },
  "/users": { title: "Usuarios", subtitle: "Gestión de usuarios del sistema" },
  "/settings": { title: "Configuración", subtitle: "Ajustes del sistema" },
};

export function Topbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const page = pageTitles[pathname] ?? { title: "MediSys", subtitle: "" };

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "??";

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-14 bg-bg-surface dark:bg-bg-surface border-b border-border-default flex items-center justify-between px-6 shrink-0">
      {/* Título */}
      <div>
        <h1 className="text-sm font-semibold text-text-primary capitalize">
          {page.title}
        </h1>
        <p
          suppressHydrationWarning
          className="text-[11px] text-text-secondary capitalize"
        >
          {fecha}
        </p>
      </div>

      {/* Búsqueda */}
      <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl bg-bg-base dark:bg-bg-elevated border border-border-default w-72">
        <Search size={13} className="text-text-secondary shrink-0" />
        <input
          type="text"
          placeholder="Buscar pacientes, citas..."
          className="flex-1 bg-transparent text-sm outline-none text-text-primary placeholder:text-text-secondary"
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 rounded-lg bg-bg-base dark:bg-bg-elevated border border-border-default flex items-center justify-center text-text-secondary hover:text-brand transition-colors cursor-pointer">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
        </button>

        <ThemeToggle />

        <div className="flex items-center gap-2 pl-2 border-l border-border-default">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white text-xs font-semibold cursor-pointer">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-text-primary leading-tight">
              {user?.name}
            </p>
            <p className="text-[11px] text-text-secondary leading-tight">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
