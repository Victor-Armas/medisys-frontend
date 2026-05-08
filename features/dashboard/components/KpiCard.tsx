import { cn } from "@/shared/lib/utils";
import type { LucideIcon } from "lucide-react";

type KpiColor = "purple" | "green" | "red" | "blue" | "amber";

interface KpiColorConfig {
  icon: string;
  bg: string;
  ring: string;
}

const COLOR_MAP: Record<KpiColor, KpiColorConfig> = {
  purple: {
    icon: "text-principal",
    bg: "bg-inner-principal",
    ring: "ring-principal/20",
  },
  green: {
    icon: "text-positive-text",
    bg: "bg-positive",
    ring: "ring-positive-text/20",
  },
  red: {
    icon: "text-negative-text",
    bg: "bg-negative",
    ring: "ring-negative-text/20",
  },
  blue: {
    icon: "text-secundario",
    bg: "bg-inner-secundario",
    ring: "ring-secundario/20",
  },
  amber: {
    icon: "text-wairning-text",
    bg: "bg-wairning",
    ring: "ring-wairning-text/20",
  },
};

interface KpiCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  sub?: string;
  color: KpiColor;
}

export function KpiCard({ icon: Icon, label, value, sub, color }: KpiCardProps) {
  const c = COLOR_MAP[color];

  return (
    <div className={cn("bg-interior rounded-xl p-5 shadow-sm border border-disable/10 ring-1", c.ring)}>
      <div className={cn("w-9 h-9 flex items-center justify-center rounded-xl", c.bg)}>
        <Icon size={17} className={c.icon} strokeWidth={2} />
      </div>
      <p className="text-2xl font-bold text-encabezado mt-3 tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-encabezado mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-subtitulo mt-0.5">{sub}</p>}
    </div>
  );
}
