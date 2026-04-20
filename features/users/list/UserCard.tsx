"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/utils";
import { User, getFullName, getInitials } from "../types/users.types";
import { isDoctor } from "@/features/users/types/doctors.types";
import { getRoleConfig } from "@/shared/constants/roles";
import { SpecialtyFooter } from "@/shared/ui/SpecialtyFooter";

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export function UserCard({ user, onClick }: UserCardProps) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const config = getRoleConfig(user.role);

  const specialty = isDoctor(user) && user.doctorProfile?.specialty ? user.doctorProfile.specialty : "Staff Administrativo";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className="group bg-interior p-5 rounded-sm  shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between min-h-[170px] focus:outline-none focus:ring-2 focus:ring-principal focus:ring-offset-2"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar con gradiente original */}
          <div
            className={cn(
              "w-10 h-10 rounded-md shrink-0 flex items-center justify-center  text-xs font-bold shadow-sm transition-transform group-hover:scale-105",
              config.gradient,
              config.badge,
              !user.isActive && "opacity-40 grayscale",
            )}
          >
            {user.photoUrl ? (
              <Image src={user.photoUrl} alt={fullName} width={40} height={40} className="rounded-md object-cover" />
            ) : (
              initials
            )}
          </div>

          <div className="space-y-0.5">
            <h3 className="text-[14.5px] font-bold text-encabezado group-hover:text-principal transition-colors">{fullName}</h3>
            <p className="text-[12px] text-subtitulo">{config.label}</p>
          </div>
        </div>

        {/* Badge de Estado estilo Stitch */}
        <span
          className={cn(
            "px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase ",
            user.isActive ? "bg-positive text-positive-text" : "bg-negative text-negative-text",
          )}
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      <div className=" border-gray-50 flex items-center gap-2 text-gray-500">
        <SpecialtyFooter specialty={specialty} iconClassName="text-gray-400 group-hover:text-[#8b3dcc]" />{" "}
      </div>
    </div>
  );
}
