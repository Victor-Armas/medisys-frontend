"use client";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Search, Plus, Trash2, Star } from "lucide-react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useIcd10Search } from "../../hooks/useConsultation";
import type { Icd10SearchResult } from "../../types/consultation.types";
import type { DiagnosisFormValues } from "../../schemas/consultation.schema";
import { cn } from "@/shared/lib/utils";
import { ConsultationFormValues } from "../../schemas/consultation.schema";
import { Input } from "@/shared/ui/input";

const DIAGNOSIS_TYPE_LABELS: Record<string, string> = {
  DEFINITIVE: "Definitivo",
  PRESUMPTIVE: "Presuntivo",
  ASSOCIATED: "Asociado",
  COMPLICATION: "Complicación",
};

export function DiagnosisSection() {
  const { setValue, control } = useFormContext<ConsultationFormValues>();

  const diagnoses = useWatch({ control, name: "diagnoses" });
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const { data: results = [], isFetching } = useIcd10Search(debouncedQuery);

  const addFromCatalog = (item: Icd10SearchResult) => {
    const isFirst = diagnoses.length === 0;

    setValue(
      "diagnoses",
      [
        ...diagnoses,
        {
          icd10Code: item.code,
          description: item.description,
          diagnosisType: "DEFINITIVE",
          isMain: isFirst,
          sortOrder: diagnoses.length,
        },
      ],
      { shouldDirty: true },
    );

    setQuery("");
  };

  const addFreeText = () => {
    if (!query.trim()) return;

    const isFirst = diagnoses.length === 0;

    setValue(
      "diagnoses",
      [
        ...diagnoses,
        {
          description: query.trim(),
          diagnosisType: "DEFINITIVE",
          isMain: isFirst,
          sortOrder: diagnoses.length,
        },
      ],
      { shouldDirty: true },
    );

    setQuery("");
  };

  const setMain = (idx: number) =>
    setValue(
      "diagnoses",
      diagnoses.map((d, i) => ({ ...d, isMain: i === idx })),
      { shouldDirty: true },
    );

  const remove = (idx: number) =>
    setValue(
      "diagnoses",
      diagnoses
        .filter((_, i) => i !== idx)
        .map((d, i) => ({
          ...d,
          sortOrder: i,
          isMain: i === 0,
        })),
      { shouldDirty: true },
    );

  const updateType = (idx: number, type: string) =>
    setValue(
      "diagnoses",
      diagnoses.map((d, i) => (i === idx ? { ...d, diagnosisType: type as DiagnosisFormValues["diagnosisType"] } : d)),
      { shouldDirty: true },
    );

  return (
    <section className="bg-interior rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-principal" />
        <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Diagnósticos (CIE-10)</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Input value={query} label="Buscar por código o descripción CIE-10…" onChange={(e) => setQuery(e.target.value)} />
        {isFetching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-principal/30 border-t-principal rounded-full animate-spin" />
        )}
        {results.length > 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-20 bg-interior border border-disable/20 rounded-lg shadow-xl max-h-52 overflow-y-auto">
            {results.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => addFromCatalog(r)}
                className="w-full text-left px-3 py-2 hover:bg-fondo-inputs border-b border-disable/10 last:border-0 transition-colors"
              >
                <span className="text-[10px] font-bold text-principal mr-2">{r.code}</span>
                <span className="text-xs text-encabezado">{r.description}</span>
              </button>
            ))}
          </div>
        )}
        {debouncedQuery.length >= 2 && !isFetching && results.length === 0 && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-20 bg-interior border border-disable/20 rounded-lg shadow-xl">
            <button
              type="button"
              onClick={addFreeText}
              className="w-full text-left px-3 py-2.5 hover:bg-fondo-inputs text-sm text-encabezado flex items-center gap-2"
            >
              <Plus size={14} className="text-principal" />
              Agregar {query} como diagnóstico libre
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {diagnoses.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-disable/30">
                <th className="text-left py-2 px-2 text-subtitulo font-semibold uppercase tracking-wider w-16">Princ.</th>
                <th className="text-left py-2 px-2 text-subtitulo font-semibold uppercase tracking-wider w-24">Código</th>
                <th className="text-left py-2 px-2 text-subtitulo font-semibold uppercase tracking-wider">Descripción</th>
                <th className="text-left py-2 px-2 text-subtitulo font-semibold uppercase tracking-wider w-32">Tipo</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {diagnoses.map((d, idx) => (
                <tr key={idx} className={cn("border-b border-disable/10 last:border-0", d.isMain && "bg-principal/5")}>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() => setMain(idx)}
                      className={cn("p-1 rounded", d.isMain ? "text-principal" : "text-disable hover:text-subtitulo")}
                    >
                      <Star size={14} fill={d.isMain ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="py-2 px-2 font-mono text-principal">{d.icd10Code ?? "—"}</td>
                  <td className="py-2 px-2 text-encabezado">{d.description}</td>
                  <td className="py-2 px-2">
                    <select
                      value={d.diagnosisType}
                      onChange={(e) => updateType(idx, e.target.value)}
                      className="bg-fondo-inputs rounded px-1.5 py-1 text-xs text-encabezado outline-none"
                    >
                      {Object.entries(DIAGNOSIS_TYPE_LABELS).map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="text-subtitulo hover:text-negative-text transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
