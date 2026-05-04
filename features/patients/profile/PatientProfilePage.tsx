"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { getPatientFullName } from "../utils/patient.utils";
import type { Patient } from "../types/patient.types";
import type { MedicalStaffRole } from "@/features/users/types/users.types";
import { PatientSidebar } from "./sidebar/PatientSidebar";
import { ExpedienteBaseTab } from "./tabs/expediente-base/ExpedienteBaseTab";
import { AgoyCiclosTab } from "./tabs/ago-ciclos/AgoyCiclosTab";
import { HistorialArchivoTab } from "./tabs/archivos/HistorialArchivoTab";

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
    <div className="flex items-start p-5">
      {/* ── Sidebar ── */}
      <PatientSidebar patient={patient} fullName={fullName} hasEditPermission={hasEditPermission} />

      {/* ── Main content ── */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Tab nav */}
        <div className="">
          {/* Tabs sticky */}
          <div className="sticky top-0 z-20 bg-exterior">
            <div className="flex gap-1 overflow-x-auto bg-external scrollbar-hide pl-13">
              {visibleTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] transition-all relative whitespace-nowrap",
                    activeTab === tab.key
                      ? "bg-interior text-principal border-x border-disable border-t-2 border-t-principal -mb-px z-10 rounded-t-sm shadow-[0_-2px_8px_rgba(0,0,0,0.07)]"
                      : "hover:border-t-2 hover:border-t-secundario rounded-t-sm bg-interior/60 hover:text-secundario hover:bg-interior",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="pl-4">
            {activeTab === "expediente" && (
              <ExpedienteBaseTab
                existHistoryPatient={patient.medicalHistory}
                patientId={patient.id}
                hasEditPermission={hasEditPermission}
              />
            )}

            {activeTab === "ago" && showAgo && <AgoyCiclosTab existHistoryPatient={patient.medicalHistory} patientId={patient.id} hasEditPermission={hasEditPermission} />}

            {activeTab === "historial" && <HistorialArchivoTab patientId={patient.id} hasEditPermission={hasEditPermission} />}
          </div>
        </div>
      </div>
    </div>
  );
}
