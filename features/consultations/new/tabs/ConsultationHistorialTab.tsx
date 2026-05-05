"use client";
import { useConditions } from "@/features/patients/hooks/useConditions";
import { useMedications } from "@/features/patients/hooks/useMedications";
import { useAllergies } from "@/features/patients/hooks/useAllergies";
import { useMedicalHistory } from "@/features/patients/hooks/useMedicalHistory";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { AlertCircle, Pill, Bug, Scissors, Activity, ArrowRight, Users2, HeartHandshake } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ALLERGY_SEVERITY_COLORS, ALLERGY_SEVERITY_LABELS } from "@/shared/utils/allergies.utils";
import { HABIT_LABELS } from "@/features/patients/constants/patient.constants";
import type { PatientCondition } from "@/features/patients/types/patient.types";

interface Props {
  patientId: string;
}

export function ConsultationHistorialTab({ patientId }: Props) {
  const { data: conditions = [], isLoading: l1 } = useConditions(patientId);
  const { data: medications = [], isLoading: l2 } = useMedications(patientId);
  const { data: allergies = [], isLoading: l3 } = useAllergies(patientId);
  const { data: history, isLoading: l4 } = useMedicalHistory(patientId, { enabled: true });

  if (l1 || l2 || l3 || l4)
    return (
      <div className="flex justify-center py-10">
        <ECGLoader />
      </div>
    );

  const pathological = (cat: string) => conditions.filter((c) => c.category === cat && c.type === "PATHOLOGICAL");
  const family = conditions.filter((c) => c.type === "FAMILY");

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Alergias banner */}
      {allergies.length > 0 && (
        <div className="bg-negative/10 border border-negative/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-negative-text" strokeWidth={2.5} />
            <h3 className="text-xs font-bold text-negative-text uppercase tracking-wider">⚠ Alergias conocidas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allergies.map((a) => {
              const c = ALLERGY_SEVERITY_COLORS[a.severity];
              return (
                <span key={a.id} className={cn("px-2.5 py-1 rounded-full text-[11px] font-bold", c.bg, c.text)}>
                  {a.substance} · {ALLERGY_SEVERITY_LABELS[a.severity]}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ConditionCard icon={Bug} title="Enfermedades previas" items={pathological("DISEASE")} color="text-secundario" />

        {/* Medicamentos */}
        <div className="bg-interior rounded-xl p-4 border border-disable/20">
          <div className="flex items-center gap-2 mb-3">
            <Pill size={14} className="text-principal" />
            <h3 className="text-xs font-bold text-encabezado uppercase tracking-wider">Medicamentos actuales</h3>
          </div>
          {medications.length === 0 ? (
            <p className="text-xs text-subtitulo italic">Sin medicamentos registrados</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {medications.map((m) => (
                <div key={m.id} className="flex items-center justify-between bg-fondo-inputs rounded-lg px-3 py-1.5 text-xs">
                  <span className="font-medium text-encabezado truncate">{m.name}</span>
                  <span className="text-subtitulo shrink-0 ml-2">{[m.dose, m.frequency].filter(Boolean).join(" · ") || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <ConditionCard icon={Scissors} title="Cirugías" items={pathological("SURGERY")} color="text-[#a12f6b]" />
        <ConditionCard icon={Activity} title="Traumatismos" items={pathological("TRAUMA")} color="text-principal" />
        <ConditionCard
          icon={ArrowRight}
          title="Hospitalizaciones"
          items={pathological("HOSPITALIZATION")}
          color="text-[#993399]"
        />
        <ConditionCard icon={Users2} title="Antecedentes heredofamiliares" items={family} color="text-secundario" />
      </div>

      {/* Hábitos */}
      {history && (
        <div className="bg-interior rounded-xl p-4 border border-disable/20">
          <div className="flex items-center gap-2 mb-3">
            <HeartHandshake size={14} className="text-principal" />
            <h3 className="text-xs font-bold text-encabezado uppercase tracking-wider">Antecedentes no patológicos</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Tabaquismo", value: HABIT_LABELS[history.smoking] },
              { label: "Alcoholismo", value: HABIT_LABELS[history.alcoholUse] },
              { label: "Toxicomanías", value: HABIT_LABELS[history.drugUse] },
              { label: "Transfusiones", value: history.bloodTransfusions ? "Sí" : "No" },
              { label: "Mascotas", value: history.pets ? "Sí" : "No" },
              { label: "Tatuajes", value: history.tattoos ? "Sí" : "No" },
              { label: "Humo de leña", value: history.woodSmokeExposure ? "Sí" : "No" },
              { label: "Act. física", value: history.physicalActivity || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-fondo-inputs rounded-lg p-2.5">
                <p className="text-[9px] font-bold text-subtitulo uppercase tracking-wider">{label}</p>
                <p className="text-xs font-semibold text-encabezado mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          {history.immunizations && (
            <div className="mt-3 bg-fondo-inputs rounded-lg px-3 py-2">
              <p className="text-[9px] font-bold text-subtitulo uppercase tracking-wider mb-0.5">Inmunizaciones</p>
              <p className="text-xs text-encabezado">{history.immunizations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConditionCard({
  icon: Icon,
  title,
  items,
  color,
}: {
  icon: React.ElementType;
  title: string;
  items: PatientCondition[];
  color: string;
}) {
  return (
    <div className="bg-interior rounded-xl p-4 border border-disable/20">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={14} className={color} />
        <h3 className="text-xs font-bold text-encabezado uppercase tracking-wider">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-subtitulo italic">Sin registros</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-2 bg-fondo-inputs rounded-lg px-2.5 py-1.5 text-xs">
              {item.icd10Code && <span className="font-mono text-[10px] text-principal shrink-0 mt-0.5">{item.icd10Code}</span>}
              <span className="text-encabezado leading-snug">{item.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
