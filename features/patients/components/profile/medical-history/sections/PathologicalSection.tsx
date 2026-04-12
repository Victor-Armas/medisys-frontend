import { Pill } from "lucide-react";
import { HistorySection } from "../fields/HistorySection";
import { TextareaField } from "../fields/TextareaField";
import { CheckField } from "../fields/CheckField";

interface Props {
  canEdit: boolean;
}

export function PathologicalSection({ canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes patológicos" icon={<Pill size={15} />} color="#e53e3e">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaField label="Enfermedades previas" name="diseases" disabled={!canEdit} />
        <TextareaField label="Cirugías" name="surgeries" disabled={!canEdit} />
        <TextareaField label="Hospitalizaciones" name="hospitalizations" disabled={!canEdit} />
        <TextareaField label="Traumatismos" name="traumaHistory" disabled={!canEdit} />
        <TextareaField label="Medicamentos actuales" name="currentMedications" disabled={!canEdit} rows={3} />
        <TextareaField label="Alergias conocidas" name="allergies" disabled={!canEdit} rows={3} />
      </div>
      <div className="mt-3">
        <CheckField label="Transfusiones sanguíneas" name="bloodTransfusions" disabled={!canEdit} />
      </div>
    </HistorySection>
  );
}
