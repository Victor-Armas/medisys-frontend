"use client";

import { useRouter } from "next/navigation";
import {
  BriefcaseMedical,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  UserCog,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavItem } from "./NavItem";
import { useAuthStore } from "@/store/auth.store";
import { useUIStore } from "@/store/ui.store";

export function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  const initials =
    user?.name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "??";

  return (
    <aside
      className={`${
        sidebarCollapsed ? "w-20" : "w-[260px]"
      } bg-bg-surface dark:bg-bg-surface border-r border-border-default dark:border-zinc-800 flex flex-col h-screen shrink-0 transition-all duration-300`}
    >
      {/* Logo + toggle */}
      <div className="pt-8 pb-4 flex items-center justify-between px-5 shrink-0">
        {sidebarCollapsed ? (
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center mx-auto">
            <BriefcaseMedical size={20} color="white" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
                <BriefcaseMedical size={18} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-brand dark:text-text-accent leading-tight">
                  MediSys
                </span>
                <span className="text-[9px] font-bold text-text-secondary dark:text-zinc-500 tracking-widest mt-0.5">
                  CLINICAL SYSTEM
                </span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-brand transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      {/* Botón expandir cuando colapsado */}
      {sidebarCollapsed && (
        <div className="px-3 py-2">
          <button
            onClick={toggleSidebar}
            className="w-full h-8 flex items-center justify-center text-text-secondary hover:text-brand transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4 px-3 space-y-1">
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
        <NavItem href="/patients" icon={Users} label="Pacientes" badge={142} />
        <NavItem href="/appointments" icon={Calendar} label="Citas" badge={8} />
        <NavItem href="/records" icon={ClipboardList} label="Expedientes" />
        <NavItem href="/prescriptions" icon={FileText} label="Recetas" />
        <NavItem href="/users" icon={UserCog} label="Usuarios" />
        <NavItem href="/settings" icon={Settings} label="Configuración" />
      </div>

      {/* Usuario */}
      <div className="p-5 mt-auto">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-brand hover:bg-brand-hover text-white transition-colors cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-text-on-brand text-xs font-semibold shrink-0">
            {initials}
          </div>
          {!sidebarCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-text-on-brand truncate">
                  {user?.name}
                </p>
                <p className="text-[11px] text-white/70 truncate mt-0.5">
                  {user?.role}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white cursor-pointer shrink-0"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
