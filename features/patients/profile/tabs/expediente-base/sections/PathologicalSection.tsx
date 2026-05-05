// features/patients/profile/tabs/expediente-base/sections/PathologicalSection.tsx
"use client";

import type { PatientCondition, PatientMedication, PatientAllergy } from "../../../../types/patient.types";
import { useIcd10Search, useIcd10SearchTrauma } from "@/features/patients/hooks/useCatalogSearch";
import { HistorySection } from "@/features/patients/shared/HistorySection";
import { ConditionsSection } from "../../../antecedents/ConditionsSection";
import { MedicationsSection } from "../../../antecedents/MedicationsSection";
import { AllergiesSection } from "../../../antecedents/AllergiesSection";
import { TransfusionsField } from "../fields/TransfusionsField";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  medications: PatientMedication[];
  allergies: PatientAllergy[];
  canEdit: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Divider() {
  return <div className="border-t border-disable/30 my-1" />;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Antecedentes patológicos.
 *
 * Layout: 2 columnas balanceadas.
 * Izquierda: Enfermedades + Medicamentos + Alergias + Transfusiones
 * Derecha: Cirugías + Hospitalizaciones + Traumatismos
 */
export function PathologicalSection({ patientId, conditions, medications, allergies, canEdit }: Props) {
  // Pre-filter: only PATHOLOGICAL conditions for this section
  const pathologicalConditions = conditions.filter((c) => c.type === "PATHOLOGICAL");

  return (
    <HistorySection title="Antecedentes patológicos" icon="clipuser">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
        {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <ConditionsSection
            patientId={patientId}
            conditions={pathologicalConditions}
            category="DISEASE"
            label="Enfermedades previas (CIE-10)"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />

          <Divider />

          <MedicationsSection patientId={patientId} medications={medications} canEdit={canEdit} />

          <Divider />

          <AllergiesSection patientId={patientId} allergies={allergies} canEdit={canEdit} />
        </div>

        {/* ── RIGHT COLUMN ───────────────────────────────────────────────── */}
        <div className="space-y-5">
          <ConditionsSection
            patientId={patientId}
            conditions={pathologicalConditions}
            category="SURGERY"
            label="Cirugías"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />

          <Divider />

          <ConditionsSection
            patientId={patientId}
            conditions={pathologicalConditions}
            category="HOSPITALIZATION"
            label="Hospitalizaciones"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />

          <Divider />

          <ConditionsSection
            patientId={patientId}
            conditions={pathologicalConditions}
            category="TRAUMA"
            label="Traumatismos"
            canEdit={canEdit}
            useSearchHook={useIcd10SearchTrauma}
          />

          <Divider />

          <TransfusionsField disabled={!canEdit} />
        </div>
      </div>
    </HistorySection>
  );
}
