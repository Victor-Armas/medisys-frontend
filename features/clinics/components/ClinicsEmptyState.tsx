"use client";

import { Home } from "lucide-react";

export function ClinicsEmptyState() {
  return (
    <div className="flex h-full items-center justify-center bg-bg-base px-6">
      <div className="max-w-md w-full border border-border-default rounded-2xl bg-bg-surface shadow-sm p-8 text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-subtle">
          <Home size={22} strokeWidth={1.6} className="text-text-secondary" />
        </div>

        {/* Title */}
        <h2 className="text-base font-semibold text-text-primary">No hay consultorios disponibles</h2>

        {/* Description */}
        <p className="mt-2 text-sm text-text-secondary leading-relaxed">
          Actualmente no tienes consultorios asignados en el sistema. Para configurar disponibilidad médica o gestionar horarios,
          es necesario contar con al menos una asignación activa.
        </p>

        {/* Divider */}
        <div className="my-5 h-px bg-border-default" />

        {/* Secondary info */}
        <p className="text-xs text-text-secondary">Si necesitas acceso, solicita la asignación a un administrador del sistema.</p>
      </div>
    </div>
  );
}
