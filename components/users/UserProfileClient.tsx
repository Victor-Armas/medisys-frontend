"use client";
// Página de perfil completo. Adapta la UI según el rol:
// - Admin / Recepcionista: datos básicos de cuenta
// - Doctor / Médico principal: datos básicos + perfil profesional + consultorios + firma

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Pencil,
  Star,
  MapPin,
  GraduationCap,
  FileSignature,
  Stethoscope,
} from "lucide-react";
import { getFullName, getInitials, type SystemUser } from "@/types/users.types";
import {
  ROLE_AVATAR_GRADIENT,
  ROLE_BADGE,
  ROLE_LABELS,
} from "@/constants/roles";
import { isDoctor } from "@/types/doctors.types";
import Image from "next/image";

interface Props {
  user: SystemUser;
}

export function UserProfileClient({ user }: Props) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const gradient = ROLE_AVATAR_GRADIENT[user.role];
  const doctor = isDoctor(user);
  const profile = user.doctorProfile;
  const activeClinics = profile?.doctorClinics?.filter((c) => c.isActive) ?? [];

  const createdAt = new Date(user.createdAt).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-[1400px] mx-auto pb-10 space-y-6">
      {/* Breadcrumb + acciones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/users"
            className="p-2 border border-border-default rounded-xl text-text-secondary
                       hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">
              Perfil de usuario
            </h2>
            <p className="text-sm text-text-secondary mt-0.5">
              ID: <span className="font-mono text-xs">{user.id}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default
                             rounded-xl text-sm font-medium text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <Pencil size={14} />
            Editar datos
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
        {/* Banda superior de color */}
        <div className="h-20 bg-linear-to-r from-brand-gradient-from to-brand-gradient-to relative">
          <div className="absolute top-3 right-4 flex gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                ROLE_BADGE[user.role]
              }`}
            >
              {ROLE_LABELS[user.role]}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold border
                              ${
                                user.isActive
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
                                  : "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600"
                              }`}
            >
              {user.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 relative">
          {/* Avatar */}
          <div
            className={`w-20 h-20 rounded-full bg-linear-to-br ${gradient}
                          flex items-center justify-center text-white text-2xl font-bold
                          border-4 border-bg-surface shadow-sm absolute -top-10`}
          >
            {user.photoUrl ? (
              <Image
                src={user.photoUrl}
                alt={fullName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-bold text-text-primary">{fullName}</h3>
            {doctor && profile?.fullTitle && (
              <p className="text-sm text-brand font-medium mt-0.5">
                {profile.fullTitle}
              </p>
            )}
            {doctor && profile?.specialty && (
              <p className="text-sm text-text-secondary mt-0.5">
                {profile.specialty}
              </p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Mail size={13} />
                {user.email}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} />
                  {user.phone}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                Desde {createdAt}
              </span>
              {activeClinics.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Building2 size={13} />
                  {activeClinics.length}{" "}
                  {activeClinics.length === 1 ? "consultorio" : "consultorios"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo */}
      <div
        className={`grid gap-6 ${
          doctor ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1 max-w-2xl"
        }`}
      >
        {/* Columna izquierda */}
        <div className={`space-y-4 ${doctor ? "xl:col-span-4" : ""}`}>
          {/* Datos de cuenta */}
          <InfoCard title="Datos de cuenta">
            <FieldRow label="Nombre(s)" value={user.firstName} />
            <FieldRow label="Segundo nombre" value={user.middleName} />
            <FieldRow label="Apellido paterno" value={user.lastNamePaternal} />
            <FieldRow label="Apellido materno" value={user.lastNameMaternal} />
            <FieldRow label="Email" value={user.email} />
            <FieldRow label="Teléfono" value={user.phone} />
          </InfoCard>

          {/* Perfil profesional — solo doctores */}
          {doctor && profile && (
            <InfoCard
              title="Perfil profesional"
              icon={<Stethoscope size={14} />}
            >
              <FieldRow
                label="Cédula profesional"
                value={profile.professionalLicense}
                mono
              />
              <FieldRow label="Especialidad" value={profile.specialty} />
              <FieldRow
                label="Universidad"
                value={profile.university}
                icon={<GraduationCap size={12} />}
              />
              <FieldRow label="Título completo" value={profile.fullTitle} />
              <FieldRow
                label="Domicilio"
                value={profile.address}
                icon={<MapPin size={12} />}
              />
              <FieldRow label="Ciudad" value={profile.city} />
              <FieldRow label="Estado" value={profile.state} />
              <FieldRow label="C.P." value={profile.zipCode} />
            </InfoCard>
          )}

          {/* Firma digital */}
          {doctor && profile && (
            <InfoCard title="Firma digital" icon={<FileSignature size={14} />}>
              {profile.signatureUrl ? (
                <div className="p-4">
                  <div className="border border-dashed border-border-strong rounded-xl p-4 flex items-center justify-center bg-bg-base">
                    <Image
                      src={profile.signatureUrl}
                      alt="Firma digital"
                      className="max-h-16 object-contain"
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-2 text-center">
                    Firma registrada — se usa en recetas y documentos
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <div
                    className="border border-dashed border-border-default rounded-xl h-16
                                  flex items-center justify-center bg-bg-base"
                  >
                    <p className="text-xs text-text-disabled">
                      Sin firma registrada
                    </p>
                  </div>
                  <button
                    className="mt-3 w-full text-xs font-medium text-brand hover:text-brand-hover
                                     py-2 border border-border-default rounded-xl transition-colors"
                  >
                    Subir firma digital
                  </button>
                </div>
              )}
            </InfoCard>
          )}
        </div>

        {/* Columna derecha — solo doctores */}
        {doctor && (
          <div className="xl:col-span-8 space-y-4">
            {/* Consultorios asignados */}
            <InfoCard
              title="Consultorios asignados"
              icon={<Building2 size={14} />}
              action={
                <button className="text-xs font-medium text-brand hover:text-brand-hover transition-colors">
                  + Asignar
                </button>
              }
            >
              {activeClinics.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <Building2
                    size={28}
                    className="mx-auto text-text-disabled mb-2"
                  />
                  <p className="text-sm text-text-secondary">
                    Sin consultorios asignados
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {activeClinics.map((dc) => (
                    <div
                      key={dc.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-border-default bg-bg-base/50 hover:border-brand/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-bg-subtle flex items-center justify-center">
                          <Building2 size={16} className="text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">
                            {dc.clinic.name}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {dc.clinic.city} · Asignado{" "}
                            {new Date(dc.assignedAt).toLocaleDateString(
                              "es-MX"
                            )}
                          </p>
                        </div>
                      </div>
                      {dc.isPrimary && (
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-semibold
                                         bg-bg-subtle text-brand border border-border-strong px-2 py-1 rounded-md"
                        >
                          <Star size={10} className="fill-current" />
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </InfoCard>

            {/* Actividad reciente */}
            <InfoCard title="Actividad reciente">
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-text-secondary">
                  El historial de actividad estará disponible en la Fase 4.
                </p>
              </div>
            </InfoCard>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────

function InfoCard({
  title,
  children,
  icon,
  action,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
        <div className="flex items-center gap-2">
          {icon && <span className="text-text-secondary">{icon}</span>}
          <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function FieldRow({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between px-5 py-3 border-b border-border-default last:border-b-0">
      <span className="text-xs font-medium text-text-secondary w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`text-right text-sm text-text-primary flex items-center gap-1.5
                        ${mono ? "font-mono text-xs" : ""}`}
      >
        {icon}
        {value ?? <span className="text-text-disabled">—</span>}
      </span>
    </div>
  );
}
