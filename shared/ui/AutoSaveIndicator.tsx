// shared/ui/AutoSaveIndicator.tsx
"use client";
import { CheckCircle2, CloudOff, Loader2 } from "lucide-react";
import type { AutoSaveStatus } from "@/shared/hooks/useAutoSave";

interface Props {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
}

export function AutoSaveIndicator({ status, lastSavedAt }: Props) {
  if (status === "idle" && !lastSavedAt) return null;

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium transition-all duration-300">
      {status === "saving" && (
        <>
          <Loader2 size={12} className="animate-spin text-text-secondary" />
          <span className="text-text-secondary">Guardando borrador…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span className="text-emerald-600 dark:text-emerald-400">
            Borrador guardado
            {lastSavedAt && (
              <span className="ml-1 text-text-disabled">
                {lastSavedAt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </span>
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff size={12} className="text-amber-500" />
          <span className="text-amber-600 dark:text-amber-400">Error al guardar borrador</span>
        </>
      )}
    </div>
  );
}
