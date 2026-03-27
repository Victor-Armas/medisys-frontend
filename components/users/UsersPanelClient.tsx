"use client";

import { useState, useMemo } from "react";
import { Plus, UserPlus } from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/users.types";
import { UsersTable } from "./UsersTable";
import { UserFormModal } from "./modals/UserFormModal/UserFormModal";
import { AssignDoctorModal } from "./modals/AssignDoctorModal/AssignDoctorModal";
import { KpiCard } from "./shared/KpiCard";
import { calculateUserStats } from "@/utils/user-stats";
import { UsersToolbar } from "./shared/UsersToolbar";
import { Button } from "../ui/button";

type ModalState = "none" | "create-user-unified" | "assign-doctor";
type TabFilter =
  | "all"
  | "DOCTOR"
  | "MAIN_DOCTOR"
  | "RECEPTIONIST"
  | "ADMIN_SYSTEM";

interface Props {
  initialUsers: User[];
}

export function UsersPanelClient({ initialUsers }: Props) {
  const [modal, setModal] = useState<ModalState>("none");
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");

  const { data: users = initialUsers, isLoading } = useUsers({
    initialData: initialUsers,
  });

  const stats = calculateUserStats(users);

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

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-text-primary tracking-tight">
            Usuarios del sistema
          </h2>
          <p className="text-base font-body text-text-secondary mt-1">
            Gestión de médicos, recepcionistas y administradores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Botón "Asignar perfil médico" - variante outline */}
          <Button
            variant="outline"
            onClick={() => setModal("assign-doctor")}
            className="flex items-center gap-2 h-10 px-5 bg-bg-surface"
          >
            <UserPlus />
            Asignar perfil médico
          </Button>

          {/* Botón "Nuevo usuario" con DropdownMenu */}
          <Button
            onClick={() => setModal("create-user-unified")} // Abre el modal unificado
            className="flex items-center gap-2 h-11 px-5 text-sm font-semibold
                       bg-brand hover:bg-brand-hover text-white border-none 
                       shadow-lg shadow-brand/10 rounded-xl transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            Nuevo usuario
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <KpiCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            color={stat.color}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Toolbar */}
      <UsersToolbar
        tab={tab}
        setTab={setTab}
        search={search}
        setSearch={setSearch}
      />

      {/* Tabla */}
      <UsersTable users={filtered} isLoading={isLoading} />

      {modal === "create-user-unified" && (
        <UserFormModal onClose={() => setModal("none")} />
      )}
      {modal === "assign-doctor" && (
        <AssignDoctorModal onClose={() => setModal("none")} />
      )}
    </div>
  );
}
