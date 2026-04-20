"use client";
import React from "react";
import { cn } from "@/shared/lib/utils";
import {
  ClipboardPlus,
  Contact,
  Cross,
  Dna,
  Home,
  Hospital,
  Map,
  Megaphone,
  Signature,
  Sparkle,
  Stethoscope,
  Users2,
} from "lucide-react";
import type { AutoSaveStatus } from "@/shared/hooks/useAutoSave";

// Tipos disponibles
export type HistorySectionIcon =
  | "clipuser"
  | "cross"
  | "dna"
  | "spark"
  | "home"
  | "emergency"
  | "contact"
  | "social"
  | "professional"
  | "address"
  | "signature"
  | "hospital";

interface Props {
  title: string;
  subtitle?: string;
  icon: HistorySectionIcon;
  className?: string;
  children: React.ReactNode;

  // ── Card-level editing (opt-in) ──────────────────────────────────────────────
  /** Habilita el toolbar contextual de edición en el header del card.
   *  Default: false → backward compatible, no cambia nada. */
  enableSectionEditing?: boolean;
  /** Si existe un registro en BD. Requerido cuando enableSectionEditing=true. */
  hasHistory?: boolean;
  /** Si el modo edición está activo para esta sección. */
  isEditActive?: boolean;
  /** Si el usuario tiene permiso de editar. */
  hasEditPermission?: boolean;
  isPending?: boolean;
  isDirty?: boolean;
  saveStatus?: AutoSaveStatus;
  lastSavedAt?: Date | null;
  onEnableEditing?: () => void;
  onCancel?: () => void;
  headerAction?: React.ReactNode;
}

// Diccionario de Iconos
const ICONS: Record<HistorySectionIcon, React.ReactNode> = {
  clipuser: <ClipboardPlus size={20} strokeWidth={2} />,
  cross: <Cross size={20} strokeWidth={3} />,
  dna: <Dna size={20} strokeWidth={2} />,
  spark: <Sparkle size={20} strokeWidth={2} />,
  home: <Home size={20} strokeWidth={2} />,
  emergency: <Megaphone size={20} strokeWidth={2} />,
  contact: <Contact size={20} strokeWidth={2} />,
  social: <Users2 size={20} strokeWidth={2} />,
  professional: <Stethoscope size={20} strokeWidth={2} />,
  address: <Map size={20} strokeWidth={2} />,
  signature: <Signature size={20} strokeWidth={2} />,
  hospital: <Hospital size={20} strokeWidth={2} />,
};

// Diccionario de estilos por icono
const ACCENT: Record<HistorySectionIcon, { bg: string; text: string; fondoIcon: string; colorIcon: string }> = {
  clipuser: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-principal",
    fondoIcon: "bg-[#F8D8FF]",
  },
  cross: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-indigo-600",
    fondoIcon: "bg-indigo-100",
  },
  dna: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-principal",
    fondoIcon: "bg-[#FCE7F3]",
  },
  spark: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-principal",
    fondoIcon: "bg-[#FCE7F3]",
  },
  home: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-secundario",
    fondoIcon: "bg-inner-secundario",
  },
  emergency: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-wairning-text",
    fondoIcon: "bg-wairning",
  },
  contact: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-positive-text",
    fondoIcon: "bg-positive",
  },
  social: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-principal",
    fondoIcon: "bg-inner-principal",
  },
  professional: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-secundario",
    fondoIcon: "bg-inner-secundario",
  },
  signature: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-positive-text",
    fondoIcon: "bg-positive",
  },
  address: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-negative-text",
    fondoIcon: "bg-negative",
  },
  hospital: {
    text: "text-encabezado",
    bg: "bg-interior",
    colorIcon: "text-wairning-text",
    fondoIcon: "bg-wairning",
  },
};

export function HistorySection({
  title,
  icon,
  subtitle,
  children,
  headerAction,
  // Section editing — all optional, default = false
  className,
}: Props) {
  const theme = ACCENT[icon];

  return (
    <div
      className={cn(
        "rounded-2xl border-2 bg-interior border-interior shadow-sm transition-all hover:shadow-md flex flex-col",
        theme.bg,
        className,
      )}
    >
      {/* 1. HEADER (Solo barra superior) */}
      <div className="flex items-center rounded-t-xl bg-interior justify-between px-5 py-3.5 border-b border-interior/50">
        {/* Lado Izquierdo: Icono y Título */}
        <div className="flex items-center gap-3 pl-1">
          <span className={cn("shrink-0 opacity-90 p-1.5 rounded-sm", theme.fondoIcon, theme.colorIcon)}>{ICONS[icon]}</span>
          <h4 className={cn("text-[13px] font-extrabold uppercase tracking-widest", theme.text)}>{title}</h4>
        </div>

        {/* Lado Derecho: Acciones y Toolbar (Aquí inyectamos los botones del calendario) */}
        <div className="flex items-center gap-3">{headerAction}</div>
      </div>

      {/* 2. SUBTITLE opcional (Independiente, debajo del header) */}
      {subtitle && <div className="px-6 pt-3 text-[11px] text-slate-400 font-medium">{subtitle}</div>}

      {/* 3. CONTENIDO (Independiente, con flex-grow) */}
      {/* Añadí un pt-4 para que el contenido respire respecto al header */}
      <div className="px-6 pb-6 pt-4 bg-interior rounded-b-xl grow flex flex-col h-full">{children}</div>
    </div>
  );
}
