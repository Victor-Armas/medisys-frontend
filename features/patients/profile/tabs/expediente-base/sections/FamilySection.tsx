// features/patients/components/profile/medical-history/sections/FamilySection.tsx
"use client";

import type { PatientCondition } from "../../../../types/patient.types";
import { useIcd10Search } from "@/features/patients/hooks/useCatalogSearch";
import { ConditionsSection } from "../../../antecedents/ConditionsSection";
import { HistorySection } from "@/features/patients/shared/HistorySection";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  canEdit: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Heredofamilial antecedents section.
 *
 * Uses the same ConditionsSection component but with type=FAMILY
 * and a familyMember discriminator per row.
 * Supports ICD-10 search + free text fallback.
 */
export function FamilySection({ patientId, conditions, canEdit }: Props) {
  const familyConditions = conditions.filter((c) => c.type === "FAMILY");

  return (
    <HistorySection title="Antecedentes heredofamiliares" icon="dna">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConditionsSection
          patientId={patientId}
          conditions={familyConditions}
          category="DISEASE"
          type="FAMILY"
          familyMember="FATHER"
          label="Padre"
          canEdit={canEdit}
          useSearchHook={useIcd10Search}
        />

        <ConditionsSection
          patientId={patientId}
          conditions={familyConditions}
          category="DISEASE"
          type="FAMILY"
          familyMember="MOTHER"
          label="Madre"
          canEdit={canEdit}
          useSearchHook={useIcd10Search}
        />

        <ConditionsSection
          patientId={patientId}
          conditions={familyConditions}
          category="DISEASE"
          type="FAMILY"
          familyMember="SIBLINGS"
          label="Hermanos"
          canEdit={canEdit}
          useSearchHook={useIcd10Search}
        />

        <ConditionsSection
          patientId={patientId}
          conditions={familyConditions}
          category="DISEASE"
          type="FAMILY"
          familyMember="CHILDREN"
          label="Hijos"
          canEdit={canEdit}
          useSearchHook={useIcd10Search}
        />

        <div className="md:col-span-2">
          <ConditionsSection
            patientId={patientId}
            conditions={familyConditions}
            category="DISEASE"
            type="FAMILY"
            familyMember="OTHER"
            label="Otros familiares"
            canEdit={canEdit}
            useSearchHook={useIcd10Search}
          />
        </div>
      </div>
    </HistorySection>
  );
}
