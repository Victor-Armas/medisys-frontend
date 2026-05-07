// features/patients/profile/antecedents/AllergiesSection.tsx
"use client";

import { useMemo, useState } from "react";
import { X, CloudUpload, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/ui/toaster";
import { ALLERGY_SEVERITY_COLORS, ALLERGY_SEVERITY_LABELS, searchAllergies } from "@/shared/utils/allergies.utils";
import { useCreateAllergy, useRemoveAllergy } from "@/features/patients/hooks/useAllergies";
import type { AllergySeverity, PatientAllergy } from "../../types/patient.types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  allergies: PatientAllergy[];
  canEdit: boolean;
}

interface DraftAllergy {
  id: string;
  substance: string;
  severity: AllergySeverity;
}

const SEVERITIES: AllergySeverity[] = ["UNKNOWN", "MILD", "MODERATE", "SEVERE"];

const SEVERITY_LABEL_SHORT: Record<AllergySeverity, string> = {
  UNKNOWN: "?",
  MILD: "Leve",
  MODERATE: "Mod.",
  SEVERE: "Severa",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function AllergiesSection({ patientId, allergies, canEdit }: Props) {
  const createAllergy = useCreateAllergy();
  const removeAllergy = useRemoveAllergy();

  const [query, setQuery] = useState("");
  const [drafts, setDrafts] = useState<DraftAllergy[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const results = useMemo(() => {
    if (!query) return [];
    return searchAllergies(query).filter(
      (item) =>
        !allergies.some((a) => normalize(a.substance) === normalize(item.name)) &&
        !drafts.some((d) => normalize(d.substance) === normalize(item.name)),
    );
  }, [query, allergies, drafts]);

  function addDraft(substance: string) {
    setDrafts((prev) => [...prev, { id: crypto.randomUUID(), substance, severity: "UNKNOWN" }]);
    setQuery("");
  }

  function addCustomDraft() {
    const trimmed = query.trim();
    if (!trimmed) return;
    addDraft(trimmed);
  }

  function updateDraftSeverity(id: string, severity: AllergySeverity) {
    setDrafts((prev) => prev.map((d) => (d.id === id ? { ...d, severity } : d)));
  }

  function removeDraft(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  async function saveDrafts() {
    if (!drafts.length) return;
    setIsSaving(true);
    const loadId = notify.loading(`Guardando ${drafts.length > 1 ? "alergias" : "alergia"}…`);
    try {
      await Promise.all(
        drafts.map((d) =>
          createAllergy.mutateAsync({
            patientId,
            payload: { substance: d.substance, severity: d.severity },
          }),
        ),
      );
      notify.success("Alergias registradas", undefined, { id: loadId });
      setDrafts([]);
    } catch {
      notify.error("Error al guardar", undefined, { id: loadId });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRemove(allergyId: string) {
    try {
      await removeAllergy.mutateAsync({ patientId, allergyId });
    } catch {
      notify.error("Error al eliminar");
    }
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      {canEdit && (
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar o escribir alergia…"
            className="w-full px-3 py-2 text-xs border border-transparent rounded-sm bg-fondo-inputs outline-none focus:ring-1 focus:ring-principal/30 text-encabezado placeholder:text-subtitulo transition-all"
          />

          {/* Dropdown */}
          {query.length >= 1 && (
            <div className="absolute z-50 w-full mt-1 bg-dropdown border border-disable/20 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => addDraft(item.name)}
                  className="w-full text-left px-3 py-2 hover:bg-inner-principal transition-colors text-xs text-encabezado border-b border-disable/10 last:border-0"
                >
                  {item.name}
                </button>
              ))}
              <button
                type="button"
                onClick={addCustomDraft}
                className="w-full text-left px-3 py-2.5 bg-wairning/80 hover:bg-wairning text-wairning-text transition-colors flex items-center gap-1.5"
              >
                <Plus size={11} />
                <span className="text-xs">Agregar &ldquo;{query}&rdquo; manualmente</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drafts pending save */}
      {drafts.length > 0 && (
        <div className="rounded-md border border-dashed border-principal/30 bg-inner-principal/20 p-3 space-y-2">
          <p className="text-[10px] font-bold text-principal uppercase tracking-wide">Por guardar ({drafts.length})</p>
          {drafts.map((draft) => (
            <div key={draft.id} className="flex items-center gap-2 bg-interior rounded-md px-2.5 py-2">
              <span className="text-xs font-semibold text-encabezado flex-1 truncate">{draft.substance}</span>
              {/* Severity selector */}
              <div className="flex items-center gap-1">
                {SEVERITIES.map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => updateDraftSeverity(draft.id, sev)}
                    className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded border transition-all font-bold uppercase",
                      draft.severity === sev
                        ? "bg-principal text-white border-transparent"
                        : "bg-fondo-inputs text-subtitulo border-disable/30 hover:border-principal/40",
                    )}
                  >
                    {SEVERITY_LABEL_SHORT[sev]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeDraft(draft.id)}
                className="text-subtitulo hover:text-negative-text transition-colors p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={saveDrafts}
            disabled={isSaving}
            className="w-full py-1.5 flex items-center justify-center gap-1.5 text-[11px] font-bold bg-principal text-white rounded-md hover:bg-principal-hover transition-colors disabled:opacity-50"
          >
            <CloudUpload size={13} />
            Guardar alergias
          </button>
        </div>
      )}

      {/* Existing allergy chips */}
      {allergies.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {allergies.map((allergy) => {
            const colors = ALLERGY_SEVERITY_COLORS[allergy.severity];
            return (
              <div
                key={allergy.id}
                className={cn(
                  "group flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase transition-all",
                  colors.bg,
                  colors.text,
                )}
              >
                <AlertCircle size={10} className="shrink-0 opacity-80" strokeWidth={3} />
                <span className="leading-none">{allergy.substance}</span>
                <span className="opacity-60 text-[8px] ml-0.5">· {ALLERGY_SEVERITY_LABELS[allergy.severity]}</span>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleRemove(allergy.id)}
                    className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={9} strokeWidth={3} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        !canEdit && <p className="text-[11px] italic text-subtitulo">Sin alergias conocidas</p>
      )}
    </div>
  );
}
