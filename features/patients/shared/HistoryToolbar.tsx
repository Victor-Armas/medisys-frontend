"use client";

import { Check, FileEdit, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AutoSaveIndicator } from "@/shared/ui/AutoSaveIndicator";
import type { AutoSaveStatus } from "@/shared/hooks/useAutoSave";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  /** Whether a history record exists in DB */
  hasHistory: boolean;
  /** Whether the form is currently in edit mode */
  isEditActive: boolean;
  /** Whether the current user has permission to edit */
  hasEditPermission: boolean;
  isPending: boolean;
  isDirty: boolean;
  saveStatus: AutoSaveStatus;
  lastSavedAt: Date | null;
  sectionTitle: string;
  onEnableEditing: () => void;
  onCancel: () => void;
  /** 'standalone' = full wrapper (tab-level), 'inline' = no wrapper (card header).
   *  Default: 'standalone' */
  variant?: "standalone" | "inline";
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Sticky toolbar shown at the top of each medical history tab.
 * Handles: view-only state, edit mode, save/cancel actions, auto-save indicator.
 */
export function HistoryToolbar({
  hasHistory,
  isEditActive,
  hasEditPermission,
  isPending,
  isDirty,
  saveStatus,
  lastSavedAt,
  sectionTitle,
  onEnableEditing,
  onCancel,
  variant = "standalone",
}: Props) {
  const isInline = variant === "inline";
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isInline
          ? "flex-row justify-end"
          : "flex-col sm:flex-row sm:items-center justify-between p-4  border rounded-2xl shadow-sm sticky top-0 z-10",
      )}
    >
      {/* Título + AutoSave — ocultos en inline (el header del card ya tiene título) */}
      {!isInline && (
        <div>
          <h3 className="text-sm font-bold text-encabezado">{sectionTitle}</h3>
          <AutoSaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
        </div>
      )}

      {/* AutoSave indicator inline (compacto, sin título) */}
      {isInline && <AutoSaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />}

      <div className="flex items-center gap-2">
        {/* Habilitar edición — only when viewing existing history */}
        {hasHistory && !isEditActive && hasEditPermission && (
          <button
            type="button"
            onClick={onEnableEditing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border  text-xs font-semibold text-subtitulo hover:text-principal hover:bg-principal hover: transition-all"
          >
            <FileEdit size={14} />
            Habilitar edición
          </button>
        )}

        {/* Cancel + Save — when in edit mode */}
        {isEditActive && (
          <>
            {hasHistory && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-subtitulo hover:text-encabezado transition-colors"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm",
                isDirty && !isPending
                  ? "bg-principal hover:bg-principal-hover hover:shadow-md"
                  : "bg-border-strong cursor-not-allowed opacity-60",
              )}
            >
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Guardar cambios
            </button>
          </>
        )}
      </div>
    </div>
  );
}
