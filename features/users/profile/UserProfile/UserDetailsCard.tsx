"use client";

import { User } from "../../types";
import { Mail, Phone, Calendar, Shield, Fingerprint, Info } from "lucide-react";

interface UserDetailsCardProps {
  user: User;
}

export default function UserDetailsCard({ user }: UserDetailsCardProps) {
  // Formateador de fecha profesional
  const memberSince = new Date(user.createdAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-interior rounded-md shadow-sm overflow-hidden">
      <div className="px-8 py-5 flex items-center gap-2">
        <Info size={18} className="text-principal" />
        <h3 className="font-bold text-encabezado uppercase tracking-tight text-sm">Información Detallada</h3>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
        <InfoItem
          icon={<Fingerprint size={20} />}
          label="ID de Usuario"
          value={user.id}
          className="lg:col-span-2 font-mono text-[11px]"
        />

        <InfoItem icon={<Shield size={20} />} label="Rol de Sistema" value={user.role} />

        <InfoItem icon={<Mail size={20} />} label="Correo Electrónico" value={user.email} />

        <InfoItem icon={<Phone size={20} />} label="Teléfono" value={user.phone ?? "No registrado"} />

        <InfoItem icon={<Calendar size={20} />} label="Miembro desde" value={memberSince} />
      </div>
    </div>
  );
}

// Sub-componente interno (Helper) para mantener el SRP dentro del archivo
function InfoItem({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 p-2 bg-inner-secundario rounded-lg text-secundario">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-subtitulo uppercase tracking-widest leading-none mb-1.5">{label}</span>
        <span className={`text-sm font-semibold text-encabezado break-all ${className}`}>{value}</span>
      </div>
    </div>
  );
}
