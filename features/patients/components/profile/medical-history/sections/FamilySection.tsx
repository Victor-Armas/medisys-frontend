"use client";
import { HistorySection } from "../fields/HistorySection";
import { TextareaField } from "../fields/TextareaField";

interface Props {
  canEdit: boolean;
}

export function FamilySection({ canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes heredofamiliares" icon="dna">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaField label="Padre" name="fatherHistory" disabled={!canEdit} />
        <TextareaField label="Madre" name="motherHistory" disabled={!canEdit} />
        <TextareaField label="Hijos" name="childrenHistory" disabled={!canEdit} />
        <TextareaField label="Hermanos" name="siblingsHistory" disabled={!canEdit} />
        <div className="md:col-span-2">
          <TextareaField label="Otros familiares" name="otherFamilyHistory" disabled={!canEdit} />
        </div>
      </div>
    </HistorySection>
  );
}
