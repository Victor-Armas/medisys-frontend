"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AuthUser } from "@/types/auth.types";
import { ROLE_CONFIG } from "@/utils/getRoleLabel";
import { Role } from "@/types/users.types";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
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

export function Topbar({ initialUser }: { initialUser: AuthUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const user = initialUser;

  // Estado para el menú desplegable del usuario
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Efecto para cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Encuentra el título de la página (soporta rutas hijas como /patients/123)
  const page = Object.entries(pageTitles).find(([route]) =>
    pathname.startsWith(route)
  )?.[1] ?? { title: "MediSys", subtitle: "Panel de control" };

  // Corrección CRÍTICA: Se añaden signos '?' para evitar crasheos si user o user.name son null/undefined
  const initials =
    `${user?.firstName ?? ""} ${user?.lastNamePaternal ?? ""}`
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <header className="h-14 bg-bg-surface border-b border-border-default flex items-center justify-between px-6 shrink-0 relative z-10">
      {/* Título */}
      <div>
        <h1 className="text-sm font-semibold text-text-primary capitalize">
          {`Sección: ${page.title}`}
        </h1>
        <p className="text-[11px] text-text-secondary capitalize">{fecha}</p>
      </div>

      {/* Búsqueda */}
      <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl bg-bg-base border border-border-default w-72">
        <Search size={13} className="text-text-secondary shrink-0" />
        <input
          type="text"
          placeholder="Buscar pacientes, citas..."
          className="flex-1 bg-transparent text-sm outline-none text-text-primary placeholder:text-text-secondary"
        />
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 rounded-lg bg-bg-base border border-border-default flex items-center justify-center text-text-secondary hover:bg-bg-subtle hover:text-brand transition-colors cursor-pointer">
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
        </button>

        <ThemeToggle />

        {/* Perfil de Usuario con Dropdown */}
        <div
          className="relative pl-2 border-l border-border-default"
          ref={menuRef}
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 hover:bg-bg-subtle p-1 pr-2 rounded-xl transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white text-xs font-semibold">
              {initials}
            </div>
            <div className="hidden md:block min-w-[100px]">
              <p className="text-xs font-medium text-text-primary leading-tight">
                {`${user?.firstName} ${user?.lastNamePaternal}` || "Usuario"}
              </p>
              <p className="text-[11px] text-text-secondary leading-tight">
                {ROLE_CONFIG[user?.role as Role].label || "Personal médico"}
              </p>
            </div>
            <ChevronDown
              size={14}
              className="text-text-secondary ml-1 hidden md:block"
            />
          </button>

          {/* Menú Desplegable (Dropdown) */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border-default rounded-xl shadow-lg py-1 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-bg-subtle transition-colors text-left cursor-pointer font-medium"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
