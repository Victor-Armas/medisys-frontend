import { Cigarette } from "lucide-react";
import { HistorySection } from "../fields/HistorySection";
import { HabitField } from "../fields/HabitField";
import { CheckField } from "../fields/CheckField";
import { TextareaField } from "../fields/TextareaField";

interface Props {
  canEdit: boolean;
}

export function NonPathologicalSection({ canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes no patológicos" icon={<Cigarette size={15} />} color="#d97706">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <HabitField label="Tabaquismo" name="smoking" detailName="smokingDetail" disabled={!canEdit} />
        <HabitField label="Alcoholismo" name="alcoholUse" detailName="alcoholDetail" disabled={!canEdit} />
        <HabitField label="Toxicomanías" name="drugUse" detailName="drugDetail" disabled={!canEdit} />
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <CheckField label="Mascotas" name="pets" disabled={!canEdit} />
        <CheckField label="Tatuajes/piercings" name="tattoos" disabled={!canEdit} />
        <CheckField label="Exposición humo leña" name="woodSmokeExposure" disabled={!canEdit} />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaField label="Inmunizaciones" name="immunizations" disabled={!canEdit} />
        <TextareaField label="Actividad física" name="physicalActivity" disabled={!canEdit} />
      </div>
    </HistorySection>
  );
}
