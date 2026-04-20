"use client";

import { TransfusionsField } from "../fields/TransfusionsField";

import type { PatientCondition, PatientMedication, PatientAllergy } from "../../../../types/patient.types";
import { useIcd10Search, useIcd10SearchTrauma } from "@/features/patients/hooks/useCatalogSearch";
import { HistorySection } from "@/features/patients/shared/HistorySection";
import { ConditionsSection } from "../../../antecedents/ConditionsSection";
import { MedicationsSection } from "../../../antecedents/MedicationsSection";
import { AllergiesSection } from "../../../antecedents/AllergiesSection";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  medications: PatientMedication[];
  allergies: PatientAllergy[];
  canEdit: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Pathological antecedents section.
 *
 * Renders structured conditions (ICD-10 chips) for each category,
 * medications (with dose/frequency), and allergies (severity-coded).
 *
 * The only remaining field in MedicalHistoryForm is `bloodTransfusions` (boolean).
 * Everything else uses dedicated mutation hooks.
 */
export function PathologicalSection({ patientId, conditions, medications, allergies, canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes patológicos" icon="clipuser">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 mt-2">
        {/* ── LEFT COLUMN ── */}
        <div className="space-y-8">
          {/* Diseases */}
          <ConditionsSection
            patientId={patientId}
            conditions={conditions}
            category="DISEASE"
            label="Enfermedades previas (CIE-10)"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />

          {/* Medications */}
          <MedicationsSection patientId={patientId} medications={medications} canEdit={canEdit} />

          {/* Allergies */}
          <AllergiesSection patientId={patientId} allergies={allergies} canEdit={canEdit} />

          {/* Blood transfusions (boolean — stays in MedicalHistory) */}
          <TransfusionsField disabled={!canEdit} />
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-8">
          {/* Surgeries */}
          <ConditionsSection
            patientId={patientId}
            conditions={conditions}
            category="SURGERY"
            label="Cirugías"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />

          {/* Hospitalizations */}
          <ConditionsSection
            patientId={patientId}
            conditions={conditions}
            category="HOSPITALIZATION"
            label="Hospitalizaciones"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />

          {/* Trauma */}
          <ConditionsSection
            patientId={patientId}
            conditions={conditions}
            category="TRAUMA"
            label="Traumatismos"
            canEdit={canEdit}
            useSearchHook={useIcd10SearchTrauma}
          />
        </div>
      </div>
    </HistorySection>
  );
}
