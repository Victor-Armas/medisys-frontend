"use client";
import { Plus, Trash2, Pill } from "lucide-react";
import { useMedicationSuggestions } from "../../hooks/useConsultation";
import { cn } from "@/shared/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { ConsultationFormValues } from "../../schemas/consultation.schema";
import { MedicationSuggestion } from "../../types/consultation.types";
import { Button } from "@/shared/ui/button";

const ROUTE_OPTIONS = [
  "Oral",
  "Tópico",
  "IV",
  "IM",
  "SC",
  "Inhalada",
  "Sublingual",
  "Rectal",
  "Oftálmica",
  "Ótica",
  "Nasal",
  "Otra",
];

export function PrescriptionSection() {
  const { setValue, control } = useFormContext<ConsultationFormValues>();

  const diagnoses = useWatch({ control, name: "diagnoses" });
  const items = useWatch({ control, name: "prescriptionItems" });

  const icd10Codes = diagnoses.map((d) => d.icd10Code).filter(Boolean) as string[];
  const { data: suggestions = [] } = useMedicationSuggestions(icd10Codes);
  const addedSuggestionIds = new Set(items?.map((item) => item.catalogId).filter(Boolean));

  const addSuggestion = (s: MedicationSuggestion) => {
    if (addedSuggestionIds.has(s.medicationCatalog.id)) return;
    const label = [s.medicationCatalog.name, s.medicationCatalog.form, s.medicationCatalog.concentration]
      .filter(Boolean)
      .join(" ");
    const newItems = [
      ...items,
      {
        catalogId: s.medicationCatalog.id,
        medicationName: label,
        dose: s.defaultDose ?? "",
        frequency: s.defaultFrequency ?? "",
        duration: s.defaultDuration ?? "",
        route: s.defaultRoute ?? "Oral",
        quantity: s.defaultQuantity ?? undefined,
        sortOrder: items.length,
      },
    ];
    setValue("prescriptionItems", newItems, { shouldDirty: true });
  };

  const addBlank = () => {
    const newItem = {
      medicationName: "",
      dose: "",
      frequency: "",
      duration: "",
      route: "Oral",
      sortOrder: items.length,
    };

    setValue("prescriptionItems", [...items, newItem], { shouldDirty: true });
  };

  const remove = (idx: number) => {
    const newItems = items.filter((_, i) => i !== idx).map((item, i) => ({ ...item, sortOrder: i }));

    setValue("prescriptionItems", newItems, { shouldDirty: true });
  };

  const updateField = <K extends keyof (typeof items)[number]>(idx: number, key: K, value: (typeof items)[number][K]) =>
    setValue(
      "prescriptionItems",
      items.map((item, i) => (i === idx ? { ...item, [key]: value } : item)),
      { shouldDirty: true },
    );

  return (
    <section className="bg-interior rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pill size={16} className="text-principal" />
          <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Plan y Receta Médica</h2>
        </div>
        <Button variant="primary2" className="p-1 text-sm" onClick={addBlank}>
          <Plus size={14} /> Añadir medicamento
        </Button>
      </div>

      {/* Suggestions chips */}
      {suggestions.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-subtitulo">Sugerencias basadas en diagnóstico:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => {
              const added = addedSuggestionIds.has(s.medicationCatalog.id);
              const label = [s.medicationCatalog.name, s.medicationCatalog.concentration].filter(Boolean).join(" ");
              return (
                <Button
                  key={s.id}
                  onClick={() => addSuggestion(s)}
                  disabled={added}
                  className={cn(
                    "flex items-center gap-1.5 p-1 rounded-full text-xs font-semibold transition-all",
                    added && "bg-disable text-subtitulo border-disable cursor-not-allowed opacity-60",
                  )}
                >
                  {label}
                  {!added && <Plus size={10} />}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Medication rows */}
      {items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item, idx) => (
            <div key={idx} className="bg-fondo-inputs rounded-lg p-3 flex flex-col gap-3 relative">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-principal bg-inner-principal rounded-full w-5 h-5 flex items-center justify-center">
                  {idx + 1}
                </span>
                <input
                  value={item.medicationName}
                  onChange={(e) => updateField(idx, "medicationName", e.target.value)}
                  placeholder="Nombre del medicamento"
                  className="flex-1 bg-transparent text-sm font-semibold text-encabezado outline-none placeholder:text-subtitulo/50"
                />
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-subtitulo hover:text-negative-text transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["dose", "frequency", "duration"] as const).map((field) => (
                  <div key={field} className="flex flex-col gap-0.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-subtitulo">
                      {field === "dose" ? "Dosis" : field === "frequency" ? "Frecuencia" : "Duración"}
                    </label>
                    <input
                      value={item[field] ?? ""}
                      onChange={(e) => updateField(idx, field, e.target.value)}
                      placeholder={field === "dose" ? "500 mg" : field === "frequency" ? "cada 8 h" : "7 días"}
                      className="bg-interior rounded px-2 py-1.5 text-xs text-encabezado outline-none focus:ring-1 focus:ring-principal/30"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-0.5">
                  <label className="text-[9px] font-bold uppercase tracking-wider text-subtitulo">Vía</label>
                  <select
                    value={item.route ?? "Oral"}
                    onChange={(e) => updateField(idx, "route", e.target.value)}
                    className="bg-interior rounded px-2 py-1.5 text-xs text-encabezado outline-none focus:ring-1 focus:ring-principal/30"
                  >
                    {ROUTE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <label className="text-[9px] font-bold uppercase tracking-wider text-subtitulo">Indicaciones adicionales</label>
                <input
                  value={item.instructions ?? ""}
                  onChange={(e) => updateField(idx, "instructions", e.target.value)}
                  placeholder="Ej. Tomar con alimentos, evitar alcohol…"
                  className="bg-interior rounded px-2 py-1.5 text-xs text-encabezado outline-none focus:ring-1 focus:ring-principal/30"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && suggestions.length === 0 && (
        <p className="text-center text-sm text-subtitulo py-4">Agrega un diagnóstico para ver sugerencias de medicamentos</p>
      )}
    </section>
  );
}
