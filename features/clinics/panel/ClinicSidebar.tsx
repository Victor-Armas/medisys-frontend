"use client";

import { Plus } from "lucide-react";
import type { Clinic } from "../types/clinic.types";
import { ClinicListItem } from "./ClinicListItem";

interface Props {
  clinics: Clinic[];
  activeClinicId?: string;
  onSelect: (clinic: Clinic) => void;
  onAddClinic?: () => void;
  onToggleClinic?: (id: string) => void;
}

export function ClinicSidebar({ clinics, activeClinicId, onSelect, onAddClinic, onToggleClinic }: Props) {
  return (
    <aside className="w-60 shrink-0 flex flex-col">
      <div className="flex items-center justify-between pb-5">
        <div>
          <h2 className="text-xs font-semibold text-subtitulo uppercase">Consultorios</h2>
        </div>
        {onAddClinic && (
          <button
            onClick={onAddClinic}
            className="rounded-xl bg-principal p-1 flex items-center justify-center text-white hover:bg-principal-hover transition-colors "
          >
            <Plus size={14} strokeWidth={4} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {clinics.map((clinic) => (
          <ClinicListItem
            key={clinic.id}
            clinic={clinic}
            isSelected={activeClinicId === clinic.id}
            onSelect={onSelect}
            onToggleClinic={onToggleClinic}
          />
        ))}
      </div>
    </aside>
  );
}
