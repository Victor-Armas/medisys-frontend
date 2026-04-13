"use client";
import React from "react";
import { cn } from "@/shared/lib/utils";
import { ClipboardPlus, Cross, Dna } from "lucide-react";

// Tipos disponibles
export type HistorySectionIcon = "clipuser" | "cross" | "dna";

interface Props {
  title: string;
  subtitle?: string;
  icon: HistorySectionIcon;
  children: React.ReactNode;
}

// Diccionario de Iconos
const ICONS: Record<HistorySectionIcon, React.ReactNode> = {
  clipuser: <ClipboardPlus size={20} strokeWidth={2} />,
  cross: <Cross size={20} strokeWidth={3} />,
  dna: <Dna size={20} strokeWidth={2} />,
};

// Diccionario de estilos por icono
const ACCENT: Record<HistorySectionIcon, { bg: string; text: string; accent: string }> = {
  clipuser: {
    text: "text-brand",
    bg: "bg-[#FBFCFD]",
    accent: "bg-brand",
  },
  cross: {
    text: "text-[#784E8B]",
    bg: "bg-[#FBFCFD]",
    accent: "bg-brand",
  },
  dna: {
    text: "text-[#88053C]",
    bg: "bg-[#FBFCFD]",
    accent: "bg-brand",
  },
};

export function HistorySection({ title, icon, subtitle, children }: Props) {
  const theme = ACCENT[icon];

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-gray-100 overflow-hidden bg-white shadow-sm transition-all hover:shadow-md",
        theme.bg,
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-gray-100 relative">
        {/* Barra lateral */}
        <div className="flex items-center bg-[#FBFCFD] gap-3 pl-1">
          {/* Icono */}
          <span className={cn("shrink-0 opacity-90", theme.text)}>{ICONS[icon]}</span>
          {/* Título */}
          <h4 className={cn("text-[12px] font-extrabold uppercase tracking-[0.15em]", theme.text)}>{title}</h4>
        </div>
      </div>
      {/* SUBTITLE opcional */}
      {subtitle && <div className="px-6 pt-3 text-[11px] text-slate-400 font-medium">{subtitle}</div>}

      {/* CONTENIDO */}
      <div className="p-6 bg-[#FFFFFF]">{children}</div>
    </div>
  );
}
