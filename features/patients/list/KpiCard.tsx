import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  label: string;
  value: number;
  color: "blue" | "emerald" | "amber";
}

export function KpiCard({ icon, label, value, color }: Props) {
  const colors = {
    blue: {
      icon: "text-secundario bg-inner-secundario",
      card: "bg-gradient-to-br from-secundario/20 to-secundario/40",
    },
    emerald: {
      icon: "text-emerald-600 bg-emerald-500/10 dark:text-emerald-800 dark:bg-emerald-200",
      card: "bg-gradient-to-br from-emerald-100 to-emerald-300 dark:from-emerald-500 dark:to-emerald-700",
    },
    amber: {
      icon: "text-amber-600 bg-amber-500/10 dark:text-amber-800 dark:bg-amber-200",
      card: "bg-gradient-to-br from-amber-50/100 to-amber-300 dark:from-amber-500/100 dark:to-amber-700",
    },
  };

  return (
    <div className={cn("p-4 rounded-2xl flex items-center gap-4 transition-colors", colors[color].card)}>
      <div className={cn("p-3 rounded-2xl shrink-0", colors[color].icon)}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-subtitulo uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-encabezado mt-0.5">{value.toLocaleString("es-MX")}</p>
      </div>
    </div>
  );
}
