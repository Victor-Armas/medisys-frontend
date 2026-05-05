// features/patients/profile/antecedents/ConditionsSection.tsx
"use client";

import { useRef, useState } from "react";
import { Search, Loader2, X, AlertCircle, Plus } from "lucide-react";
import { notify } from "@/shared/ui/toaster";
import { ConditionCategory, ConditionType, FamilyMember, Icd10SearchResult, PatientCondition } from "../../types/patient.types";
import { useCreateCondition, useRemoveCondition } from "../../hooks/useConditions";
import { ICONS_MAP } from "@/features/patients/constants/conditions.constants";
import { ConditionCard } from "./ConditionCard";

interface SearchHookResult {
  results: Icd10SearchResult[];
  isLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
  clear: () => void;
}

interface Props {
  patientId: string;
  conditions: PatientCondition[];
  category: ConditionCategory;
  type?: ConditionType;
  familyMember?: FamilyMember;
  label: string;
  canEdit: boolean;
  useSearchHook: (debounceMs?: number) => SearchHookResult;
}

export function ConditionsSection({
  patientId,
  conditions,
  category,
  type = "PATHOLOGICAL",
  familyMember,
  label,
  canEdit,
  useSearchHook,
}: Props) {
  const { results, isLoading, query, setQuery, clear } = useSearchHook();
  const createCondition = useCreateCondition();
  const removeCondition = useRemoveCondition();

  const [freeTextMode, setFreeTextMode] = useState(false);
  const [freeText, setFreeText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // FIX: Filter by familyMember when provided; otherwise filter by type.
  // This prevents family conditions from leaking into pathological sections
  // and ensures each family member only sees their own conditions.
  const filtered = conditions.filter((c) => {
    const categoryMatch = c.category === category;
    if (familyMember) {
      // Family mode: match by familyMember (conditions are already type=FAMILY)
      return categoryMatch && c.familyMember === familyMember;
    }
    // Pathological mode: exclude any family conditions
    return categoryMatch && c.type === (type ?? "PATHOLOGICAL");
  });

  // FIX: Show dropdown whenever query has 2+ chars, regardless of results count.
  // This ensures the "add without code" option is always reachable via search.
  const showDropdown = query.length >= 2 && !freeTextMode;

  const TitleIcon = ICONS_MAP[category];

  async function handleSelectIcd10(item: Icd10SearchResult) {
    clear();
    const loadId = notify.loading("Guardando…");
    try {
      await createCondition.mutateAsync({
        patientId,
        payload: {
          icd10Code: item.code,
          description: item.description,
          category,
          type,
          familyMember,
        },
      });
      notify.success("Agregado", item.description, { id: loadId });
    } catch {
      notify.error("Error al guardar", undefined, { id: loadId });
    }
  }

  async function handleAddFreeText() {
    const name = freeText.trim();
    if (!name) return;

    setFreeText("");
    setFreeTextMode(false);

    const loadId = notify.loading("Guardando…");
    try {
      await createCondition.mutateAsync({
        patientId,
        payload: {
          description: name,
          category,
          type,
          familyMember,
        },
      });
      notify.success("Agregado sin código", name, { id: loadId });
    } catch {
      notify.error("Error al guardar", undefined, { id: loadId });
    }
  }

  async function handleRemove(conditionId: string) {
    try {
      await removeCondition.mutateAsync({ patientId, conditionId });
    } catch {
      notify.error("Error al eliminar");
    }
  }

  function openFreeText(initialValue = "") {
    setFreeText(initialValue);
    setFreeTextMode(true);
    clear();
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TitleIcon className="text-principal" size={14} strokeWidth={2.5} />
          <p className="text-[11px] font-bold text-encabezado uppercase tracking-wide">{label}</p>
        </div>
        {/* FIX: Always-visible "add without code" button in edit mode */}
        {canEdit && !freeTextMode && (
          <button
            type="button"
            onClick={() => openFreeText()}
            className="flex items-center gap-1 text-[10px] font-semibold text-subtitulo hover:text-wairning-text transition-colors"
          >
            <Plus size={10} />
            Sin código
          </button>
        )}
      </div>

      {/* Search input */}
      {canEdit && (
        <div className="space-y-1 relative">
          <div className="flex items-center gap-2 px-3 py-2 border border-transparent rounded-sm bg-fondo-inputs focus-within:border-brand focus-within:ring-1 focus-within:ring-principal/30 transition-all">
            {isLoading ? (
              <Loader2 size={13} className="text-principal animate-spin shrink-0" />
            ) : (
              <Search size={13} className="text-subtitulo shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={category === "DISEASE" ? "Buscar CIE-10 o nombre…" : `Buscar ${label.toLowerCase()}…`}
              className="flex-1 text-xs bg-transparent outline-none text-encabezado placeholder:text-subtitulo"
            />
            {query && (
              <button onClick={clear} className="text-subtitulo hover:text-negative-text transition-colors">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Dropdown: shows results AND always shows "add without code" when query >= 2 */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-dropdown rounded-md shadow-lg overflow-hidden border border-disable/20">
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
                      onClick={() => handleSelectIcd10(item)}
                      className="w-full text-left px-3 py-2 hover:bg-inner-principal transition-colors flex items-start gap-2 border-b border-disable/10 last:border-0"
                    >
                      <span className="text-[10px] font-mono text-principal shrink-0 mt-0.5 w-10">{item.code}</span>
                      <span className="text-xs text-encabezado leading-snug">{item.description}</span>
                    </button>
                  ))}

                  {/* FIX: Always show "add without code" option when query >= 2 */}
                  <button
                    type="button"
                    onClick={() => openFreeText(query)}
                    className="w-full text-left px-3 py-2.5 bg-wairning hover:bg-wairning-hover text-wairning-text hover:text-wairning-text-hover transition-colors flex items-center gap-2"
                  >
                    <AlertCircle size={12} className="shrink-0" />
                    <span className="text-xs">
                      {results.length === 0 ? `Sin resultados — agregar "${query}" sin código` : `Agregar "${query}" sin código`}
                    </span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Free text input (shown after clicking "sin código") */}
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
            placeholder="Descripción libre…"
            className="flex-1 px-3 py-2 text-xs border border-wairning/40 rounded-sm bg-wairning/5 outline-none focus:ring-1 focus:ring-wairning"
          />
          <button
            type="button"
            onClick={handleAddFreeText}
            disabled={!freeText.trim()}
            className="flex items-center gap-1 px-3 py-2 rounded-sm bg-positive text-positive-text hover:bg-positive-hover text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Plus size={12} />
            Agregar
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

      {/* Conditions list */}
      {filtered.length > 0 && (
        <div className="relative">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[260px] pr-0.5 scrollbar-thin">
            {filtered.map((c) => (
              <ConditionCard
                key={c.id}
                condition={c}
                canEdit={canEdit}
                patientId={patientId}
                category={category}
                onRemove={() => handleRemove(c.id)}
              />
            ))}
          </div>

          {/* Scroll hint */}
          {filtered.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none bg-linear-to-t from-interior via-interior/80 to-transparent pt-6 pb-0.5">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-principal animate-pulse relative z-10"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Empty state (view mode) */}
      {filtered.length === 0 && !canEdit && <p className="text-[11px] text-subtitulo italic">Sin registros</p>}
    </div>
  );
}
