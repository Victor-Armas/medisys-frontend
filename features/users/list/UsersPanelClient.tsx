"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Users, UserCheck, UserX } from "lucide-react";

import { useUsers } from "@/features/users/hooks/useUsers";
import { useUserFilters } from "@/features/users/hooks/useUserFilters";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { Button } from "@/shared/ui/button";

// Modales y Shared
import { UserFormModal } from "../modals/UserFormModal/UserFormModal";
import { AssignDoctorModal } from "../modals/AssignDoctorModal/AssignDoctorModal";
import { UsersToolbar } from "../shared/UsersToolbar";
import { UserCard } from "./UserCard";

import type { ModalState, StaffRole, User } from "../types/users.types";
import { cn } from "@/shared/lib/utils";
import { ECGLoader } from "@/shared/ui/ECGLoader";

interface Props {
  initialUsers: User[];
  serverRole: "" | StaffRole;
}

export function UsersPanelClient({ initialUsers, serverRole }: Props) {
  const router = useRouter();
  const [modal, setModal] = useState<ModalState>("none");
  const { data: users = initialUsers, isLoading } = useUsers({ initialData: initialUsers });

  // Hook de filtros (asegúrate de que use el tipo ActivityStatusTab que definimos)
  const { tab, setTab, search, setSearch, filtered } = useUserFilters(users);
  const { canManageUsers } = usePermissions(serverRole);

  // Stats para las KpiCards del lateral
  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
    }),
    [users],
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6 min-h-screen ">
      {/* 1. Encabezado Original con Botones de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-encabezado">Usuarios del sistema</h2>
          <p className="text-subtitulo mt-1">Gestión de médicos, recepcionistas y administradores.</p>
        </div>

        {canManageUsers && (
          <div className="flex items-center gap-3">
            <Button variant="secundario" icon="userPlus" onClick={() => setModal("assign-doctor")} className="p-2">
              Asignar perfil médico
            </Button>

            <Button className="p-2" variant="primary2" icon="agregar" onClick={() => setModal("create-user-unified")}>
              Nuevo usuario
            </Button>
          </div>
        )}
      </div>

      {/* 2. Toolbar de Filtros (Todos, Activos, Inactivos + Search) */}
      <UsersToolbar tab={tab} setTab={setTab} search={search} setSearch={setSearch} />

      {/* 3. Layout de Contenido: Sidebar de Stats + Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Columna de Estadísticas (Fiel al diseño de tu imagen) */}
        <aside className="lg:col-span-1 flex flex-col gap-4">
          <StatCard title="Total Usuarios" value={stats.total} icon={<Users size={18} />} color="bg-purple-100 text-purple-700" />
          <StatCard title="Activos" value={stats.active} icon={<UserCheck size={18} />} color="bg-blue-100 text-blue-700" />
          <StatCard title="Inactivos" value={stats.inactive} icon={<UserX size={18} />} color="bg-red-100 text-red-700" />
        </aside>

        {/* Grid Principal de Usuarios */}
        <main className="lg:col-span-3 xl:col-span-4">
          {isLoading ? (
            <ECGLoader />
          ) : filtered.length === 0 ? (
            <div className="bg-interior  rounded-sm py-20 text-center">
              <p className="text-subtitulo font-medium text-sm">No se encontraron resultados para tu búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((user) => (
                <UserCard key={user.id} user={user} onClick={() => router.push(`/users/${user.id}`)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 4. Modales */}
      {modal === "create-user-unified" && canManageUsers && <UserFormModal onClose={() => setModal("none")} />}
      {modal === "assign-doctor" && canManageUsers && <AssignDoctorModal onClose={() => setModal("none")} />}
    </div>
  );
}

// Componente helper para Stats (puedes moverlo a un archivo aparte si lo deseas)
function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-interior p-5 rounded-sm shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2 rounded-md", color)}>{icon}</div>
        <span className="text-[13px] font-bold text-subtitulo uppercase ">{title}</span>
      </div>
      <div className="text-3xl font-bold text-encabezado">{value.toLocaleString()}</div>
    </div>
  );
}
