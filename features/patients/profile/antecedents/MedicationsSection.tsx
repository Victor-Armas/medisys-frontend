import { useState } from "react";
import { Search, Loader2, X, AlertCircle, Plus, Pill, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PatientMedication } from "../../types/patient.types";
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
    clearSearch: clear,
    handleSelect,
    handleAddFreeText,
    handleRemove,
    handleUpdateDoseFreq,
  } = useMedicationsSection({ patientId });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Pill className="text-secundario" size={16} strokeWidth={2.5} />
        <p className="text-xs font-bold text-encabezado uppercase tracking-wide">Medicamentos actuales</p>
      </div>

      {/* SEARCH (Edit Mode Only, at top or bottom? The screenshot shows the table below. Let's put the search above or keep order) */}
      {/* Actually I'll keep the Medications Table above and Search below, or vice versa. The screenshot has Medications Table at the bottom of the section. Wait, the screenshot doesn't show the input. I will keep it logic wise as is but style it. */}

      {/* Edit mode search */}
      {canEdit && (
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2 px-4 py-2.5 border border-transparent rounded-sm bg-fondo-inputs focus-within:border-brand focus-within:ring-2 focus-within:ring-principal/15 transition-all">
            {isLoading ? (
              <Loader2 size={14} className="text-principal animate-spin shrink-0" />
            ) : (
              <Search size={14} className="text-subtitulo shrink-0" />
            )}
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar medicamento…"
              className="flex-1 text-xs bg-transparent outline-none text-encabezado placeholder:text-subtitulo"
            />
            {query && (
              <button onClick={clear} className="text-subtitulo hover:text-encabezado transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-dropdown rounded-sm shadow-lg max-h-56 overflow-y-auto">
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
                      className="w-full text-left px-3 py-3 hover:bg-inner-principal transition-colors text-xs text-encabezado last:border-0"
                    >
                      {item.name + " - " + item.description}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFreeTextMode(true);
                      setFreeText(query);
                      clear();
                    }}
                    className="w-full text-left px-3 py-2.5 bg-wairning hover:bg-wairning-hover text-wairning-text hover:text-wairning-text-hover transition-colors flex items-center gap-2"
                  >
                    <AlertCircle size={12} className=" shrink-0" />
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
            className="flex-1 px-4 py-2.5 text-xs rounded-full bg-fondo-inputs outline-none focus:ring-2 focus:ring-wairning-hover"
          />
          <button
            type="button"
            onClick={handleAddFreeText}
            className="flex items-center gap-1 px-4 py-2.5 rounded-full bg-positive text-positive-text hover:text-positive-text-hover text-xs font-semibold hover:bg-positive-hover transition-colors"
          >
            <Plus size={14} />
            Agregar
          </button>
          <button
            type="button"
            onClick={() => {
              setFreeTextMode(false);
              setFreeText("");
            }}
            className="px-3 py-2.5 rounded-full  bg-negative hover:bg-negative-hover text-negative-text transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Medication rows as a Table */}
      {medications.length > 0 && (
        <div className="w-full rounded-sm overflow-hidden shadow">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-dropdown px-4 py-2.5 text-[9px] font-bold text-encabezado uppercase">
            <div className="col-span-5 md:col-span-6">Fármaco</div>
            <div className="col-span-3">Dosis</div>
            <div className="col-span-4 md:col-span-3 text-right">Frec/Dur</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col bg-fondo-inputs">
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
        </div>
      )}

      {medications.length === 0 && !canEdit && <p className="text-xs text-subtitulo">Sin medicamentos registrados</p>}
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
    <div className={cn("grid grid-cols-12 items-center px-4 py-3 group ", !isLast && "")}>
      {/* Name */}
      <div className="col-span-5 md:col-span-6 flex items-center pr-2">
        <span className="text-[11px] font-bold text-subtitulo leading-snug">{medication.name}</span>
      </div>

      {canEdit ? (
        <>
          {/* Dose (Edit) */}
          <div className="col-span-3 pr-2">
            <input
              type="text"
              value={dose}
              onChange={(e) => {
                setDose(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Dosis"
              className="w-full px-2 py-1.5 text-[11px] rounded-sm bg-interior outline-none focus:border-brand transition-all"
            />
          </div>
          {/* Frequency (Edit) */}
          <div className="col-span-4 md:col-span-3 flex items-center gap-1">
            <input
              type="text"
              value={frequency}
              onChange={(e) => {
                setFrequency(e.target.value);
                setIsDirty(true);
              }}
              placeholder="Frec/Dur"
              className="w-full px-2 py-1.5 text-[11px] rounded-sm bg-interior outline-none focus:border-brand transition-all text-right"
            />
            {isDirty && (
              <button
                type="button"
                onClick={() => {
                  onSave(dose, frequency);
                  setIsDirty(false);
                }}
                className="text-[10px] font-bold p-1 text-positive-text hover:bg-positive-hover hover:text-positive-text-hover rounded-full hover:underline shrink-0 ml-1"
              >
                <Check size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onRemove}
              className="opacity-0 group-hover:opacity-100 p-1 text-subtitulo hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0 ml-1"
            >
              <X size={14} />
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Dose (View) */}
          <div className="col-span-3 text-[11px] text-subtitulo pr-2">{medication.dose || "-"}</div>
          {/* Frequency (View) */}
          <div className="col-span-4 md:col-span-3 text-[11px] text-subtitulo text-right">{medication.frequency || "-"}</div>
        </>
      )}
    </div>
  );
}
