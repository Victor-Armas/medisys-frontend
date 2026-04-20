"use client";
import { useState } from "react";
import { User } from "../../types";
import HeroUserCard from "./HeroUserCard";
import UserDetailsCard from "./UserDetailsCard";
import { EditUserModal } from "../../modals/EditUserModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  user: User;
  isOwnProfile?: boolean;
}

export default function UserProfileClient({ user, isOwnProfile = false }: Props) {
  const backHref = isOwnProfile ? "/dashboard" : "/users";
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 md:p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-end">
        <Link
          href={backHref}
          className="bg-inner-secundario p-2 rounded-sm flex items-center gap-3 hover:bg-secundario-hover/80 transition duration-300 shadow-sm"
        >
          <ArrowLeft size={17} strokeWidth={3} className="text-secundario" />
          <span className="text-secundario">Regresar</span>
        </Link>
      </div>
      {/* Sección Superior: Identidad */}
      <HeroUserCard user={user} setEditOpen={setEditOpen} />

      {/* Sección Inferior: Detalles y Configuración */}
      <div className="grid grid-cols-1 gap-8">
        <UserDetailsCard user={user} />
      </div>
      {editOpen && <EditUserModal user={user} onClose={() => setEditOpen(false)} />}
    </div>
  );
}
