"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { getPatientFullName } from "../types/patient.types";
import type { Patient } from "../types/patient.types";
import type { MedicalStaffRole } from "@/features/users/types/users.types";
import { PatientSidebar } from "./profile/PatientSidebar";
import { ExpedienteBaseTab } from "./profile/tabs/ExpedienteBaseTab";
import { AgoyCiclosTab } from "./profile/tabs/AgoyCiclosTab";
import { HistorialArchivoTab } from "./profile/tabs/HistorialArchivoTab";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabKey = "expediente" | "ago" | "historial";

interface TabDef {
  key: TabKey;
  label: string;
  visible: boolean;
}

interface Props {
  patient: Patient;
  serverRole: MedicalStaffRole;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Main patient profile page.
 *
 * Layout: sticky sidebar (demographics + addresses) | scrollable content
 *
 * Sidebar responsibilities:
 *   - Patient demographics, contact, blood type
 *   - Address management (add / edit / mark primary) via 3-dot dropdown
 *   - Edit + Print actions
 *
 * Right panel responsibilities:
 *   - Breadcrumb navigation
 *   - Tab navigation (Expediente Base | AGO & Ciclos | Historial y Archivo)
 *   - Scrollable tab content
 *
 * Note: AGO & Ciclos tab is hidden for patients with gender MALE.
 */
export function PatientProfilePage({ patient, serverRole }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("expediente");
  const { canManageUsers, isAdminOrMain, isDoctor } = usePermissions(serverRole);

  const hasEditPermission = canManageUsers || isAdminOrMain || isDoctor;
  const fullName = getPatientFullName(patient);

  // AGO & Ciclos only for FEMALE or OTHER
  const showAgo = patient.gender !== "MALE";

  const TABS: TabDef[] = [
    { key: "expediente", label: "Expediente Base", visible: true },
    { key: "ago", label: "AGO & Ciclos", visible: showAgo },
    { key: "historial", label: "Historial y Archivo", visible: true },
  ];

  const visibleTabs = TABS.filter((t) => t.visible);

  return (
    <div className="flex items-start">
      {/* ── Sidebar ── */}
      <PatientSidebar patient={patient} fullName={fullName} hasEditPermission={hasEditPermission} />

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Breadcrumb + title */}
        {/* <nav className="flex justify-end gap-2 text-sm mb-3">
          <Link
            href="/admin/patients"
            className="flex items-center gap-1.5 p-1 -m-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Pacientes</span>
          </Link>
          <ChevronRight size={13} className="text-text-disabled" />
        </nav> */}
        {/* Tab nav */}
        <div className="bg-[#F8FAFC] border border-border-default rounded-r-md overflow-hidden">
          <div className="flex bg-slate-50/50 border-b border-slate-100 px-4 gap-1 overflow-x-auto scrollbar-hide">
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  // Tipografía: Pequeña, negrita y con mucho espaciado (estilo médico)
                  "flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] transition-all relative whitespace-nowrap",
                  activeTab === tab.key
                    ? // Tab Activo: Se vuelve blanco, "pisa" el borde inferior y tiene un acento azul superior
                      "bg-white text-brand border-x border-slate-100 border-t-2 border-t-brand -mb-px z-10 rounded-t-sm shadow-[0_-2px_8px_rgba(0,0,0,0.07)]"
                    : // Tab Inactivo: Texto grisáceo, fondo transparente
                      "text-slate-400 border-x border-transparent hover:text-slate-600 hover:bg-slate-100/50",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "expediente" && <ExpedienteBaseTab patientId={patient.id} hasEditPermission={hasEditPermission} />}
            {activeTab === "ago" && showAgo && <AgoyCiclosTab patientId={patient.id} hasEditPermission={hasEditPermission} />}
            {activeTab === "historial" && <HistorialArchivoTab patientId={patient.id} hasEditPermission={hasEditPermission} />}
          </div>
        </div>
      </div>
    </div>
  );
}
