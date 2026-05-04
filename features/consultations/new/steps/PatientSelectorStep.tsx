"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { usePatientSearch } from "../../hooks/useConsultation";
import { inlinePatientSchema, type InlinePatientValues } from "../../schemas/consultation.schema";
import type { PatientSearchResult } from "../../types/consultation.types";
import { calculateAge } from "../../utils/consultation.utils";

interface Props {
  onSelectExisting: (patient: PatientSearchResult) => void;
  onCreateNew: (data: InlinePatientValues) => void;
}

export function PatientSelectorStep({ onSelectExisting, onCreateNew }: Props) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"search" | "create">("search");
  const debouncedQuery = useDebounce(query, 350);
  const { data: results = [], isFetching } = usePatientSearch(debouncedQuery);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InlinePatientValues>({
    resolver: zodResolver(inlinePatientSchema),
  });

  if (mode === "create") {
    return (
      <div className="max-w-lg mx-auto bg-interior rounded-xl p-6 shadow-sm border border-disable/20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-encabezado">Nuevo paciente</h2>
          <button onClick={() => setMode("search")} className="text-subtitulo hover:text-encabezado">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onCreateNew)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nombre*" {...register("firstName")} error={errors.firstName?.message} />
            <Input label="Segundo nombre" {...register("middleName")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ap. paterno*" {...register("lastNamePaternal")} error={errors.lastNamePaternal?.message} />
            <Input label="Ap. materno" {...register("lastNameMaternal")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Fecha de nacimiento*" type="date" {...register("birthDate")} error={errors.birthDate?.message} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">Género*</label>
              <select
                {...register("gender")}
                className="w-full rounded-md bg-fondo-inputs text-encabezado text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-principal/40"
              >
                <option value="">Seleccionar</option>
                <option value="FEMALE">Femenino</option>
                <option value="MALE">Masculino</option>
                <option value="OTHER">Otro</option>
              </select>
              {errors.gender && <p className="text-[11px] text-negative-text">{errors.gender.message}</p>}
            </div>
          </div>
          <Input label="Teléfono" type="tel" {...register("phone")} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="cancelar" className="flex-1 py-2" onClick={() => setMode("search")}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary2" className="flex-1 py-2" icon="userPlus">
              Registrar paciente
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-encabezado">Nueva consulta</h1>
        <p className="text-sm text-subtitulo mt-1">Busca al paciente o regístralo si es primera vez</p>
      </div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtitulo z-10" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre, CURP o teléfono…"
          className="w-full pl-9 pr-4 py-3 rounded-lg bg-interior border border-disable/20 text-encabezado text-sm outline-none focus:ring-2 focus:ring-principal/30"
        />
        {isFetching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-principal/30 border-t-principal rounded-full animate-spin" />
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-2 bg-interior border border-disable/20 rounded-lg shadow-lg overflow-hidden">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectExisting(p)}
              className="w-full text-left px-4 py-3 hover:bg-fondo-inputs border-b border-disable/10 last:border-0 transition-colors"
            >
              <p className="text-sm font-semibold text-encabezado">
                {p.firstName} {p.middleName} {p.lastNamePaternal} {p.lastNameMaternal}
              </p>
              <p className="text-xs text-subtitulo mt-0.5">
                {calculateAge(p.birthDate)} años ·{" "}
                {p.gender === "FEMALE" ? "Femenino" : p.gender === "MALE" ? "Masculino" : "Otro"}
                {p.phone ? ` · ${p.phone}` : ""}
              </p>
            </button>
          ))}
        </div>
      )}

      {debouncedQuery.length >= 2 && !isFetching && results.length === 0 && (
        <p className="text-center text-sm text-subtitulo mt-4">Sin resultados para {debouncedQuery}</p>
      )}

      <div className="mt-6 text-center">
        <Button variant="primary" icon="userPlus" className="px-6 py-2.5" onClick={() => setMode("create")}>
          Registrar nuevo paciente
        </Button>
      </div>
    </div>
  );
}
