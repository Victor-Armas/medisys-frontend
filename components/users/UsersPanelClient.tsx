"use client";

import { useState, useMemo } from "react";
import { Plus, UserPlus, Search, Filter } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";

import type { SystemUser } from "@/types/users.types";
import { UsersTable } from "./UsersTable";
import { CreateUserModal } from "./modals/CreateUserModal";
import { CreateDoctorModal } from "./modals/CreateDoctorModal";
import { AssignDoctorModal } from "./modals/AssignDoctorModal";

type ModalState = "none" | "create-user" | "create-doctor" | "assign-doctor";
type TabFilter =
  | "all"
  | "DOCTOR"
  | "MAIN_DOCTOR"
  | "RECEPTIONIST"
  | "ADMIN_SYSTEM";

interface Props {
  initialUsers: SystemUser[];
}

export function UsersPanelClient({ initialUsers }: Props) {
  const [modal, setModal] = useState<ModalState>("none");
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: users = initialUsers, isLoading } = useUsers({
    initialData: initialUsers,
  });

  const filtered = useMemo(() => {
    let list = users;
    if (tab !== "all") list = list.filter((u) => u.role === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastNamePaternal.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, tab, search]);

  const doctors = users.filter(
    (u) => u.role === "DOCTOR" || u.role === "MAIN_DOCTOR"
  );
  const activos = doctors.filter((u) => u.isActive).length;
  const sinClinica = doctors.filter(
    (u) =>
      (u.doctorProfile?.doctorClinics?.filter((c) => c.isActive).length ??
        0) === 0
  ).length;

  const TABS: { key: TabFilter; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "MAIN_DOCTOR", label: "Médico principal" },
    { key: "DOCTOR", label: "Médicos" },
    { key: "RECEPTIONIST", label: "Recepcionistas" },
    { key: "ADMIN_SYSTEM", label: "Admins" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            Usuarios del sistema
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Gestión de médicos, recepcionistas y administradores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModal("assign-doctor")}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default
                       rounded-xl text-sm font-medium text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <UserPlus size={15} />
            Asignar perfil médico
          </button>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white rounded-xl
                         text-sm font-medium hover:bg-brand-hover transition-colors shadow-sm"
            >
              <Plus size={15} />
              Nuevo usuario
            </button>
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-bg-surface border border-border-default
                                rounded-xl shadow-lg overflow-hidden z-20"
                >
                  <button
                    onClick={() => {
                      setModal("create-doctor");
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-bg-subtle transition-colors border-b border-border-default"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      Nuevo médico
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Con perfil profesional completo
                    </p>
                  </button>
                  <button
                    onClick={() => {
                      setModal("create-user");
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-bg-subtle transition-colors"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      Otro usuario
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Recepcionista o administrador
                    </p>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total usuarios" value={users.length} />
        <KpiCard label="Médicos activos" value={activos} color="emerald" />
        <KpiCard
          label="Inactivos"
          value={users.filter((u) => !u.isActive).length}
          color="amber"
        />
        <KpiCard label="Sin consultorio" value={sinClinica} color="red" />
      </div>

      {/* Toolbar */}
      <div
        className="bg-bg-surface border border-border-default rounded-2xl flex flex-col md:flex-row
                      justify-between items-center p-2 gap-3"
      >
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar w-full md:w-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
                          ${
                            tab === t.key
                              ? "bg-bg-subtle text-brand"
                              : "text-text-secondary hover:text-text-primary hover:bg-bg-subtle/50"
                          }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto px-2 md:px-0">
          <div className="relative flex-1 md:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email..."
              className="w-full pl-9 pr-4 py-2 bg-bg-base border border-border-default rounded-xl text-sm
                         outline-none text-text-primary placeholder:text-text-disabled focus:border-brand/50 transition-colors"
            />
          </div>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-border-default
                             text-text-secondary hover:bg-bg-subtle hover:text-brand transition-colors shrink-0"
          >
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Tabla */}
      <UsersTable users={filtered} isLoading={isLoading} />

      {modal === "create-user" && (
        <CreateUserModal onClose={() => setModal("none")} />
      )}
      {modal === "create-doctor" && (
        <CreateDoctorModal onClose={() => setModal("none")} />
      )}
      {modal === "assign-doctor" && (
        <AssignDoctorModal onClose={() => setModal("none")} />
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: "emerald" | "amber" | "red";
}) {
  const textColor =
    color === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : color === "amber"
      ? "text-amber-600 dark:text-amber-400"
      : color === "red"
      ? "text-red-500 dark:text-red-400"
      : "text-text-primary";
  return (
    <div className="p-5 rounded-2xl bg-bg-surface border border-border-default">
      <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
      <h3 className={`text-2xl font-bold ${textColor}`}>{value}</h3>
    </div>
  );
}
