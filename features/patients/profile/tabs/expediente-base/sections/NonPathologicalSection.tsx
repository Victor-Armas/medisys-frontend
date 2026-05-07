// features/patients/profile/tabs/expediente-base/sections/NonPathologicalSection.tsx
"use client";

import { HabitField } from "../fields/HabitField";
import { CheckField } from "../fields/CheckField";
import { TextareaField } from "../fields/TextareaField";
import { ActivitySelectField } from "../fields/ActivitySelectField";

interface Props {
  canEdit: boolean;
}

export function NonPathologicalSection({ canEdit }: Props) {
  return (
    <div className="space-y-4">
      <HabitField label="Tabaquismo" name="smoking" detailName="smokingDetail" disabled={!canEdit} icon="cigarette" />
      <HabitField label="Alcoholismo" name="alcoholUse" detailName="alcoholDetail" disabled={!canEdit} icon="alcohol" />
      <HabitField label="Toxicomanías" name="drugUse" detailName="drugDetail" disabled={!canEdit} icon="activity" />

      <hr className="border-disable/30" />

      <CheckField label="Mascotas" name="pets" disabled={!canEdit} icon="mascota" />
      <CheckField label="Tatuajes / piercings" name="tattoos" disabled={!canEdit} icon="tatuaje" />
      <CheckField label="Exposición humo leña" name="woodSmokeExposure" disabled={!canEdit} icon="humo" />

      <hr className="border-disable/30" />

      <TextareaField label="Inmunizaciones" name="immunizations" disabled={!canEdit} rows={3} placeholder="Vacunas aplicadas…" />
      <ActivitySelectField label="Actividad física" name="physicalActivity" disabled={!canEdit} />
    </div>
  );
}
