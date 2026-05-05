// features/patients/profile/tabs/expediente-base/sections/FamilySection.tsx
"use client";

import type { PatientCondition } from "../../../../types/patient.types";
import { useIcd10Search } from "@/features/patients/hooks/useCatalogSearch";
import { ConditionsSection } from "../../../antecedents/ConditionsSection";

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  canEdit: boolean;
  headerRight?: React.ReactNode;
}

const FAMILY_MEMBERS = [
  { member: "FATHER" as const, label: "Padre" },
  { member: "MOTHER" as const, label: "Madre" },
  { member: "SIBLINGS" as const, label: "Hermanos" },
  { member: "CHILDREN" as const, label: "Hijos" },
  { member: "OTHER" as const, label: "Otros" },
] as const;

export function FamilySection({ patientId, conditions, canEdit, headerRight }: Props) {
  const familyConditions = conditions.filter((c) => c.type === "FAMILY");

  return (
    <div className="bg-interior rounded-2xl border-2 border-interior shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-disable/20">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm">🧬</span>
          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-encabezado truncate">
            Antecedentes Heredofamiliares
          </h4>
        </div>
        {headerRight}
      </div>
      <div className="px-4 py-4 space-y-4">
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
    </div>
  );
}
