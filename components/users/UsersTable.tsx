"use client";

import { useRouter } from "next/navigation";
import { Building2, ChevronRight, UserCircle } from "lucide-react";
import type { SystemUser } from "@/types/users.types";
import {
  ROLE_LABELS,
  ROLE_BADGE,
  ROLE_AVATAR_GRADIENT,
} from "@/constants/roles";
import { getFullName, getInitials } from "@/types/users.types";
import { isDoctor } from "@/types/doctors.types";
import Image from "next/image";

interface Props {
  users: SystemUser[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: Props) {
  const router = useRouter();

  if (isLoading) return <Skeleton />;

  if (users.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-2xl p-16 flex flex-col items-center gap-3">
        <UserCircle size={36} className="text-text-disabled" />
        <p className="text-sm text-text-secondary">
          No se encontraron usuarios.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-bg-base/50">
            <tr>
              {[
                "Usuario",
                "Rol",
                "Especialidad",
                "Consultorio",
                "Estado",
                "",
              ].map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-4 text-[11px] font-semibold text-text-secondary uppercase tracking-wider border-b border-border-default"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onClick={() => router.push(`/users/${user.id}`)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t border-border-default bg-bg-base/30 flex items-center justify-between">
        <p className="text-xs text-text-secondary">
          {users.length} {users.length === 1 ? "usuario" : "usuarios"}
        </p>
      </div>
    </div>
  );
}

function UserRow({ user, onClick }: { user: SystemUser; onClick: () => void }) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const gradient = ROLE_AVATAR_GRADIENT[user.role];
  const clinics =
    user.doctorProfile?.doctorClinics?.filter((c) => c.isActive) ?? [];
  const primary = clinics.find((c) => c.isPrimary) ?? clinics[0];

  return (
    <tr
      onClick={onClick}
      className="cursor-pointer hover:bg-bg-subtle/40 transition-colors group"
    >
      {/* Usuario */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full bg-linear-to-br ${gradient}
                          flex items-center justify-center text-white text-xs font-bold shrink-0`}
          >
            {user.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={fullName}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="font-semibold text-text-primary text-[13px] leading-tight">
              {fullName}
            </p>
            <p className="text-[11px] text-text-secondary mt-0.5">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Rol */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
            ROLE_BADGE[user.role]
          }`}
        >
          {ROLE_LABELS[user.role]}
        </span>
      </td>

      {/* Especialidad */}
      <td className="px-6 py-4 text-[13px] text-text-primary">
        {isDoctor(user) && user.doctorProfile?.specialty ? (
          user.doctorProfile.specialty
        ) : (
          <span className="text-text-disabled">—</span>
        )}
      </td>

      {/* Consultorio */}
      <td className="px-6 py-4">
        {clinics.length === 0 ? (
          <span className="text-[12px] text-text-disabled">Sin asignar</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <Building2 size={13} className="text-text-secondary shrink-0" />
            <span className="text-[13px] text-text-primary">
              {primary?.clinic.name}
            </span>
            {clinics.length > 1 && (
              <span className="text-[11px] text-text-secondary bg-bg-subtle px-1.5 py-0.5 rounded-md font-semibold">
                +{clinics.length - 1}
              </span>
            )}
          </div>
        )}
      </td>

      {/* Estado */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 text-[12px] font-medium
                          ${
                            user.isActive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-zinc-500 dark:text-zinc-400"
                          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              user.isActive ? "bg-emerald-500" : "bg-zinc-400"
            }`}
          />
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </td>

      {/* Acción */}
      <td className="px-6 py-4 text-right">
        <span
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand
                         opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Ver perfil <ChevronRight size={13} />
        </span>
      </td>
    </tr>
  );
}

function Skeleton() {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="w-9 h-9 rounded-full bg-bg-subtle shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-bg-subtle rounded w-48" />
            <div className="h-2.5 bg-bg-subtle rounded w-36" />
          </div>
          <div className="h-5 bg-bg-subtle rounded-md w-24" />
          <div className="h-3 bg-bg-subtle rounded w-20" />
          <div className="h-3 bg-bg-subtle rounded w-16" />
        </div>
      ))}
    </div>
  );
}
