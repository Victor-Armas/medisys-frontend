import { Clock } from "lucide-react";
import { SectionCard } from "./shared/SectionCard";

export function UserActivityCard() {
  return (
    <SectionCard title="Actividad reciente" accentColor="#888780">
      <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
          <Clock size={20} className="text-text-disabled" />
        </div>
        <div>
          <p className="text-sm font-medium text-text-secondary">Historial de actividad</p>
          <p className="text-xs text-text-disabled mt-1">Disponible en la Fase 4 del desarrollo</p>
        </div>
      </div>
    </SectionCard>
  );
}
