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
    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300">
      {status === "saving" && (
        <div className="flex items-center gap-1.5 text-principal animate-pulse">
          <Loader2 size={11} className="animate-spin" />
          <span>Sincronizando…</span>
        </div>
      )}
      {status === "saved" && (
        <div className="flex items-center gap-1.5 text-emerald-500">
          <CheckCircle2 size={11} />
          <span>
            Borrador guardado
            {lastSavedAt && (
              <span className="ml-1 opacity-60 font-mono">
                ({lastSavedAt.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })})
              </span>
            )}
          </span>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-1.5 text-negative-text">
          <CloudOff size={11} />
          <span>Error de conexión</span>
        </div>
      )}
    </div>
  );
}
