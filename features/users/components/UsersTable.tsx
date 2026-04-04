"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronRight, UserCircle2 } from "lucide-react";
import Image from "next/image";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

import { isDoctor } from "@/features/users/types/doctors.types";
import { getRoleConfig } from "@/shared/constants/roles";
import { getFullName, getInitials, type User } from "../types/users.types";

interface Props {
  users: User[];
  isLoading: boolean;
}

const TABLE_HEADERS = ["Usuario", "Rol", "Especialidad", "Consultorio", "Estado", "Acciones"];

export function UsersTable({ users, isLoading }: Props) {
  const router = useRouter();

  if (isLoading) return <TableSkeleton />;

  if (users.length === 0) {
    return (
      <Card className="border-border-default bg-bg-surface shadow-none">
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <UserCircle2 size={40} className="text-text-muted" strokeWidth={1.5} />
          <div className="text-center">
            <p className="text-sm font-semibold text-text-secondary">No se encontraron usuarios</p>
            <p className="text-xs text-text-muted mt-1">Ajusta los filtros o crea un nuevo usuario</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border-default bg-bg-surface shadow-none overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap border-collapse">
          <thead>
            <tr className="bg-bg-base/60 border-b border-border-default">
              {TABLE_HEADERS.map((h, i) => (
                <th key={i} className="px-6 py-3.5 text-[10.5px] font-bold text-text-muted uppercase tracking-[.07em]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <UserRow
                key={user.id}
                user={user}
                isLast={idx === users.length - 1}
                onClick={() => router.push(`/users/${user.id}`)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-3 border-t border-border-default bg-bg-base/40">
        <p className="text-xs text-text-muted font-medium">
          {users.length} {users.length === 1 ? "usuario" : "usuarios"}
        </p>
      </div>
    </Card>
  );
}

function UserRow({ user, isLast, onClick }: { user: User; isLast: boolean; onClick: () => void }) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const config = getRoleConfig(user.role);

  const clinics = user.doctorProfile?.doctorClinics?.filter((c) => c.isActive) ?? [];
  const primary = clinics.find((c) => c.isPrimary) ?? clinics[0];

  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-colors duration-100 hover:bg-bg-subtle/50",
        !isLast && "border-b border-border-default",
      )}
    >
      {/* Usuario */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full bg-linear-to-br shrink-0 flex items-center justify-center text-white text-xs font-bold",
              config.gradient,
              !user.isActive && "opacity-40",
            )}
          >
            {user.photoUrl ? (
              <Image src={user.photoUrl} alt={fullName} width={36} height={36} className="rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className={cn(!user.isActive && "opacity-60")}>
            <p className="text-[13.5px] font-semibold text-text-primary leading-tight">{fullName}</p>
            <p className="text-[11.5px] text-text-secondary mt-0.5">{user.email}</p>
          </div>
        </div>
      </td>

      {/* Rol */}
      <td className="px-6 py-4">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border tracking-wide",
            config.badge,
          )}
        >
          {config.label}
        </span>
      </td>

      {/* Especialidad */}
      <td className="px-6 py-4">
        <span
          className={cn(
            "text-[13px]",
            isDoctor(user) && user.doctorProfile?.specialty ? "text-text-primary font-medium" : "text-text-muted",
          )}
        >
          {isDoctor(user) && user.doctorProfile?.specialty ? user.doctorProfile.specialty : "—"}
        </span>
      </td>

      {/* Consultorio */}
      <td className="px-6 py-4">
        {clinics.length === 0 ? (
          <span className="text-[12px] text-text-muted">Sin asignar</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-text-muted shrink-0" strokeWidth={1.8} />
            <span className="text-[13px] text-text-primary font-medium">{primary?.clinic.name}</span>
            {clinics.length > 1 && (
              <span className="text-[11px] font-bold text-text-secondary bg-bg-subtle px-1.5 py-0.5 rounded-md">
                +{clinics.length - 1}
              </span>
            )}
          </div>
        )}
      </td>

      {/* Estado */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", user.isActive ? "bg-emerald-500" : "bg-zinc-400")} />
          <span
            className={cn(
              "text-[12.5px] font-semibold",
              user.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-text-muted",
            )}
          >
            {user.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </td>

      {/* Acción */}
      <td className="px-6 py-4 text-right">
        <span className="inline-flex items-center gap-1 text-[12px] font-bold text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          Ver perfil <ChevronRight size={13} strokeWidth={2.5} />
        </span>
      </td>
    </tr>
  );
}

function TableSkeleton() {
  return (
    <Card className="border-border-default bg-bg-surface shadow-none overflow-hidden">
      <div className="p-5 space-y-3.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-bg-subtle shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-bg-subtle rounded-md w-44" />
              <div className="h-2.5 bg-bg-subtle rounded-md w-32" />
            </div>
            <div className="h-5 bg-bg-subtle rounded-lg w-24" />
            <div className="h-3 bg-bg-subtle rounded-md w-20 hidden md:block" />
            <div className="h-3 bg-bg-subtle rounded-md w-14 hidden lg:block" />
          </div>
        ))}
      </div>
    </Card>
  );
}
