"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Activity,
  MapPin,
  Phone,
  Mail,
  Droplets,
  User,
  AlertTriangle,
  Calendar,
  Building2,
  ChevronRight,
  ClipboardList,
  Paperclip,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  BLOOD_TYPE_LABELS,
  GENDER_LABELS,
  MARITAL_STATUS_LABELS,
  EDUCATION_LABELS,
  getPatientFullName,
  getPatientInitials,
  getPatientAge,
  type Patient,
} from "../types/patient.types";
import { PatientMedicalHistoryTab } from "./profile/PatientMedicalHistoryTab";
import { PatientAddressTab } from "./profile/PatientAddressTab";
import { PatientMedicalFilesTab } from "./profile/PatientMedicalFilesTab";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { MedicalStaffRole } from "@/features/users/types/users.types";

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "overview" | "history" | "address" | "files";

interface Props {
  patient: Patient;
  serverRole: MedicalStaffRole;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PatientProfilePage({ patient, serverRole }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const { canManageUsers, isDoctor, isAdminOrMain } = usePermissions(serverRole);

  const fullName = getPatientFullName(patient);
  const initials = getPatientInitials(patient);
  const age = getPatientAge(patient.birthDate);
  const canEdit = canManageUsers || isAdminOrMain;

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Resumen", icon: <User size={15} /> },
    { key: "history", label: "Historia clínica", icon: <ClipboardList size={15} /> },
    { key: "address", label: "Domicilio", icon: <MapPin size={15} /> },
    { key: "files", label: "Archivos médicos", icon: <Paperclip size={15} /> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-10 space-y-6">
      {/* ── Breadcrumb + acciones ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/patients"
            className="p-2 border border-border-default rounded-xl text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Pacientes</span>
              <ChevronRight size={14} className="text-text-disabled" />
              <span className="text-sm text-text-primary font-medium">{fullName}</span>
            </div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight mt-0.5">Expediente clínico</h2>
          </div>
        </div>

        {canEdit && (
          <Link
            href={`/admin/patients/${patient.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm font-medium text-text-primary hover:bg-bg-subtle transition-colors"
          >
            <Pencil size={14} />
            Editar datos
          </Link>
        )}
      </div>

      {/* ── Hero card ── */}
      <PatientHeroCard patient={patient} fullName={fullName} initials={initials} age={age} />

      {/* ── Tabs ── */}
      <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden">
        {/* Tab nav */}
        <div className="flex border-b border-border-default px-6 pt-4 gap-1 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
                activeTab === tab.key
                  ? "border-brand text-brand"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border-strong",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "overview" && <PatientOverviewTab patient={patient} age={age} />}
          {activeTab === "history" && (
            <PatientMedicalHistoryTab patientId={patient.id} gender={patient.gender} canEdit={canEdit || isDoctor} />
          )}
          {activeTab === "address" && (
            <PatientAddressTab patientId={patient.id} addresses={patient.addresses} canEdit={canEdit} />
          )}
          {activeTab === "files" && <PatientMedicalFilesTab patientId={patient.id} canEdit={canEdit || isDoctor} />}
        </div>
      </div>
    </div>
  );
}

// ── Hero Card ─────────────────────────────────────────────────────────────────

function PatientHeroCard({
  patient,
  fullName,
  initials,
  age,
}: {
  patient: Patient;
  fullName: string;
  initials: string;
  age: number;
}) {
  const clinic = patient.clinics[0]?.clinic;

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden shadow-sm">
      {/* Banda de acento */}
      <div className="h-16 bg-linear-to-r from-brand-gradient-from to-brand-gradient-to relative">
        <div className="absolute top-3 right-4 flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border bg-white/20 backdrop-blur-sm text-white border-white/30">
            {patient.isActive ? "● Activo" : "○ Inactivo"}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-5">
        {/* Avatar */}
        <div className="relative sm:absolute sm:left-6 shrink-0 z-10 -mt-8 sm:mt-0 sm:top-auto">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white text-2xl font-bold border-4 border-bg-surface shadow-lg">
            {initials}
          </div>
        </div>

        <div className="w-full sm:pl-28 text-center sm:text-left mt-2 sm:mt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-text-primary">{fullName}</h3>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-1">
                <span className="text-sm text-text-secondary">
                  {age} años · {GENDER_LABELS[patient.gender]}
                </span>
                {patient.curp && <span className="text-[11px] font-mono text-text-disabled">CURP: {patient.curp}</span>}
              </div>
            </div>

            {/* Badges clínicos */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {patient.bloodType && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  <Droplets size={12} />
                  {BLOOD_TYPE_LABELS[patient.bloodType]}
                </span>
              )}
              {clinic && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-bg-subtle text-text-secondary border border-border-default">
                  <Building2 size={12} />
                  {clinic.name}
                </span>
              )}
            </div>
          </div>

          {/* Datos de contacto inline */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 pt-4 border-t border-border-default">
            <span className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Phone size={12} className="text-text-disabled" />
              {patient.phone}
            </span>
            {patient.email && (
              <span className="flex items-center gap-1.5 text-sm text-text-secondary">
                <Mail size={12} className="text-text-disabled" />
                {patient.email}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-sm text-text-secondary">
              <Calendar size={12} className="text-text-disabled" />
              Nació el{" "}
              {new Date(patient.birthDate).toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────

function PatientOverviewTab({ patient, age }: { patient: Patient; age: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {/* Datos personales */}
      <InfoCard title="Datos personales" icon={<User size={14} />} accentColor="var(--color-brand)">
        <FieldRow label="Nombre completo" value={getPatientFullName(patient)} />
        <FieldRow
          label="Fecha nacimiento"
          value={new Date(patient.birthDate).toLocaleDateString("es-MX", {
            timeZone: "UTC",
          })}
        />
        <FieldRow label="Edad" value={`${age} años`} />
        <FieldRow label="Género" value={GENDER_LABELS[patient.gender]} />
        <FieldRow label="CURP" value={patient.curp} mono />
        <FieldRow label="Estado civil" value={patient.maritalStatus ? MARITAL_STATUS_LABELS[patient.maritalStatus] : null} />
        <FieldRow label="Ocupación" value={patient.occupation} />
        <FieldRow label="Escolaridad" value={patient.educationLevel ? EDUCATION_LABELS[patient.educationLevel] : null} />
      </InfoCard>

      {/* Datos clínicos */}
      <InfoCard title="Datos clínicos" icon={<Activity size={14} />} accentColor="#e53e3e">
        <FieldRow
          label="Grupo sanguíneo"
          value={patient.bloodType ? BLOOD_TYPE_LABELS[patient.bloodType] : null}
          highlight={!!patient.bloodType}
        />
        <FieldRow
          label="Historia clínica"
          value={patient.medicalHistory ? "Registrada" : "Pendiente (primera consulta)"}
          highlight={!!patient.medicalHistory}
        />
      </InfoCard>

      {/* Contacto de emergencia */}
      <InfoCard title="Contacto de emergencia" icon={<AlertTriangle size={14} />} accentColor="#d97706">
        <FieldRow label="Nombre" value={patient.emergencyContactName} />
        <FieldRow label="Parentesco" value={patient.emergencyContactRelation} />
        <FieldRow label="Teléfono" value={patient.emergencyContactPhone} />
      </InfoCard>
    </div>
  );
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function InfoCard({
  title,
  icon,
  accentColor,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-bg-base rounded-2xl border border-border-default overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: accentColor }} />
        <span className="pl-2" style={{ color: accentColor }}>
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
      </div>
      <div className="divide-y divide-border-default/50">{children}</div>
    </div>
  );
}

function FieldRow({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between px-4 py-2.5 group hover:bg-bg-surface/50 transition-colors">
      <span className="text-xs font-medium text-text-secondary shrink-0 w-32 pt-0.5">{label}</span>
      <span
        className={cn(
          "text-right text-sm min-w-0",
          mono ? "font-mono text-xs text-text-secondary tracking-wider" : "",
          highlight ? "text-text-primary font-semibold" : "text-text-primary",
          !value ? "text-text-disabled italic" : "",
        )}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}
