import type { LucideIcon } from "lucide-react";

export type KpiColor = "blue" | "emerald" | "amber" | "red";

export interface KpiStat {
  label: string;
  value: number;
  icon: LucideIcon;
  color: KpiColor;
  sub?: string;
}
