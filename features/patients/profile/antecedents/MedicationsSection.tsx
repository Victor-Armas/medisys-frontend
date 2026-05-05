// features/patients/profile/antecedents/MedicationsSection.tsx
"use client";

import { useState } from "react";
import { Search, Loader2, X, AlertCircle, Plus, Pill, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { PatientMedication } from "../../types/patient.types";
import { useMedicationsSection } from "../../hooks/useMedicationsSection";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  medications: PatientMedication[];
  canEdit: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MedicationsSection({ patientId, medications, canEdit }: Props) {
  const {
    query,
    setQuery,
    results,
    isLoading,
    showDropdown,
    freeTextMode,
    setFreeTextMode,
    freeText,
    setFreeText,
    clearSearch,
    handleSelect,
    handleAddFreeText,
    handleRemove,
    handleUpdateDoseFreq,
  } = useMedicationsSection({ patientId });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Pill className="text-secundario" size={14} strokeWidth={2.5} />
        <p className="text-[11px] font-bold text-encabezado uppercase tracking-wide">Medicamentos actuales</p>
      </div>

      {/* Search */}
      {canEdit && (
        <div className="relative">
          <div className="flex items-center gap-2 px-3 py-2 border border-transparent rounded-sm bg-fondo-inputs focus-within:ring-1 focus-within:ring-principal/30 transition-all">
            {isLoading ? (
              <Loader2 size={13} className="text-principal animate-spin shrink-0" />
            ) : (
              <Search size={13} className="text-subtitulo shrink-0" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar medicamento…"
              className="flex-1 text-xs bg-transparent outline-none text-encabezado placeholder:text-subtitulo"
            />
            {query && (
              <button onClick={clearSearch} className="text-subtitulo hover:text-negative-text transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-dropdown rounded-md shadow-lg max-h-52 overflow-y-auto border border-disable/20">
              {isLoading && results.length === 0 ? (
                <div className="flex items-center gap-2 px-3 py-2.5 text-xs text-subtitulo">
                  <Loader2 size={12} className="animate-spin" />
                  Buscando…
                </div>
              ) : (
                <>
                  {results.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item)}
                      className="w-full text-left px-3 py-2.5 hover:bg-inner-principal transition-colors text-xs text-encabezado border-b border-disable/10 last:border-0"
                    >
                      {[item.name, item.form, item.concentration].filter(Boolean).join(" · ")}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFreeTextMode(true);
                      setFreeText(query);
                      clearSearch();
                    }}
                    className="w-full text-left px-3 py-2.5 bg-wairning hover:bg-wairning-hover text-wairning-text flex items-center gap-2"
                  >
                    <AlertCircle size={11} className="shrink-0" />
                    <span className="text-xs">Agregar &ldquo;{query}&rdquo; sin código</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Free text mode */}
      {freeTextMode && canEdit && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
          <input
            autoFocus
            type="text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFreeText();
              }
              if (e.key === "Escape") {
                setFreeTextMode(false);
                setFreeText("");
              }
            }}
            placeholder="Nombre del medicamento…"
            className="flex-1 px-3 py-2 text-xs rounded-sm bg-fondo-inputs outline-none focus:ring-1 focus:ring-wairning border border-wairning/30"
          />
          <button
            type="button"
            onClick={handleAddFreeText}
            className="px-3 py-2 rounded-sm bg-positive text-positive-text text-xs font-semibold hover:bg-positive-hover transition-colors"
          >
            <Plus size={13} />
          </button>
          <button
            type="button"
            onClick={() => {
              setFreeTextMode(false);
              setFreeText("");
            }}
            className="px-2.5 py-2 rounded-sm bg-fondo-inputs hover:bg-negative/10 text-subtitulo hover:text-negative-text transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Medications table */}
      {medications.length > 0 && (
        <div className="rounded-md overflow-hidden border border-disable/20">
          {/* Table head */}
          <div className="grid grid-cols-12 bg-fondo-inputs px-3 py-1.5 text-[9px] font-bold text-subtitulo uppercase tracking-wider">
            <div className="col-span-5">Fármaco</div>
            <div className="col-span-3">Dosis</div>
            <div className="col-span-4 text-right">Frecuencia</div>
          </div>

          {/* Rows */}
          {medications.map((med, index) => (
            <MedicationRow
              key={med.id}
              medication={med}
              canEdit={canEdit}
              isLast={index === medications.length - 1}
              onRemove={() => handleRemove(med.id)}
              onSave={(dose, freq) => handleUpdateDoseFreq(med.id, dose, freq)}
            />
          ))}
        </div>
      )}

      {medications.length === 0 && !canEdit && <p className="text-[11px] italic text-subtitulo">Sin medicamentos registrados</p>}
    </div>
  );
}

// ── Medication Row ────────────────────────────────────────────────────────────

interface MedRowProps {
  medication: PatientMedication;
  canEdit: boolean;
  isLast: boolean;
  onRemove: () => void;
  onSave: (dose: string, frequency: string) => void;
}

function MedicationRow({ medication, canEdit, isLast, onRemove, onSave }: MedRowProps) {
  const [dose, setDose] = useState(medication.dose ?? "");
  const [frequency, setFrequency] = useState(medication.frequency ?? "");
  const [isDirty, setIsDirty] = useState(false);

  return (
    <div
      className={cn(
        "grid grid-cols-12 items-center px-3 py-2 group bg-interior hover:bg-fondo-inputs/50 transition-colors",
        !isLast && "border-b border-disable/10",
      )}
    >
      {/* Name */}
      <div className="col-span-5 pr-2">
        <span className="text-[11px] text-encabezado leading-snug line-clamp-2">{medication.name}</span>
      </div>

      {canEdit ? (
        <>
          <div className="col-span-3 pr-1.5">
            <input
              type="text"
              value={dose}
              onChange={(e) => {
                setDose(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Dosis"
              className="w-full px-2 py-1 text-[11px] rounded-sm bg-fondo-inputs outline-none focus:ring-1 focus:ring-principal/30"
            />
          </div>
          <div className="col-span-4 flex items-center gap-1">
            <input
              type="text"
              value={frequency}
              onChange={(e) => {
                setFrequency(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Frecuencia"
              className="w-full px-2 py-1 text-[11px] rounded-sm bg-fondo-inputs outline-none focus:ring-1 focus:ring-principal/30 text-right"
            />
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  onSave(dose, frequency);
                  setIsDirty(false);
                }}
                className="p-1 text-positive-text hover:bg-positive-hover rounded-full transition-colors shrink-0"
              >
                <Check size={12} strokeWidth={3} />
              </button>
            )}
            <button
              type="button"
              onClick={onRemove}
              className="p-1 text-subtitulo hover:text-negative-text hover:bg-negative/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0"
            >
              <X size={12} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="col-span-3 text-[11px] text-subtitulo">{medication.dose || "—"}</div>
          <div className="col-span-4 text-[11px] text-subtitulo text-right">{medication.frequency || "—"}</div>
        </>
      )}
    </div>
  );
}
