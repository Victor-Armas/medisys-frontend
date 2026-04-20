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

  const filtered = conditions.filter((c) => c.category === category);
  const showDropdown = query.length >= 2 && (results.length > 0 || isLoading);

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
          isNonCoded: true,
        } as Parameters<typeof createCondition.mutateAsync>[0]["payload"],
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TitleIcon className="text-principal" size={18} strokeWidth={2.5} />
        <p className="text-xs font-bold text-encabezado uppercase tracking-wide">{label}</p>
      </div>

      {canEdit && (
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2 px-4 py-2.5 border border-transparent rounded-sm bg-fondo-inputs focus-within:border-brand focus-within:ring-2 focus-within:ring-principal transition-all">
            {isLoading ? (
              <Loader2 size={14} className="text-principal animate-spin shrink-0" />
            ) : (
              <Search size={14} className="text-subtitulo shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={category === "DISEASE" ? "Buscar por nombre o código CIE-10..." : `Agregar ${label.toLowerCase()}...`}
              className="flex-1 text-xs bg-transparent outline-none text-encabezado placeholder:text-subtitulo"
            />
            {query && (
              <button onClick={clear} className="text-negative-text font-extrabold hover:text-negative-hover transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-dropdown rounded-md shadow-lg overflow-hidden">
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
                      className="w-full text-left px-3 py-2.5 hover:bg-inner-principal transition-colors flex items-start gap-2 last:border-0"
                    >
                      <span className="text-[10px] font-mono text-subtitulo shrink-0 mt-0.5 w-10">{item.code}</span>
                      <span className="text-xs text-encabezado leading-snug">{item.description}</span>
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
                    <AlertCircle size={12} className="shrink-0" />
                    <span className="text-xs">Agregar &ldquo;{query}&rdquo; sin código</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

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
            className="flex-1 px-4 py-2.5 text-xs border border-amber-300 rounded-full bg-amber-50 outline-none focus:ring-2 focus:ring-amber-300"
          />
          <button
            type="button"
            onClick={handleAddFreeText}
            className="flex items-center gap-1 px-4 py-2.5 rounded-full bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
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
            className="px-3 py-2.5 rounded-full border text-subtitulo hover:bg-subtitulo transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="relative">
          <div className="flex flex-col gap-2.5 pt-1 overflow-y-auto max-h-[260px] pb-2 pr-1 scrollbar-thin">
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

          {filtered.length > 3 && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none bg-linear-to-t from-interior via-interior/80 to-transparent pt-6 pb-0.5">
              <svg
                width="20"
                height="20"
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
    </div>
  );
}
