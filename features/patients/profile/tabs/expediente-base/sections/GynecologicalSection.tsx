// features/patients/profile/tabs/expediente-base/sections/GynecologicalSection.tsx
"use client";

import { NumberField } from "../fields/NumberField";
import { TextareaField } from "../fields/TextareaField";
import { CheckField } from "../fields/CheckField";
import { DateField } from "../fields/DateField";
import { ObstetricMetricField } from "../fields/ObstetricMetricField";
import { HistorySection } from "@/features/patients/shared/HistorySection";

interface Props {
  canEdit: boolean;
  headerRight?: React.ReactNode;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-subtitulo uppercase tracking-widest mb-3">{children}</p>;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Antecedentes gineco-obstétricos.
 *
 * Layout: 2 columnas.
 * Izquierda: ciclo de desarrollo + ciclo menstrual + fórmula obstétrica
 * Derecha: prevención (anticoncepción, menopause, mastografía, citología)
 */
export function GynecologicalSection({ canEdit, headerRight }: Props) {
  return (
    <HistorySection title="Antecedentes gineco-obstétricos" icon="spark" headerAction={headerRight}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
        {/* ── LEFT ───────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Ciclo de desarrollo */}
          <div>
            <SectionLabel>Ciclo de desarrollo</SectionLabel>
            <div className="space-y-3">
              <NumberField label="Menarca (edad)" name="menarche" placeholder="Edad primera menstruación" disabled={!canEdit} />
              <NumberField
                label="Inicio vida sexual (edad)"
                name="sexualActivityStart"
                placeholder="Edad de inicio"
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Ciclo menstrual */}
          <div>
            <SectionLabel>Ciclo menstrual</SectionLabel>
            <div className="space-y-3">
              <TextareaField
                label="Descripción del ciclo"
                name="menstrualCycle"
                disabled={!canEdit}
                rows={2}
                placeholder="Ej. Regular, 28 días…"
              />
              <DateField label="Fecha última menstruación" name="lastMenstrualPeriod" disabled={!canEdit} />
            </div>
          </div>

          {/* Fórmula obstétrica */}
          <div>
            <SectionLabel>Fórmula obstétrica (G P C A)</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ObstetricMetricField label="Gestas" name="gestations" disabled={!canEdit} />
              <ObstetricMetricField label="Partos" name="deliveries" disabled={!canEdit} />
              <ObstetricMetricField label="Cesáreas" name="caesareans" disabled={!canEdit} />
              <ObstetricMetricField label="Abortos" name="abortions" disabled={!canEdit} />
            </div>
          </div>
        </div>

        {/* ── RIGHT ──────────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Prevención */}
          <div>
            <SectionLabel>Prevención y planificación</SectionLabel>
            <div className="space-y-3">
              <CheckField label="Menopausia" name="menopause" disabled={!canEdit} />
              <TextareaField
                label="Método anticonceptivo"
                name="contraceptiveMethod"
                disabled={!canEdit}
                rows={2}
                placeholder="Ej. DIU, hormonal, preservativo…"
              />
            </div>
          </div>

          {/* Estudios preventivos */}
          <div>
            <SectionLabel>Estudios preventivos</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextareaField
                label="Mastografía"
                name="mammography"
                disabled={!canEdit}
                rows={3}
                placeholder="Fecha / resultado…"
              />
              <TextareaField
                label="Citología cervical (Pap)"
                name="cervicalCytology"
                disabled={!canEdit}
                rows={3}
                placeholder="Fecha / resultado…"
              />
            </div>
          </div>
        </div>
      </div>
    </HistorySection>
  );
}
