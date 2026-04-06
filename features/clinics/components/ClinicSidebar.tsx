"use client";

import { Plus } from "lucide-react";
import type { Clinic } from "../types/clinic.types";
import { ClinicListItem } from "./ClinicListItem";

interface Props {
  clinics: Clinic[];
  activeClinicId?: string;
  onSelect: (clinic: Clinic) => void;
  onAddClinic: () => void;
  onToggleClinic: (id: string) => void;
}

export function ClinicSidebar({ 
  clinics, 
  activeClinicId, 
  onSelect, 
  onAddClinic, 
  onToggleClinic 
}: Props) {
  return (
    <aside className="w-72 shrink-0 border-r border-border-default bg-bg-surface flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Consultorios</h2>
          <p className="text-[11px] text-text-secondary mt-0.5">{clinics.length} registrados</p>
        </div>
        <button
          onClick={onAddClinic}
          className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white hover:bg-brand-hover transition-colors cursor-pointer"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
        {clinics.map((clinic) => (
          <ClinicListItem
            key={clinic.id}
            clinic={clinic}
            toggleClinic={onToggleClinic}
            isSelected={activeClinicId === clinic.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}
