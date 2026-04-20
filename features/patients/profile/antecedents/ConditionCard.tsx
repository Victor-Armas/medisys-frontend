"use client";

import { useState } from "react";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/ui/toaster";
import { useUpdateConditionNotes } from "@/features/patients/hooks/useConditions";
import { CONDITION_CATEGORY_COLORS } from "@/features/patients/constants/conditions.constants";
import type { ConditionCategory, PatientCondition } from "@/features/patients/types/patient.types";

interface Props {
    condition: PatientCondition;
    patientId: string;
    canEdit: boolean;
    category: ConditionCategory;
    onRemove: () => void;
}

export function ConditionCard({ condition, patientId, canEdit, category, onRemove }: Props) {
    const isSurgeryOrTrauma = category === "SURGERY" || category === "TRAUMA" || category === "HOSPITALIZATION";
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteText, setNoteText] = useState(condition.notes || "");
    const [isSaving, setIsSaving] = useState(false);
    const updateNotesApi = useUpdateConditionNotes();

    const dateStr = condition.createdAt
        ? new Date(condition.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "";

    async function handleSaveNote() {
        if (noteText.trim() === (condition.notes || "")) {
            setIsEditingNote(false);
            return;
        }

        setIsSaving(true);
        try {
            await updateNotesApi.mutateAsync({
                patientId,
                conditionId: condition.id,
                notes: noteText.trim() || null,
            });
            setIsEditingNote(false);
        } catch {
            notify.error("Error al guardar nota");
        } finally {
            setIsSaving(false);
        }
    }

    if (isSurgeryOrTrauma) {
        const isSurgery = category === "SURGERY";
        const colorClass = CONDITION_CATEGORY_COLORS[category] ?? "bg-gray-300";

        return (
            <div className="relative group flex items-start justify-between p-3.5 bg-fondo-inputs shadow rounded-sm overflow-hidden shrink-0">
                <div className={cn("absolute left-0 top-0 bottom-0 w-[5px]", colorClass)} />

                <div className="flex flex-col pl-3">
                    <span className="text-[9px] font-bold text-principal uppercase tracking-wider mb-1">
                        {isSurgery ? "CIRUGÍA REALIZADA" : category === "TRAUMA" ? "LESIÓN REGISTRADA" : "HOSPITALIZACIÓN"}
                    </span>
                    <span className="text-[13px] font-bold text-encabezado leading-snug pr-4">{condition.description}</span>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] text-subtitulo mt-1">{dateStr}</span>
                    {canEdit && (
                        <button
                            type="button"
                            onClick={onRemove}
                            className="opacity-0 group-hover:opacity-100 p-1 text-subtitulo hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="relative group flex justify-between p-3.5 bg-fondo-inputs rounded-sm border border-transparent shrink-0">
            <div className="flex flex-col flex-1 mr-4 overflow-hidden">
                <span className="text-[13px] font-bold text-encabezado leading-snug mb-1">{condition.description}</span>

                {isEditingNote ? (
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            autoFocus
                            className="flex-1 text-[10px] bg-interior px-2 py-1 rounded outline-none focus:ring-1 focus:ring-principal uppercase tracking-wider text-subtitulo placeholder:text-subtitulo"
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveNote();
                                if (e.key === "Escape") {
                                    setIsEditingNote(false);
                                    setNoteText(condition.notes || "");
                                }
                            }}
                            disabled={isSaving}
                            placeholder="Escribe una nota..."
                        />
                        <button
                            onClick={handleSaveNote}
                            disabled={isSaving}
                            className="hover:text-positive-text-hover hover:bg-positive-hover bg-positive text-positive-text p-1 rounded transition-colors"
                        >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                        </button>
                        <button
                            onClick={() => {
                                setIsEditingNote(false);
                                setNoteText(condition.notes || "");
                            }}
                            disabled={isSaving}
                            className="hover:text-white hover:bg-negative-hover bg-negative text-negative-text p-1 rounded transition-colors"
                        >
                            <X size={12} strokeWidth={3} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 group/note mt-1">
                        {condition.notes ? (
                            <span
                                className="text-[9px] font-bold text-principal uppercase tracking-wider truncate w-full"
                                title={condition.notes}
                            >
                                {condition.notes}
                            </span>
                        ) : (
                            <button
                                onClick={() => setIsEditingNote(true)}
                                disabled={!canEdit}
                                className={cn(
                                    "text-[9px] font-bold uppercase tracking-wider text-left",
                                    canEdit ? "text-principal hover:underline" : "text-subtitulo",
                                )}
                            >
                                {canEdit ? "+ AGREGAR NOTA (OPCIONAL)" : "SIN NOTAS"}
                            </button>
                        )}
                        {condition.notes && canEdit && (
                            <button
                                onClick={() => setIsEditingNote(true)}
                                className="opacity-0 group-hover:opacity-100 text-wairning-text bg-wairning rounded-full p-1 hover:bg-wairning-hover hover:text-wairning-text-hover transition-all"
                            >
                                <Pencil size={10} strokeWidth={2.5} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {canEdit && (
                <div className="shrink-0 flex items-start">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="opacity-0 group-hover:opacity-100 p-1 text-subtitulo hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
