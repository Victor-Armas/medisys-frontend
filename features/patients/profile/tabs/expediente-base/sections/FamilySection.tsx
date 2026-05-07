// features/patients/profile/tabs/expediente-base/sections/FamilySection.tsx
"use client";

import type { PatientCondition } from "../../../../types/patient.types";
import { useIcd10Search } from "@/features/patients/hooks/useCatalogSearch";
import { ConditionsSection } from "../../../antecedents/ConditionsSection";

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  canEdit: boolean;
}

const FAMILY_MEMBERS = [
  { member: "FATHER" as const, label: "Padre" },
  { member: "MOTHER" as const, label: "Madre" },
  { member: "SIBLINGS" as const, label: "Hermanos" },
  { member: "CHILDREN" as const, label: "Hijos" },
  { member: "OTHER" as const, label: "Otros" },
] as const;

export function FamilySection({ patientId, conditions, canEdit }: Props) {
  const familyConditions = conditions.filter((c) => c.type === "FAMILY");

  return (
    <div className="space-y-4">
      {FAMILY_MEMBERS.map(({ member, label }) => (
        <ConditionsSection
          key={member}
          patientId={patientId}
          conditions={familyConditions}
          category="DISEASE"
          type="FAMILY"
          familyMember={member}
          label={label}
          canEdit={canEdit}
          useSearchHook={useIcd10Search}
        />
      ))}
    </div>
  );
}
