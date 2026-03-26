"use client";

import {
  BriefcaseMedical,
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavItem } from "./NavItem";
import Cookies from "js-cookie";
import { useState } from "react";

export function Sidebar({
  initialCollapsed = false,
}: {
  initialCollapsed?: boolean;
}) {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

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
      className={`${
        isCollapsed ? "w-20" : "w-[260px]"
      } bg-bg-surface dark:bg-bg-surface border-r border-border-default flex flex-col h-screen shrink-0 transition-all duration-300`}
    >
      {/* Logo + Toggle unificados */}
      <div className="pt-8 pb-4 flex items-center justify-between px-5 shrink-0">
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shrink-0">
              <BriefcaseMedical size={20} color="white" />
            </div>
            <button
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle hover:text-brand transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
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
                <span className="text-[9px] font-bold text-text-secondary tracking-widest mt-0.5">
                  CLINICAL SYSTEM
                </span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="w-6 h-6 flex items-center justify-center rounded-md text-text-secondary hover:bg-bg-subtle hover:text-brand transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
          </>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto pt-4 pb-4 px-3 space-y-1">
        <NavItem
          href="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/patients"
          icon={Users}
          label="Pacientes"
          badge={142}
          collapsed={isCollapsed}
        />
        <NavItem
          href="/appointments"
          icon={Calendar}
          label="Citas"
          badge={8}
          collapsed={isCollapsed}
        />
        <NavItem
          href="/records"
          icon={ClipboardList}
          label="Expedientes"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/prescriptions"
          icon={FileText}
          label="Recetas"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/users"
          icon={UserCog}
          label="Usuarios"
          collapsed={isCollapsed}
        />
        <NavItem
          href="/settings"
          icon={Settings}
          label="Configuración"
          collapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
