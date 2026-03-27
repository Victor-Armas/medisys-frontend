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
  ShieldCheck,
  UserRound,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
} from "lucide-react";
import { getFullName, getInitials, type User } from "@/types/users.types";
import { getRoleConfig } from "@/constants/roles";
import { isDoctor } from "@/types/doctors.types";
import Image from "next/image";

interface Props {
  user: User;
}

const ROLE_ICON: Record<string, React.ReactNode> = {
  ADMIN_SYSTEM: <ShieldCheck size={14} />,
  MAIN_DOCTOR: <Stethoscope size={14} />,
  DOCTOR: <Stethoscope size={14} />,
  RECEPTIONIST: <UserRound size={14} />,
  PATIENT: <UserRound size={14} />,
};

export function UserProfileClient({ user }: Props) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const config = getRoleConfig(user.role);
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
      {/* ─── Breadcrumb + acciones ─────────────────── */}
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
            <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1.5">
              <span className=" text-md">{config.desc}</span>
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

      {/* ─── Hero Card ─────────────────────────────── */}
      <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
        {/* Banda con gradiente por rol */}
        <div
          className="h-20 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${config.colors.from} 0%, ${config.colors.to} 100%)`,
          }}
        >
          {/* Decoración abstracta */}
          <div
            className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-20"
            style={{ background: "rgba(255,255,255,0.3)" }}
          />
          <div
            className="absolute right-20 bottom-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: "rgba(255,255,255,0.5)" }}
          />

          {/* Badges top-right */}
          <div className="absolute top-4 right-4 flex gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border bg-white ${config.badge}`}
            >
              {ROLE_ICON[user.role]}
              {config.label}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border
                ${
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

        {/* Contenido del hero */}
        <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
          {/* Avatar flotante */}
          <div className="relative sm:absolute sm:left-6 shrink-0 z-10">
            <div
              className={`w-24 h-24 rounded-2xl bg-linear-to-br ${config.gradient}
                flex items-center justify-center text-white text-2xl font-bold
                border-4 border-bg-surface shadow-lg`}
            >
              {user.photoUrl ? (
                <Image
                  src={user.photoUrl}
                  alt={fullName}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>

          <div className="w-full mt-6 sm:pl-32 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-text-primary leading-tight">
                  {fullName}
                </h3>
                {doctor && profile?.fullTitle && (
                  <p
                    className="text-sm font-semibold mt-0.5"
                    style={{ color: config.label }}
                  >
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

              {/* Stats rápidas */}
              {doctor && (
                <div className="flex gap-3">
                  <StatPill
                    icon={<Building2 size={12} />}
                    label={`${activeClinics.length} ${
                      activeClinics.length === 1
                        ? "Consultorio"
                        : "Consultorios"
                    }`}
                    color={config.label}
                    bg={config.badge}
                  />
                  {profile?.professionalLicense && (
                    <StatPill
                      icon={<Award size={12} />}
                      label={`Ced. ${profile.professionalLicense}`}
                      color={config.label}
                      bg={config.badge}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Meta-info */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 pt-4 border-t border-border-default">
              <MetaItem icon={<Mail size={13} />} value={user.email} />
              {user.phone && (
                <MetaItem icon={<Phone size={13} />} value={user.phone} />
              )}
              <MetaItem
                icon={<Clock size={13} />}
                value={`Desde ${createdAt}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Cuerpo Principal ─────────────────────── */}
      <div
        className={`grid gap-6 ${
          doctor ? "grid-cols-1 xl:grid-cols-12" : "grid-cols-1 max-w-2xl"
        }`}
      >
        {/* ── Columna Izquierda ── */}
        <div className={`space-y-4 ${doctor ? "xl:col-span-4" : ""}`}>
          {/* Datos de cuenta */}
          <SectionCard title="Datos de cuenta" accentColor={config.label}>
            <FieldList>
              <FieldRow label="Nombre(s)" value={user.firstName} />
              <FieldRow label="Segundo nombre" value={user.middleName} />
              <FieldRow
                label="Apellido paterno"
                value={user.lastNamePaternal}
              />
              <FieldRow
                label="Apellido materno"
                value={user.lastNameMaternal}
              />
              <FieldRow
                label="Correo electrónico"
                value={user.email}
                icon={<Mail size={12} />}
              />
              <FieldRow
                label="Teléfono"
                value={user.phone}
                icon={user.phone ? <Phone size={12} /> : undefined}
              />
            </FieldList>
          </SectionCard>

          {/* Perfil profesional — solo doctores */}
          {doctor && profile && (
            <SectionCard
              title="Perfil profesional"
              icon={<Stethoscope size={14} />}
              accentColor="#1d9e75"
            >
              <FieldList>
                <FieldRow
                  label="Cédula profesional"
                  value={profile.professionalLicense}
                  mono
                  icon={<Award size={12} />}
                />
                <FieldRow
                  label="Especialidad"
                  value={profile.specialty}
                  icon={<Stethoscope size={12} />}
                />
                <FieldRow
                  label="Universidad"
                  value={profile.university}
                  icon={<GraduationCap size={12} />}
                />
                <FieldRow
                  label="Título completo"
                  value={profile.fullTitle}
                  icon={<BookOpen size={12} />}
                />
              </FieldList>

              {/* Dirección en bloque separado */}
              <div className="mx-4 mb-4 p-3 rounded-xl bg-bg-base border border-border-default/60">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2 flex items-center gap-1.5">
                  <MapPin size={10} />
                  Dirección de consultorio
                </p>
                <p className="text-sm text-text-primary leading-relaxed">
                  {[profile.address, profile.numHome]
                    .filter(Boolean)
                    .join(" #")}
                  {profile.colony && `, ${profile.colony}`}
                  {profile.city && `, ${profile.city}`}
                  {profile.state && `, ${profile.state}`}
                  {profile.zipCode && ` C.P. ${profile.zipCode}`}
                </p>
              </div>
            </SectionCard>
          )}

          {/* Firma digital */}
          {doctor && profile && (
            <SectionCard
              title="Firma digital"
              icon={<FileSignature size={14} />}
              accentColor="#7c6ab5"
            >
              {profile.signatureUrl ? (
                <div className="p-4">
                  <div
                    className="border border-dashed border-border-strong rounded-xl p-4
                                flex items-center justify-center bg-bg-base min-h-[72px]"
                  >
                    <Image
                      src={profile.signatureUrl}
                      alt="Firma digital"
                      width={200}
                      height={72}
                      className="max-h-16 object-contain"
                    />
                  </div>
                  <p className="text-xs text-text-secondary mt-2 text-center">
                    Se estampa en recetas y documentos PDF
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  <div
                    className="border border-dashed border-border-default rounded-xl h-16
                                flex flex-col items-center justify-center bg-bg-base gap-1"
                  >
                    <FileSignature size={18} className="text-text-disabled" />
                    <p className="text-xs text-text-disabled">
                      Sin firma registrada
                    </p>
                  </div>
                  <button
                    className="w-full text-xs font-semibold py-2 border border-dashed border-border-strong
                               rounded-xl transition-colors hover:border-brand hover:text-brand text-text-secondary"
                  >
                    + Subir firma digital
                  </button>
                </div>
              )}
            </SectionCard>
          )}
        </div>

        {/* ── Columna Derecha — solo doctores ── */}
        {doctor && (
          <div className="xl:col-span-8 space-y-4">
            {/* Consultorios asignados */}
            <SectionCard
              title="Consultorios asignados"
              icon={<Building2 size={14} />}
              accentColor="#534ab7"
              action={
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand/20
                             text-brand bg-brand/5 hover:bg-brand/10 transition-colors"
                >
                  + Asignar
                </button>
              }
            >
              {activeClinics.length === 0 ? (
                <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
                    <Building2 size={20} className="text-text-disabled" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-secondary">
                      Sin consultorios asignados
                    </p>
                    <p className="text-xs text-text-disabled mt-1">
                      Asigna un consultorio para activar la gestión de citas
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeClinics.map((dc) => (
                    <ClinicCard key={dc.id} dc={dc} />
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Actividad reciente */}
            <SectionCard title="Actividad reciente" accentColor="#888780">
              <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
                  <Clock size={20} className="text-text-disabled" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">
                    Historial de actividad
                  </p>
                  <p className="text-xs text-text-disabled mt-1">
                    Disponible en la Fase 4 del desarrollo
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-componentes ──────────────────────────────────────────

function SectionCard({
  title,
  children,
  icon,
  action,
  accentColor,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
      {/* Header con acento de color izquierdo */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default relative overflow-hidden">
        {/* Línea de acento izquierda */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
          style={{ background: accentColor ?? "var(--color-brand)" }}
        />
        <div className="flex items-center gap-2 pl-2">
          {icon && (
            <span style={{ color: accentColor ?? "var(--color-brand)" }}>
              {icon}
            </span>
          )}
          <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function FieldList({ children }: { children: React.ReactNode }) {
  return <div className="divide-y divide-border-default/50">{children}</div>;
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
    <div className="flex items-start justify-between px-5 py-3 group hover:bg-bg-base/30 transition-colors">
      <span className="text-xs font-medium text-text-secondary w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`text-right text-sm text-text-primary flex items-center gap-1.5 min-w-0
                    ${mono ? "font-mono text-xs tracking-wider" : ""}`}
      >
        {icon && <span className="text-text-disabled shrink-0">{icon}</span>}
        {value ? (
          <span className="truncate">{value}</span>
        ) : (
          <span className="text-text-disabled">—</span>
        )}
      </span>
    </div>
  );
}

function MetaItem({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-text-secondary">
      <span className="text-text-disabled">{icon}</span>
      {value}
    </span>
  );
}

function StatPill({
  icon,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
      style={{
        color,
        backgroundColor: bg,
        borderColor: `${color}30`,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function ClinicCard({
  dc,
}: {
  dc: {
    id: string;
    isPrimary: boolean;
    assignedAt: string;
    clinic: {
      id: string;
      name: string;
      slug: string;
      city: string | null;
      isActive: boolean;
    };
  };
}) {
  return (
    <div
      className={`relative flex flex-col gap-3 p-4 rounded-xl border transition-all
                  hover:shadow-sm group cursor-pointer
                  ${
                    dc.isPrimary
                      ? "border-brand/30 bg-brand/5"
                      : "border-border-default bg-bg-base/50 hover:border-border-strong"
                  }`}
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                        ${
                          dc.isPrimary
                            ? "bg-brand/10 text-brand"
                            : "bg-bg-subtle text-text-secondary"
                        }`}
          >
            <Building2 size={16} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {dc.clinic.name}
            </p>
            {dc.clinic.city && (
              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                <MapPin size={10} />
                {dc.clinic.city}
              </p>
            )}
          </div>
        </div>

        {dc.isPrimary && (
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide
                       bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded-md shrink-0"
          >
            <Star size={9} className="fill-current" />
            Principal
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border-default/50">
        <span className="text-[11px] text-text-disabled flex items-center gap-1">
          <Calendar size={10} />
          Asignado{" "}
          {new Date(dc.assignedAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dc.clinic.isActive ? "bg-emerald-500" : "bg-zinc-400"
          }`}
        />
      </div>
    </div>
  );
}
