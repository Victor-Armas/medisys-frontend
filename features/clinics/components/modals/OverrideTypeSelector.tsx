"use client";

import { cn } from "@/shared/lib/utils";
import { Ban, Clock, Check, LucideIcon } from "lucide-react";

export type OverrideType = "UNAVAILABLE" | "CUSTOM" | "AVAILABLE";

export const OVERRIDE_TYPES = [
  {
    value: "UNAVAILABLE",
    label: "Día Inhábil",
    description: "No trabajará este día (vacaciones, descanso)",
    icon: Ban,
    color: "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
  },
  {
    value: "CUSTOM",
    label: "Horario Especial",
    description: "Trabajará pero en un horario distinto",
    icon: Clock,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
  },
  {
    value: "AVAILABLE",
    label: "Día Extra",
    description: "Trabajará un día que normalmente es de descanso",
    icon: Check,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  },
] as const;

interface Props {
  selectedType: OverrideType;
  onSelect: (type: OverrideType) => void;
}

export function OverrideTypeSelector({ selectedType, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {OVERRIDE_TYPES.map((typeOption) => {
        const isSelected = selectedType === typeOption.value;
        const Icon = typeOption.icon as LucideIcon;
        return (
          <button
            key={typeOption.value}
            type="button"
            onClick={() => onSelect(typeOption.value as OverrideType)}
            className={cn(
              "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
              isSelected
                ? cn("border-transparent shadow-sm ring-1 ring-inset ring-brand", typeOption.color)
                : "border-border-default bg-bg-subtle hover:bg-bg-base",
            )}
          >
            <div className={cn("p-1.5 rounded-lg shrink-0", isSelected ? "bg-white/50" : "bg-bg-surface")}>
              <Icon size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className={cn("text-xs font-semibold", isSelected ? "text-text-primary" : "text-text-primary")}>{typeOption.label}</p>
              <p className={cn("text-[11px]", isSelected ? "text-text-primary/70" : "text-text-secondary")}>{typeOption.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
