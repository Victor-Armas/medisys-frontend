// features/patients/profile/tabs/expediente-base/sections/PathologicalCenterColumn.tsx
"use client";

import type { PatientCondition, PatientMedication } from "../../../../types/patient.types";
import { useIcd10Search, useIcd10SearchTrauma } from "@/features/patients/hooks/useCatalogSearch";
import { ConditionsSection } from "../../../antecedents/ConditionsSection";
import { MedicationsSection } from "../../../antecedents/MedicationsSection";
import { TransfusionsField } from "../fields/TransfusionsField";

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  medications: PatientMedication[];
  canEdit: boolean;
  headerRight?: React.ReactNode;
}

function Divider() {
  return <hr className="border-disable/30 my-4" />;
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return <h5 className="text-[10px] font-bold uppercase tracking-widest text-subtitulo mb-3">{children}</h5>;
}

export function PathologicalCenterColumn({ patientId, conditions, medications, canEdit, headerRight }: Props) {
  const pathological = conditions.filter((c) => c.type === "PATHOLOGICAL");

  return (
    <div className="bg-interior rounded-2xl border-2 border-interior shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-disable/20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">🩺</span>
          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-encabezado truncate">
            Antecedentes Patológicos
          </h4>
        </div>
        {headerRight}
      </div>

      <div className="px-4 py-4 space-y-0">
        {/* Enfermedades previas */}
        <SubHeader>Enfermedades Previas (CIE-10)</SubHeader>
        <ConditionsSection
          patientId={patientId}
          conditions={pathological}
          category="DISEASE"
          label="Enfermedades previas"
          canEdit={canEdit}
          useSearchHook={useIcd10Search}
        />

        <Divider />

        {/* Medicamentos */}
        <MedicationsSection patientId={patientId} medications={medications} canEdit={canEdit} />

        <Divider />

        {/* Cirugías & Hospitalizaciones */}
        <SubHeader>Cirugías &amp; Hospitalizaciones</SubHeader>
        <div className="space-y-4">
          <ConditionsSection
            patientId={patientId}
            conditions={pathological}
            category="SURGERY"
            label="Cirugías"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />
          <ConditionsSection
            patientId={patientId}
            conditions={pathological}
            category="HOSPITALIZATION"
            label="Hospitalizaciones"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />
        </div>

        <Divider />

        {/* Traumatismos + Transfusiones (stack) */}
        <SubHeader>Traumatismos</SubHeader>
        <ConditionsSection
          patientId={patientId}
          conditions={pathological}
          category="TRAUMA"
          label="Traumatismos"
          canEdit={canEdit}
          useSearchHook={useIcd10SearchTrauma}
        />

        <Divider />

        <SubHeader>Transfusiones</SubHeader>
        <TransfusionsField disabled={!canEdit} />
      </div>
    </div>
  );
}
