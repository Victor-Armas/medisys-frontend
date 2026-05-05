// features/patients/profile/PatientProfilePage.tsx
"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { getPatientFullName } from "../utils/patient.utils";
import type { Patient } from "../types/patient.types";
import type { MedicalStaffRole } from "@/features/users/types/users.types";
import { PatientHeader } from "./PatientHeader";
import { ExpedienteBaseTab } from "./tabs/expediente-base/ExpedienteBaseTab";
import { AgoyCiclosTab } from "./tabs/ago-ciclos/AgoyCiclosTab";
import { HistorialArchivoTab } from "./tabs/archivos/HistorialArchivoTab";
import { usePatientWithInitialData } from "../hooks/usePatients";

type TabKey = "expediente" | "ago" | "historial";

interface Props {
  patient: Patient;
  serverRole: MedicalStaffRole;
}

export function PatientProfilePage({ patient, serverRole }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("expediente");
  const { canManageUsers, isAdminOrMain, isDoctor } = usePermissions(serverRole);

  const { data: patientData } = usePatientWithInitialData(patient.id, patient);
  const p = patientData ?? patient;

  const hasEditPermission = canManageUsers || isAdminOrMain || isDoctor;
  const fullName = getPatientFullName(p);
  const showAgo = p.gender !== "MALE";

  const TABS = [
    { key: "expediente" as const, label: "Expediente Base", visible: true },
    { key: "ago" as const, label: "AGO & Ciclos", visible: showAgo },
    { key: "historial" as const, label: "Historial y Archivo", visible: true },
  ].filter((t) => t.visible);

  return (
    <div className="max-w-[1400px] mx-auto px-5 py-4 space-y-3">
      {/* ── Header (replaces sidebar) ── */}

      {/* ── Tab nav ── */}
      <div className="flex gap-1 bg-interior border-b border-disable/30 px-2 rounded-t-none">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] transition-all relative whitespace-nowrap",
              activeTab === tab.key ? "text-principal border-b-2 border-principal" : "text-subtitulo hover:text-encabezado",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <PatientHeader patient={p} fullName={fullName} hasEditPermission={hasEditPermission} showAddressSection={activeTab === "expediente"} />

      {/* ── Tab content ── */}
      <div className="bg-exterior pt-4">
        {activeTab === "expediente" && (
          <ExpedienteBaseTab
            existHistoryPatient={p.medicalHistory}
            patientId={p.id}
            hasEditPermission={hasEditPermission}
          />
        )}
        {activeTab === "ago" && showAgo && (
          <AgoyCiclosTab
            existHistoryPatient={p.medicalHistory}
            patientId={p.id}
            hasEditPermission={hasEditPermission}
          />
        )}
        {activeTab === "historial" && <HistorialArchivoTab patientId={p.id} hasEditPermission={hasEditPermission} />}
      </div>
    </div>
  );
}
