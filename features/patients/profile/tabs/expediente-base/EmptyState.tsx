"use client";

import { AlertCircle, FileEdit } from "lucide-react";

export default function EmptyState({ canCreate, onStart }: { canCreate: boolean; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4 /50 rounded-3xl border border-dashed mt-10 ">
      <div className="w-16 h-16 rounded-2xl bg-inner-principal flex items-center justify-center text-principal">
        <AlertCircle size={30} />
      </div>
      <div>
        <h3 className="text-base font-bold text-encabezado mb-1">Historia clínica pendiente</h3>
        <p className="text-sm text-subtitulo max-w-sm">
          Este paciente aún no tiene antecedentes registrados. Es necesario completarlos antes de emitir recetas o notas de
          evolución.
        </p>
      </div>
      {canCreate && (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-5 py-2.5 bg-principal text-white text-sm font-semibold rounded-xl hover:bg-principal-hover transition-colors shadow-sm"
        >
          <FileEdit size={15} />
          Iniciar historia clínica
        </button>
      )}
    </div>
  );
}
