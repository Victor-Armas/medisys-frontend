"use client";

import { Edit, Hospital } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Clinic } from "../..";

interface Props {
  clinic: Clinic;
  canManage: boolean;
  onEdit: (clinic: Clinic) => void;
  onToggleActive: (id: string) => void;
}

export function ClinicDetailHeader({ clinic, canManage, onEdit, onToggleActive }: Props) {
  return (
    <div className="bg-fondo-inputs shadow-lg rounded-md px-4 md:px-8 py-3.5 sticky top-0 z-40">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <Hospital className="bg-inner-principal text-principal rounded-sm p-2 shrink-0" size={35} />
          <div>
            <h1 className="text-lg font-bold text-encabezado tracking-tight">{clinic.name}</h1>
            {clinic.address ? (
              <p className="text-xs text-subtitulo">
                {[clinic.address, clinic.city].filter(Boolean).join(", ")}
                {clinic.rfc && ` · RFC: ${clinic.rfc}`}
                {clinic.professionalLicense && ` · Cédula: ${clinic.professionalLicense}`}
              </p>
            ) : (
              <p className="text-xs text-subtitulo ">Sin dirección registrada</p>
            )}
          </div>
        </div>

        {canManage && (
          <div className="flex items-center gap-3 shrink-0 self-end md:self-auto w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-subtitulo/10">
            <button
              onClick={() => onEdit(clinic)}
              className="flex items-center gap-2 text-xs text-wairning-text shadow-lg bg-wairning py-1 px-3 rounded-md transition-colors"
            >
              <Edit size={13} strokeWidth={2} />
              Editar
            </button>
            <div className="hidden md:block border border-subtitulo/30 py-3 mx-2" />
            <button
              onClick={() => onToggleActive(clinic.id)}
              className={cn(
                "px-2 py-1 rounded-sm text-xs font-medium transition-colors shadow-lg ",
                clinic.isActive
                  ? "text-positive-text bg-positive hover:bg-positive-hover"
                  : "text-negative-text bg-negative hover:bg-negative-hover ",
              )}
            >
              {clinic.isActive ? "Activado" : "Desactivado"}
            </button>
          </div>
        )}

        {!canManage && (
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn("w-2 h-2 rounded-full", clinic.isActive ? "bg-positive-text" : "bg-negative-text")} />
            <span className={cn("text-sm font-medium", clinic.isActive ? "text-positive-text " : "text-negative-text")}>
              {clinic.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
