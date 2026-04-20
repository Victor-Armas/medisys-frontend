// features/patients/components/PatientsListClient.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Users, Activity, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { StaffRole } from "@/features/users/types";
import { KpiCard } from "./KpiCard";
import { PatientRow } from "./PatientRow";
import { PageButton } from "./PageButton";
import { PatientListItem } from "../types/patient.types";
import { usePatients } from "../hooks/usePatients";
import { PatientSkeletonRow } from "./PatientSkeletonRow";

const PAGE_SIZE = 25;

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  initialData: { patients: PatientListItem[]; total: number };
  clinicId?: string;
  serverRole: StaffRole;
}

export function PatientsListClient({ initialData, clinicId, serverRole }: Props) {
  const router = useRouter();
  const { canManageUsers } = usePermissions(serverRole);

  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  // Debounce para no hacer request en cada keystroke
  const search = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching } = usePatients({
    clinicId,
    search: search || undefined,
    page,
    limit: PAGE_SIZE,
  });

  const patients = data?.patients ?? initialData?.patients ?? [];
  const total = data?.total ?? initialData?.total ?? 0;
  const pages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    setPage(1); // reset paginación al buscar
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-encabezado">Pacientes</h2>
          <p className="text-sm text-subtitulo mt-1">
            {total > 0 ? `${total.toLocaleString("es-MX")} pacientes registrados` : "Directorio de pacientes"}
          </p>
        </div>
        {canManageUsers && (
          <button
            onClick={() => router.push("/admin/patients/new")}
            className="flex items-center gap-2 px-4 py-2.5 bg-principal text-white rounded-sm text-sm font-semibold hover:bg-principal-hover2 transition-colors shadow-sm shadow-brand/20"
          >
            <Plus size={16} strokeWidth={2.5} />
            Nuevo paciente
          </button>
        )}
      </div>

      {/* ── KPIs rápidos ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard icon={<Users size={22} />} label="Total pacientes" value={total} color="blue" />
        <KpiCard
          icon={<Activity size={22} />}
          label="Activos"
          value={patients.filter((p) => p.isActive).length}
          color="emerald"
        />
        <KpiCard
          icon={<AlertCircle size={22} />}
          label="Sin tipo sanguíneo"
          value={patients.filter((p) => !p.bloodType).length}
          color="amber"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-interior border border-black/5 shadow-sm rounded-sm p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtitulo pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Buscar por nombre, CURP, teléfono…"
            className="w-full pl-9 pr-4 py-2.5 rounded-md bg-fondo-inputs focus:border text-sm outline-none focus:border-principal focus:ring-1 focus:ring-principal/50 transition-all text-encabezado placeholder:text-subtitulo"
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-principal border-t-transparent animate-spin" />
          )}
        </div>
        {/* <button className="flex items-center gap-2 px-3 py-2.5 font-semibold bg-inner-principal hover:bg-principal-hover hover:text-inner-principal rounded-md text-principal text-sm transition-colors duration-300">
          <Filter size={14} />
          Filtros
        </button> */}
      </div>

      {/* ── Tabla ── */}
      <div className="bg-interior rounded-md overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-principal/30 text-encabezado border-b ">
                {["Paciente", "Edad / Género", "Contacto", "Tipo sanguíneo", "Consultorio", "Estado", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-[10.5px] font-bold text-text-muted uppercase tracking-[.07em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && !initialData
                ? Array.from({ length: 8 }).map((_, i) => <PatientSkeletonRow key={i} />)
                : patients.map((p, idx) => (
                    <PatientRow
                      key={p.id}
                      patient={p}
                      isLast={idx === patients.length - 1}
                      onClick={() => router.push(`/admin/patients/${p.id}`)}
                    />
                  ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t  bg-bg-base/40">
            <p className="text-xs text-text-muted">
              Página {page} de {pages} · {total.toLocaleString("es-MX")} pacientes
            </p>
            <div className="flex items-center gap-1">
              <PageButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={14} />
              </PageButton>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p < 1 || p > pages) return null;
                return (
                  <PageButton key={p} onClick={() => setPage(p)} active={p === page}>
                    {p}
                  </PageButton>
                );
              })}
              <PageButton onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
                <ChevronRight size={14} />
              </PageButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
