import Image from "next/image";
import { Mail, Phone, Clock, Stethoscope, CheckCircle2, XCircle, Award, Building2 } from "lucide-react";
import { getFullName, getInitials } from "@features/users/types/users.types";
import { isDoctor } from "@features/users/types/doctors.types";
import { StatPill } from "./shared/StatPill";
import type { User } from "@features/users/types/users.types";
import { RoleConfig } from "@/shared/constants/roles";

interface Props {
  user: User;
  config: RoleConfig;
}

export function UserHeroCard({ user, config }: Props) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const doctor = isDoctor(user);
  const profile = user.doctorProfile;
  const activeClinics = profile?.doctorClinics?.filter((c) => c.isActive) ?? [];

  const createdAt = new Date(user.createdAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
      {/* Banda con gradiente */}
      <div
        className="h-20 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${config.colors.from} 0%, ${config.colors.to} 100%)` }}
      >
        <div
          className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
        <div
          className="absolute right-20 bottom-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: "rgba(255,255,255,0.5)" }}
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-white ${config.badge}`}
          >
            <config.icon />
            {config.label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
              user.isActive
                ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
                : "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600"
            }`}
          >
            {user.isActive ? (
              <>
                <CheckCircle2 size={11} /> Activo
              </>
            ) : (
              <>
                <XCircle size={11} /> Inactivo
              </>
            )}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
        <div className="relative sm:absolute sm:left-6 shrink-0 z-10">
          <div
            className={`w-24 h-24 rounded-2xl bg-linear-to-br ${config.gradient} flex items-center justify-center text-white text-2xl font-bold border-4 border-bg-surface shadow-lg`}
          >
            {user.photoUrl ? (
              <Image src={user.photoUrl} alt={fullName} width={96} height={96} className="w-24 h-24 rounded-2xl object-cover" />
            ) : (
              initials
            )}
          </div>
        </div>

        <div className="w-full mt-6 sm:pl-32 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-text-primary leading-tight">{fullName}</h3>
              {doctor && profile?.fullTitle && (
                <p className="text-sm font-semibold mt-0.5" style={{ color: config.colors.from }}>
                  {profile.fullTitle}
                </p>
              )}
              {doctor && profile?.specialty && (
                <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1.5">
                  <Stethoscope size={13} />
                  {profile.specialty}
                </p>
              )}
            </div>
            {doctor && (
              <div className="flex gap-3">
                <StatPill
                  icon={<Building2 size={12} />}
                  label={`${activeClinics.length} ${activeClinics.length === 1 ? "Consultorio" : "Consultorios"}`}
                  color={config.colors.from}
                  bg={config.colors.light}
                />
                {profile?.professionalLicense && (
                  <StatPill
                    icon={<Award size={12} />}
                    label={`Ced. ${profile.professionalLicense}`}
                    color={config.colors.from}
                    bg={config.colors.light}
                  />
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-border-default">
            <span className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Mail size={13} className="text-text-disabled" />
              {user.email}
            </span>
            {user.phone && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Phone size={13} className="text-text-disabled" />
                {user.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Clock size={13} className="text-text-disabled" />
              Desde {createdAt}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
