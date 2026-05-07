"use client";
import { useState } from "react";
import { User } from "../../types";
import HeroUserCard from "./HeroUserCard";
import UserDetailsCard from "./UserDetailsCard";
import { EditUserModal } from "../../modals/EditUserModal";

interface Props {
  user: User;
  isOwnProfile?: boolean;
}

export default function UserProfileClient({ user, isOwnProfile = false }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div className="w-full max-w-[1400px] mx-auto  md:p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Sección Superior: Identidad */}
      <HeroUserCard user={user} setEditOpen={setEditOpen} isOwnProfile={isOwnProfile} />

      {/* Sección Inferior: Detalles y Configuración */}
      <div className="grid grid-cols-1 gap-8">
        <UserDetailsCard user={user} />
      </div>
      {editOpen && <EditUserModal user={user} onClose={() => setEditOpen(false)} />}
    </div>
  );
}
