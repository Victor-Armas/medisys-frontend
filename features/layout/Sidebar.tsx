"use client";

import {
  BriefcaseMedical,
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hospital,
  UserCircle,
  Stethoscope,
  ClipboardList,
} from "lucide-react";

import Cookies from "js-cookie";
import { useState } from "react";
import { NavItem } from "./NavItem";
import { usePermissions } from "@/shared/hooks/usePermissions";

export function Sidebar({ initialCollapsed = false, role }: { initialCollapsed?: boolean; role: string }) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const { canAccessUsers, canDoctorMain } = usePermissions(role);

  function toggleSidebar() {
    const newVal = !isCollapsed;
    setIsCollapsed(newVal);
    Cookies.set("sidebarCollapsed", String(newVal), {
      path: "/",
      expires: 365,
    });
  }

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-[230px]"} bg-interior flex flex-col h-screen shrink-0 transition-all duration-300`}
    >
      {/* Logo + Toggle unificados */}
      <div className="pt-8 pb-4 flex items-center justify-between px-5 shrink-0">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-sm bg-principal flex items-center justify-center shrink-0">
              <BriefcaseMedical size={20} color="white" />
            </div>
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-principal hover:bg-inner-principal transition-colors "
            >
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-principal flex items-center justify-center shrink-0">
                <BriefcaseMedical size={18} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-principal leading-tight">MediSys</span>
                <span className="text-[9px] font-bold text-subtitulo tracking-widest mt-0.5">CLINICAL SYSTEM</span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="w-6 h-6 flex items-center justify-center rounded-md text-principal hover:bg-inner-principal transition-colors "
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4 px-3 space-y-1">
        {canAccessUsers && <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" collapsed={isCollapsed} />}
        {/* badge={8} se puede usar para colocar cantidad en el sidebar */}
        <NavItem href="/appointments" icon={Calendar} label="Citas" collapsed={isCollapsed} />
        <NavItem href="/admin/consultations" icon={ClipboardList} label="Consultas" collapsed={isCollapsed} />
        {canDoctorMain && (
          <NavItem href="/admin/consultations/new" icon={Stethoscope} label="Nueva Consulta" collapsed={isCollapsed} />
        )}
        {canDoctorMain && <NavItem href="/admin/patients" icon={Users} label="Pacientes" collapsed={isCollapsed} />}
        {canDoctorMain && <NavItem href="/clinics" icon={Hospital} label="Consultorios" collapsed={isCollapsed} />}
        {canAccessUsers && <NavItem href="/users" icon={UserCog} label="Usuarios" collapsed={isCollapsed} />}
        <NavItem href="/profile" icon={UserCircle} label="Mi perfil" collapsed={isCollapsed} />
        <NavItem href="/settings" icon={Settings} label="Configuración" collapsed={isCollapsed} />
      </div>
    </aside>
  );
}
