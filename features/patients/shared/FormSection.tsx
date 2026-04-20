"use client";
import { cn } from "@/shared/lib/utils";
import { Activity, AlertTriangle, MapPin, Phone, User, Stethoscope, Droplet, Users } from "lucide-react";

type SectionIcon = "user" | "phone" | "map" | "alert" | "clinical" | "stethoscope" | "droplet" | "users";

interface Props {
  title: string;
  subtitle?: string;
  icon: SectionIcon;
  required?: boolean;
  children: React.ReactNode;
}

// Paleta de colores profesional para clínica - tonos médicos elegantes
const ICONS: Record<SectionIcon, React.ReactNode> = {
  user: <User size={18} strokeWidth={1.75} />,
  phone: <Phone size={18} strokeWidth={1.75} />,
  map: <MapPin size={18} strokeWidth={1.75} />,
  alert: <AlertTriangle size={18} strokeWidth={1.75} />,
  clinical: <Activity size={18} strokeWidth={1.75} />,
  stethoscope: <Stethoscope size={18} strokeWidth={1.75} />,
  droplet: <Droplet size={18} strokeWidth={1.75} />,
  users: <Users size={18} strokeWidth={1.75} />,
};

// Colores médicos profesionales: azules, verdes, grises elegantes
const ACCENT: Record<SectionIcon, { bg: string; text: string; border: string; light: string }> = {
  user: {
    bg: "bg-slate-700",
    text: "text-slate-700",
    border: "border-slate-700",
    light: "bg-slate-100",
  },
  users: {
    bg: "bg-indigo-600",
    text: "text-indigo-600",
    border: "border-indigo-600",
    light: "bg-indigo-50",
  },
  phone: {
    bg: "bg-emerald-600",
    text: "text-emerald-600",
    border: "border-emerald-600",
    light: "bg-emerald-50",
  },
  map: {
    bg: "bg-sky-600",
    text: "text-sky-600",
    border: "border-sky-600",
    light: "bg-sky-50",
  },
  alert: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    border: "border-amber-500",
    light: "bg-amber-50",
  },
  clinical: {
    bg: "bg-rose-500",
    text: "text-rose-500",
    border: "border-rose-500",
    light: "bg-rose-50",
  },
  stethoscope: {
    bg: "bg-teal-600",
    text: "text-teal-600",
    border: "border-teal-600",
    light: "bg-teal-50",
  },
  droplet: {
    bg: "bg-red-600 dark:bg-red-500",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-300 dark:border-red-900/50",
    light: "bg-red-50 dark:bg-red-950/30",
  },
};

export function FormSection({ title, subtitle, icon, required, children }: Props) {
  const colors = ACCENT[icon];
  const isDroplet = icon === "droplet";

  return (
    <div
      className={cn(
        "rounded-md border overflow-hidden shadow-sm transition-all duration-200",
        // Usamos las variables globales para el fondo y borde
        "bg-[--color-interior] border-slate-200 dark:border-white/5 hover:shadow-md",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-4 px-6 py-3",
          // Si no es droplet, ponemos la línea divisoria sutil
          !isDroplet && "border-b border-slate-100 dark:border-white/5",
          // Aplicamos el color light de la sección (vía variables o props)
          colors.light,
        )}
      >
        {/* Icono con fondo sólido */}
        <div className={cn("flex items-center justify-center w-8 h-8 rounded-lg text-white shadow-sm", colors.bg)}>
          {ICONS[icon]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-[--color-encabezado]">{title}</h3>
            {required && (
              <span
                className={cn(
                  "inline-flex items-center px-1.5 rounded text-[10px] font-bold border uppercase",
                  colors.text,
                  colors.border,
                  "bg-white/50 dark:bg-black/20",
                )}
              >
                Requerido
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-[--color-subtitulo] leading-relaxed">{subtitle}</p>}
        </div>
      </div>

      {/* Content - Lógica de Droplet para Dark Mode */}
      <div
        className={cn(
          "px-6 pb-6",
          isDroplet
            ? "bg-linear-to-b from-red-50 to-red-100/40 dark:from-red-950/20 dark:to-transparent"
            : "bg-[--color-interior] py-6",
        )}
      >
        {children}
      </div>
    </div>
  );
}
