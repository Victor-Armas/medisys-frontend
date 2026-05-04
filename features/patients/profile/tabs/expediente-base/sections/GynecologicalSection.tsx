import { NumberField } from "../fields/NumberField";
import { TextareaField } from "../fields/TextareaField";
import { CheckField } from "../fields/CheckField";
import { DateField } from "../fields/DateField";
import { ObstetricMetricField } from "../fields/ObstetricMetricField";
import { Sparkles, CalendarDays, Network, ShieldCheck } from "lucide-react";
import { HistorySection } from "@/features/patients/shared/HistorySection";

interface Props {
  canEdit: boolean;
}

export function GynecologicalSection({ canEdit }: Props) {
  return (
    <HistorySection title="Antecedentes gineco-obstétricos" icon="spark">
      {/* Container to give some breathing room for the groups */}
      <div className="flex flex-col gap-8 rounded-xl ">
        {/* ROW 1: Ciclo de desarrollo & Ciclo y FUM */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Grupo: Ciclo de Desarrollo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#8B2FA1]" size={16} strokeWidth={2.5} />
              <h4 className="text-[11px] font-bold text-[#8B2FA1] uppercase tracking-wider">Ciclo de Desarrollo</h4>
            </div>
            <div className="flex flex-col gap-4">
              <NumberField
                label="Menarca (Edad)"
                name="menarche"
                placeholder="Edad en la primera menstruación"
                disabled={!canEdit}
              />
              <NumberField
                label="1ra Relación Sexual"
                name="sexualActivityStart"
                placeholder="Edad de inicio de vida sexual"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Grupo: Ciclo y FUM */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-[#8B2FA1]" size={16} strokeWidth={2.5} />
              <h4 className="text-[11px] font-bold text-[#8B2FA1] uppercase tracking-wider">Ciclo menstrual</h4>
            </div>
            <div className="flex flex-col gap-4">
              <TextareaField
                label="Ciclo menstrual"
                name="menstrualCycle"
                disabled={!canEdit}
                rows={1}
                placeholder="Regular / 28 días"
              />
              <DateField label="Fecha última menstruación" name="lastMenstrualPeriod" disabled={!canEdit} />
            </div>
          </div>
        </div>

        {/* ROW 2: Fórmula Obstétrica & Prevención */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Grupo: Fórmula Obstétrica */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Network className="text-[#8B2FA1]" size={16} strokeWidth={2.5} />
              <h4 className="text-[11px] font-bold text-[#8B2FA1] uppercase tracking-wider">Antecedentes obstétricos</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ObstetricMetricField label="Gestas" name="gestations" disabled={!canEdit} />
              <ObstetricMetricField label="Partos" name="deliveries" disabled={!canEdit} />
              <ObstetricMetricField label="Cesáreas" name="caesareans" disabled={!canEdit} />
              <ObstetricMetricField label="Abortos" name="abortions" disabled={!canEdit} />
            </div>
          </div>

          {/* Grupo: Prevención */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[#8B2FA1]" size={16} strokeWidth={2.5} />
                <h4 className="text-[11px] font-bold text-[#8B2FA1] uppercase tracking-wider">Prevención</h4>
              </div>
              <div className="w-[50%]">
                <CheckField label="Menopausia" name="menopause" disabled={!canEdit} />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-2">
              <TextareaField
                label="Método anticonceptivo"
                name="contraceptiveMethod"
                placeholder="Preservativos..."
                disabled={!canEdit}
                rows={1}
              />
              <div className="grid grid-cols-2 gap-4">
                <TextareaField label="Mastografía" name="mammography" placeholder="Fecha/Res." disabled={!canEdit} rows={2} />
                <TextareaField label="Citología" name="cervicalCytology" placeholder="Fecha/Res." disabled={!canEdit} rows={2} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HistorySection>
  );
}
