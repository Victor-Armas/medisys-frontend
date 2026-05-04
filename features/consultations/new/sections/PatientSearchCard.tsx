"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePatientSearch } from "../../hooks/useConsultation";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { PatientSearchResult } from "../../types/consultation.types";
import { calculateAge, GENDER_LABELS } from "../../utils/consultation.utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

interface Props {
  onSelect: (patient: PatientSearchResult) => void;
  onCreateNew: () => void;
  selectedPatientData: PatientSearchResult | null;
}

export function PatientSearchCard({ selectedPatientData, onSelect, onCreateNew }: Props) {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 350);
  const { data: results = [], isFetching } = usePatientSearch(debounced);

  useEffect(() => {
    if (selectedPatientData) {
      onSelect(selectedPatientData);
    }
  });

  return (
    <div className="bg-interior rounded-sm shadow-sm p-5 flex flex-col gap-4">
      <h2 className="text-sm font-bold text-encabezado">Seleccionar Paciente</h2>
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtitulo" />
          <Input label="Buscar por nombre, CURP o teléfono..." value={query} onChange={(e) => setQuery(e.target.value)} />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-principal/30 border-t-principal rounded-full animate-spin" />
          )}
        </div>
        <span className="text-subtitulo text-xs">o</span>
        <Button variant="primary" className="p-2 text-sm font-semibold" icon="userPlus" onClick={onCreateNew}>
          Nuevo Paciente
        </Button>
      </div>

      {debounced.length >= 2 && !isFetching && results.length > 0 && (
        <div className="bg-white border border-disable/20 rounded-lg shadow max-h-48 overflow-y-auto">
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="w-full text-left px-4 py-3 hover:bg-fondo-inputs border-b border-disable/10 last:border-0"
            >
              <p className="text-sm font-semibold text-encabezado">
                {p.firstName} {p.middleName} {p.lastNamePaternal} {p.lastNameMaternal}
              </p>
              <p className="text-xs text-subtitulo">
                {calculateAge(p.birthDate)} años · {GENDER_LABELS[p.gender]}
                {p.phone ? ` · ${p.phone}` : ""}
              </p>
            </button>
          ))}
        </div>
      )}

      {debounced.length >= 2 && !isFetching && results.length === 0 && (
        <p className="text-xs text-subtitulo text-center py-2">Sin resultados para {debounced}</p>
      )}
    </div>
  );
}
