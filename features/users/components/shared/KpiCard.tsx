"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import type { KpiColor } from "@shared/types/stats.types";

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: KpiColor;
  sub?: string;
  className?: string;
}

// Variantes de color usando la paleta del sistema MediSys
const COLOR_VARIANTS: Record<KpiColor, { icon: string; value: string }> = {
  blue: {
    icon: "text-[#7f77dd] bg-[#7f77dd]/10 border-[#7f77dd]/20 dark:bg-[#7f77dd]/15",
    value: "text-text-primary",
  },
  emerald: {
    icon: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
    value: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    icon: "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
    value: "text-amber-600 dark:text-amber-400",
  },
  red: {
    icon: "text-red-500 bg-red-500/8 border-red-500/15 dark:text-red-400",
    value: "text-red-500 dark:text-red-400",
  },
};

export function KpiCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  sub,
  className,
}: KpiCardProps) {
  const variant = COLOR_VARIANTS[color];

  return (
    <Card
      className={cn(
        "overflow-hidden border-border-default bg-bg-surface shadow-none",
        "hover:shadow-[0_4px_20px_rgba(92,74,123,0.08)] transition-shadow duration-200",
        className
      )}
    >
      <CardContent className="">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider truncate">
              {label}
            </p>
            <p
              className={cn(
                "text-[32px] font-bold tracking-tight leading-none font-heading",
                // Color neutral para "Total" (no distrae), color semántico para el resto
                color === "blue" ? "text-text-primary" : variant.value
              )}
            >
              {value}
            </p>
            {sub && (
              <p className="text-xs text-text-muted font-medium">{sub}</p>
            )}
          </div>

          <div
            className={cn(
              "p-3 rounded-2xl border shrink-0 transition-colors",
              variant.icon
            )}
          >
            <Icon size={22} strokeWidth={1.8} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
