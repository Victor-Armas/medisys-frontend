"use client";

import { getRoleConfig } from "@/shared/constants/roles";
import { User } from "../../types";
import { getFullName, getInitials } from "../../types/users.types";
import { Dispatch, SetStateAction } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface HeroUserCardProps {
  user: User;
  setEditOpen: Dispatch<SetStateAction<boolean>>;
}

export default function HeroUserCard({ user, setEditOpen }: HeroUserCardProps) {
  const initial = getInitials(user);
  const config = getRoleConfig(user.role);
  const fullName = getFullName(user);

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-inner-principal/20 to-inner-principal rounded-md shadow-sm ring-1 ring-black/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center gap-6 z-10">
        <div
          className={`relative flex items-center justify-center shrink-0 w-24 h-24 rounded-full shadow-inner border-4 ${config.badge}`}
        >
          <span className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">{initial}</span>
          <div
            className={`absolute bottom-1 right-1 w-5 h-5 border-4 border-white rounded-full ring-1 ring-black/10 ${user.isActive ? "bg-green-500" : "bg-gray-400"}`}
          />
        </div>

        {/* Info Principal */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-encabezado">{fullName}</h2>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.badge} uppercase tracking-wider`}
            >
              {config.label}
            </span>
            <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
              <Mail size={14} className="text-gray-400" />
              {user.email}
            </span>
          </div>
        </div>
      </div>

      {/* Acción de Editar */}
      <Button variant="primary2" icon="editar" onClick={() => setEditOpen(true)} className="p-2">
        Editar Perfil
      </Button>
    </div>
  );
}
