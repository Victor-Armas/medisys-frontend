"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { getRoleConfig } from "@shared/constants/roles";
import { isDoctor } from "@features/users/types/doctors.types";

import { UserActivityCard } from "./profile/UserActivityCard";
import type { User } from "@features/users/types/users.types";

import UserAccountCard from "./profile/UserAccountCard";

import { DoctorSignatureCard } from "./profile/DoctorSignatureCard";
import { UserHeroCard } from "./profile/UserHeroCard";
import { DoctorProfessionalCard } from "./profile/DoctorProfessionalCard";
import { DoctorClinicsCard } from "./profile/DoctorClinicsCard";

interface Props {
  user: User;
}

export function UserProfileClient({ user }: Props) {
  const config = getRoleConfig(user.role);
  const doctor = isDoctor(user);
  const profile = user.doctorProfile;

  return (
    <div className="max-w-[1400px] mx-auto pb-10 space-y-6">
      {/* Breadcrumb + acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/users"
            className="p-2 border border-border-default rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Perfil de usuario</h2>
            <p className="text-sm text-text-secondary mt-0.5">{config.desc}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm font-medium text-text-primary hover:bg-bg-subtle transition-colors">
          <Pencil size={14} />
          Editar datos
        </button>
      </div>

      {/* Hero */}
      <UserHeroCard user={user} config={config} />

      {/* Cuerpo */}
      <div className={`grid gap-6 ${doctor ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1 max-w-2xl"}`}>
        {/* Columna izquierda */}
        <div className={`space-y-4 ${doctor ? "xl:col-span-4" : ""}`}>
          <UserAccountCard user={user} />
          {doctor && profile && <DoctorProfessionalCard profile={profile} />}
          {doctor && profile && <DoctorSignatureCard profile={profile} />}
        </div>

        {/* Columna derecha — solo doctores */}
        {doctor && (
          <div className="xl:col-span-8 space-y-4">
            <DoctorClinicsCard doctorClinics={profile?.doctorClinics ?? []} />
            <UserActivityCard />
          </div>
        )}
      </div>
    </div>
  );
}
