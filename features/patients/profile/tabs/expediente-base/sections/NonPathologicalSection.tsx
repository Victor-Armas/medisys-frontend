"use client";
import { HabitField } from "../fields/HabitField";
import { CheckField } from "../fields/CheckField";
import { TextareaField } from "../fields/TextareaField";
import { ActivitySelectField } from "../fields/ActivitySelectField";
import { HistorySection } from "@/features/patients/shared/HistorySection";

interface Props {
  canEdit: boolean;
}

export function NonPathologicalSection({ canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes no patológicos" icon="cross">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <HabitField label="Tabaquismo" name="smoking" detailName="smokingDetail" disabled={!canEdit} icon="cigarette" />
        <HabitField label="Alcoholismo" name="alcoholUse" detailName="alcoholDetail" disabled={!canEdit} icon="alcohol" />
        <HabitField label="Toxicomanías" name="drugUse" detailName="drugDetail" disabled={!canEdit} icon="activity" />
      </div>
      <div className="grid grid-cols-6 gap-4 mt-6 items-start">
        {/* Izquierdo */}
        <div className="col-span-2 flex flex-col gap-2">
          <CheckField label="Mascotas" name="pets" disabled={!canEdit} icon="mascota" />
          <CheckField label="Tatuajes/piercings" name="tattoos" disabled={!canEdit} icon="tatuaje" />
          <CheckField label="Exposición humo leña" name="woodSmokeExposure" disabled={!canEdit} icon="humo" />
        </div>
        {/* En medio */}
        <div className="col-span-2">
          <TextareaField label="Inmunizaciones" name="immunizations" disabled={!canEdit} />
        </div>
        {/* Derecho */}
        <div className="col-span-2">
          <ActivitySelectField label="Actividad física" name="physicalActivity" disabled={!canEdit} />
        </div>
      </div>
    </HistorySection>
  );
}
