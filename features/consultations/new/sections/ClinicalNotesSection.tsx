"use client";
import { FileText } from "lucide-react";
import type { ConsultationFormValues } from "../../schemas/consultation.schema";
import { CONSULTATION_TYPE_LABELS } from "../../constants/vital-signs.constants";
import { useFormContext, useWatch } from "react-hook-form";
import { Select } from "@/shared/ui/Select";
import { Input } from "@/shared/ui/input";

const TEXTAREA_BASE =
  "w-full bg-fondo-inputs rounded-md px-3 py-2.5 text-sm text-encabezado outline-none focus:ring-2 focus:ring-principal/30 resize-none placeholder:text-subtitulo/50";

export function ClinicalNotesSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>();
  const requiresFollowUp = useWatch({ name: "requiresFollowUp" });
  return (
    <section className="bg-interior rounded-xl  p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-2">
        <FileText size={16} className="text-principal" />
        <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Nota Clínica</h2>
      </div>

      {/* Tipo de consulta */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Tipo de consulta</label>
        <Select {...register("consultationType")}>
          {Object.entries(CONSULTATION_TYPE_LABELS).map(([val, lbl]) => (
            <option key={val} value={val}>
              {lbl}
            </option>
          ))}
        </Select>
      </div>

      {/* Two-column notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">
            Motivo de consulta / Padecimiento actual <span className="text-negative-text">*</span>
          </label>
          <textarea
            {...register("reasonForVisit")}
            rows={4}
            placeholder="Describa el motivo de la visita…"
            className={TEXTAREA_BASE}
          />
          {errors.reasonForVisit && <p className="text-[11px] text-negative-text">{errors.reasonForVisit.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Exploración física</label>
          <textarea
            {...register("physicalExamFindings")}
            rows={4}
            placeholder="Hallazgos de la exploración física…"
            className={TEXTAREA_BASE}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">
            Padecimiento actual <span className="text-negative-text">*</span>
          </label>
          <textarea {...register("currentCondition")} rows={3} placeholder="Evolución, síntomas…" className={TEXTAREA_BASE} />
          {errors.currentCondition && <p className="text-[11px] text-negative-text">{errors.currentCondition.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Estudios / Laboratorios</label>
          <textarea {...register("labResultsSummary")} rows={3} placeholder="Resumen de resultados…" className={TEXTAREA_BASE} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Plan de tratamiento</label>
          <textarea
            {...register("treatmentPlan")}
            rows={3}
            placeholder="Indicaciones no farmacológicas…"
            className={TEXTAREA_BASE}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Indicaciones al paciente</label>
          <textarea
            {...register("patientInstructions")}
            rows={3}
            placeholder="Instrucciones para el paciente…"
            className={TEXTAREA_BASE}
          />
        </div>
      </div>

      {/* Follow-up */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-3">
          <input type="checkbox" id="followUp" {...register("requiresFollowUp")} className="w-4 h-4 accent-principal" />
          <label htmlFor="followUp" className="text-sm text-encabezado font-medium">
            Requiere seguimiento
          </label>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 bg-fondo-inputs/30 rounded-lg p-4 ${
            requiresFollowUp ? "" : "hidden"
          }`}
        >
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">
              ¿En cuántos días? <span className="text-negative-text">*</span>
            </label>
            <Input
              type="number"
              label="Ej. 15"
              error={errors.followUpDays?.message}
              {...register("followUpDays", {
                setValueAs: (v: string) => (v === "" ? undefined : Number(v)),
              })}
              min={1}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Notas de seguimiento</label>
            <Input type="text" label="Ej. Traer estudios de laboratorio..." {...register("followUpNotes")} />
          </div>
        </div>
      </div>
    </section>
  );
}
