"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { useConsultationsList } from "../hooks/useConsultation";
import { formatDate } from "@/shared/utils/date.utils";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { cn } from "@/shared/lib/utils";
import { ConsultationsListResponse, ListConsultationsQuery } from "../types/consultation.types";
import { STATUS_BADGE, TYPE_LABELS } from "../utils/consultation.utils";
import { StaffRole } from "@/features/users/types";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Input } from "@/shared/ui/input";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/Select";

interface Props {
  initialData: ConsultationsListResponse | undefined;
  role: StaffRole;
}

export function ConsultationsListPage({ initialData, role }: Props) {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    consultationType: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(filters.search, 300);

  const { canCreateConsultationDoctor } = usePermissions(role);
  const router = useRouter();

  const query: ListConsultationsQuery = {
    page,
    limit: 15,
    ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
    ...(filters.dateTo && { dateTo: filters.dateTo }),
    ...(filters.consultationType && { consultationType: filters.consultationType }),
    ...(debouncedSearch && { search: debouncedSearch }),
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      consultationType: "",
      search: "",
    });
    setPage(1);
  };

  const isInitialQuery = page === 1 && !filters.dateFrom && !filters.dateTo && !filters.consultationType && !debouncedSearch;

  const { data, isLoading } = useConsultationsList(query, isInitialQuery ? initialData : undefined);
  const consultations = data?.consultations ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / 15);

  const activeFilter = filters.dateFrom || filters.dateTo || filters.consultationType || filters.search;

  return (
    <div className="flex flex-col gap-4 px-6 pt-3 h-full overflow-hidden min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-encabezado">Historial de Consultas</h1>
          <p className="text-sm text-subtitulo mt-0.5">Registro clínico de todas las consultas</p>
        </div>
        {canCreateConsultationDoctor && (
          <button
            onClick={() => router.push("/admin/consultations/new")}
            className="flex items-center gap-2 bg-principal text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-principal-hover transition-colors"
          >
            <Plus size={16} />
            Nueva Consulta
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-12 gap-4 items-end">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-5">
          <Input
            type="text"
            icon={Search}
            label="Buscar paciente, doctor o diagnóstico..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </div>

        {/* Date from */}
        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <Input type="date" value={filters.dateFrom} onChange={(e) => updateFilter("dateFrom", e.target.value)} />
        </div>

        {/* Date to */}
        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-2">
          <Input type="date" value={filters.dateTo} onChange={(e) => updateFilter("dateTo", e.target.value)} />
        </div>

        {/* Type */}
        <div className={`${activeFilter ? "xl:col-span-2" : "xl:col-span-3"} sm:col-span-1 lg:col-span-1`}>
          <Select value={filters.consultationType} onChange={(e) => updateFilter("consultationType", e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(TYPE_LABELS).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
        </div>

        {/* Clear */}
        {activeFilter && (
          <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <Button variant="secundario" className="w-full p-2.5 dark:text-white" onClick={clearFilters}>
              Limpiar
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-interior rounded-xl border border-disable/20 shadow-sm flex flex-col flex-1 min-h-0">
        <div className="overflow-auto flex-1 min-h-0">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-card-header border-b border-disable/30">
              <tr className="border-b border-disable/30 bg-card-header">
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-subtitulo">
                  Fecha / Hora
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-subtitulo">Paciente</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-subtitulo">Médico</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-subtitulo">
                  Diagnóstico principal
                </th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-subtitulo">Tipo</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-subtitulo">Receta</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6}>
                    <ECGLoader />
                  </td>
                </tr>
              )}
              {!isLoading && consultations.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-sm text-subtitulo">
                    No hay consultas registradas
                  </td>
                </tr>
              )}
              {!isLoading &&
                consultations.map((c) => {
                  const mainDiag = c.diagnoses?.[0];
                  const doctor = c.doctorClinic.doctorProfile.user;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/admin/consultations/${c.id}`)}
                      className="border-b border-disable/10 last:border-0 hover:bg-fondo-inputs cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-encabezado">{formatDate(c.consultedAt)}</p>
                        <p className="text-xs text-subtitulo mt-0.5">
                          {new Date(c.consultedAt).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-principal">
                          {c.patient.firstName} {c.patient.lastNamePaternal}
                        </p>
                        <p className="text-xs text-subtitulo mt-0.5">Folio: {c.folioNumber}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-principal-gradient flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {doctor.firstName[0]}
                            {doctor.lastNamePaternal[0]}
                          </div>
                          <span className="text-sm text-encabezado">
                            Dr. {doctor.firstName} {doctor.lastNamePaternal}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {mainDiag ? (
                          <>
                            <p className="text-sm text-encabezado">{mainDiag.description}</p>
                            {mainDiag.icd10Code && (
                              <span className="text-[10px] font-mono bg-fondo-inputs text-subtitulo px-1.5 py-0.5 rounded mt-1 inline-block">
                                {mainDiag.icd10Code}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-subtitulo">Sin diagnóstico registrado</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                            STATUS_BADGE[c.consultationType] ?? "bg-disable text-subtitulo",
                          )}
                        >
                          {TYPE_LABELS[c.consultationType] ?? c.consultationType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {c.prescription ? (
                          <span
                            className={cn(
                              "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                              c.prescription.status === "ISSUED"
                                ? "bg-positive text-positive-text"
                                : c.prescription.status === "DRAFT"
                                  ? "bg-wairning/20 text-wairning-text"
                                  : "bg-negative/20 text-negative-text",
                            )}
                          >
                            {c.prescription.status === "ISSUED"
                              ? "Emitida"
                              : c.prescription.status === "DRAFT"
                                ? "Borrador"
                                : "Cancelada"}
                          </span>
                        ) : (
                          <span className="text-xs text-subtitulo">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 pb-3">
          <p className="text-xs text-subtitulo">
            Mostrando {(page - 1) * 15 + 1} a {Math.min(page * 15, total)} de {total} resultados
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 text-xs rounded-md border border-disable/20 disabled:opacity-40 hover:bg-fondo-inputs transition-colors"
            >
              ‹
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md transition-colors",
                  p === page ? "bg-principal text-white" : "border border-disable/20 hover:bg-fondo-inputs",
                )}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 text-xs rounded-md border border-disable/20 disabled:opacity-40 hover:bg-fondo-inputs transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
