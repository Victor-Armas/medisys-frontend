import { Baby } from "lucide-react";
import { HistorySection } from "../fields/HistorySection";
import { NumberField } from "../fields/NumberField";
import { TextareaField } from "../fields/TextareaField";
import { CheckField } from "../fields/CheckField";

interface Props {
  canEdit: boolean;
}

export function GynecologicalSection({ canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes gineco-obstétricos" icon={<Baby size={15} />} color="#ed64a6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NumberField label="Menarca (edad)" name="menarche" disabled={!canEdit} />
        <NumberField label="Primer rel. sexual" name="sexualActivityStart" disabled={!canEdit} />
        <NumberField label="Gestas" name="gestations" disabled={!canEdit} />
        <NumberField label="Partos" name="deliveries" disabled={!canEdit} />
        <NumberField label="Abortos" name="abortions" disabled={!canEdit} />
        <NumberField label="Cesáreas" name="caesareans" disabled={!canEdit} />
        <div className="col-span-2">
          <TextareaField label="Ciclo menstrual" name="menstrualCycle" disabled={!canEdit} rows={1} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextareaField label="Última menstruación" name="lastMenstrualPeriod" disabled={!canEdit} rows={1} />
        <TextareaField label="Método anticonceptivo" name="contraceptiveMethod" disabled={!canEdit} rows={1} />
        <TextareaField label="Mastografía (fecha/res)" name="mammography" disabled={!canEdit} rows={1} />
        <TextareaField label="Citología cervical" name="cervicalCytology" disabled={!canEdit} rows={1} />
      </div>
      <div className="mt-3">
        <CheckField label="Menopausia" name="menopause" disabled={!canEdit} />
      </div>
    </HistorySection>
  );
}
