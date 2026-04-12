// features/patients/components/PatientsListClient.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Users, Activity, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { usePatients } from "../hooks/usePatients";
import type { PatientListItem, BloodType } from "../types/patient.types";
import { BLOOD_TYPE_LABELS, GENDER_LABELS, getPatientAge, getPatientInitials, getPatientFullName } from "../types/patient.types";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { cn } from "@/shared/lib/utils";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { StaffRole } from "@/features/users/types";

const PAGE_SIZE = 25;

// ── Blood type badge ──────────────────────────────────────────────────────────

const BT_BADGE: Record<BloodType, string> = {
  O_POSITIVE: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  O_NEGATIVE: "bg-red-600/10 text-red-700 border-red-600/20 dark:text-red-500",
  A_POSITIVE: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  A_NEGATIVE: "bg-blue-600/10 text-blue-700 border-blue-600/20 dark:text-blue-500",
  B_POSITIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  B_NEGATIVE: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20 dark:text-emerald-500",
  AB_POSITIVE: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  AB_NEGATIVE: "bg-purple-600/10 text-purple-700 border-purple-600/20 dark:text-purple-500",
  UNKNOWN: "bg-bg-subtle text-text-secondary border-border-default",
};

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
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* ── Encabezado ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Pacientes</h2>
          <p className="text-sm text-text-secondary mt-1">
            {total > 0 ? `${total.toLocaleString("es-MX")} pacientes registrados` : "Directorio de pacientes"}
          </p>
        </div>
        {canManageUsers && (
          <button
            onClick={() => router.push("/admin/patients/new")}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors shadow-sm shadow-brand/20"
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
      <div className="bg-bg-surface border border-border-default rounded-2xl p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={handleSearch}
            placeholder="Buscar por nombre, CURP, teléfono…"
            className="w-full pl-9 pr-4 py-2.5 bg-bg-base border border-border-default rounded-xl text-sm outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all text-text-primary placeholder:text-text-disabled"
          />
          {isFetching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-brand border-t-transparent animate-spin" />
          )}
        </div>
        <button className="flex items-center gap-2 px-3 py-2.5 border border-border-default rounded-xl text-sm text-text-secondary hover:text-brand hover:border-brand/30 transition-colors">
          <Filter size={14} />
          Filtros
        </button>
      </div>

      {/* ── Tabla ── */}
      <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
            <thead>
              <tr className="bg-bg-base/60 border-b border-border-default">
                {["Paciente", "Edad / Género", "Contacto", "Tipo sanguíneo", "Consultorio", "Estado", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3.5 text-[10.5px] font-bold text-text-muted uppercase tracking-[.07em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && !initialData
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
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
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border-default bg-bg-base/40">
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

// ── Sub-components ────────────────────────────────────────────────────────────

function PatientRow({ patient, isLast, onClick }: { patient: PatientListItem; isLast: boolean; onClick: () => void }) {
  const initials = getPatientInitials(patient);
  const fullName = getPatientFullName(patient);
  const age = getPatientAge(patient.birthDate);
  const clinic = patient.clinics[0]?.clinic;

  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-colors duration-100 hover:bg-bg-subtle/50",
        !isLast && "border-b border-border-default",
      )}
    >
      {/* Paciente */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full bg-linear-to-br shrink-0 flex items-center justify-center text-white text-xs font-bold",
              "from-brand-gradient-from to-brand-gradient-to",
              !patient.isActive && "opacity-40",
            )}
          >
            {initials}
          </div>
          <div className={cn(!patient.isActive && "opacity-60")}>
            <p className="text-[13.5px] font-semibold text-text-primary leading-tight group-hover:text-brand transition-colors">
              {fullName}
            </p>
            {patient.curp && <p className="text-[10px] text-text-disabled font-mono mt-0.5">{patient.curp}</p>}
          </div>
        </div>
      </td>

      {/* Edad / Género */}
      <td className="px-5 py-3.5">
        <span className="text-sm text-text-primary">{age} años</span>
        <span className="text-xs text-text-secondary ml-2">{GENDER_LABELS[patient.gender]}</span>
      </td>

      {/* Contacto */}
      <td className="px-5 py-3.5">
        <p className="text-[12.5px] text-text-primary">{patient.phone}</p>
        {patient.email && <p className="text-[11px] text-text-secondary">{patient.email}</p>}
      </td>

      {/* Tipo sanguíneo */}
      <td className="px-5 py-3.5">
        {patient.bloodType ? (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border tracking-wide",
              BT_BADGE[patient.bloodType],
            )}
          >
            {BLOOD_TYPE_LABELS[patient.bloodType]}
          </span>
        ) : (
          <span className="text-[11px] text-text-disabled italic">Sin registro</span>
        )}
      </td>

      {/* Consultorio */}
      <td className="px-5 py-3.5">
        <span className="text-[12.5px] text-text-primary">{clinic?.name ?? "—"}</span>
      </td>

      {/* Estado */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", patient.isActive ? "bg-emerald-500" : "bg-zinc-400")} />
          <span
            className={cn(
              "text-[12px] font-semibold",
              patient.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-text-muted",
            )}
          >
            {patient.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </td>

      {/* Flecha */}
      <td className="px-5 py-3.5 text-right">
        <ChevronRight size={15} className="text-text-disabled group-hover:text-brand transition-colors ml-auto" />
      </td>
    </tr>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-border-default animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="h-4 bg-bg-subtle rounded-md" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  );
}

function KpiCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "blue" | "emerald" | "amber";
}) {
  const colors = {
    blue: "text-brand bg-brand/10 border-brand/20",
    emerald: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-600 bg-amber-500/10 border-amber-500/20",
  };
  return (
    <div className="p-4 rounded-2xl bg-bg-surface border border-border-default flex items-center gap-4">
      <div className={cn("p-3 rounded-2xl border shrink-0", colors[color])}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-text-primary mt-0.5">{value.toLocaleString("es-MX")}</p>
      </div>
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
        active ? "bg-brand text-white" : "text-text-secondary hover:bg-bg-subtle border border-border-default",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      {children}
    </button>
  );
}
