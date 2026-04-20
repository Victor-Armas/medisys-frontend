// features/users/components/SpecialtyFooter.tsx
"use client";

import { Activity, HeartPulse, Brain, Bone, Baby, Stethoscope, Eye, Ear } from "lucide-react";
import { cn } from "@/shared/lib/utils";

// 1. Diccionario (Map) de Especialidades -> Componente de Icono
// O(1) en búsqueda y 100% tipado. Cero 'any'.
const SPECIALTY_ICONS: Record<string, React.ElementType> = {
  Cardiología: HeartPulse,
  Neurología: Brain,
  Traumatología: Bone,
  Ortopedia: Bone,
  Pediatría: Baby,
  Oftalmología: Eye,
  Otorrinolaringología: Ear,
  "Medicina General": Stethoscope,
  "Cirujana General": Stethoscope,
  Cirugía: Stethoscope,
};

interface SpecialtyFooterProps {
  specialty: string;
  // Permitimos inyectar clases para reaccionar al hover del componente padre (group-hover)
  iconClassName?: string;
}

export function SpecialtyFooter({ specialty, iconClassName }: SpecialtyFooterProps) {
  // 2. Resolución dinámica: Si la especialidad no está en el map, usamos 'Activity' como fallback.
  const IconComponent = SPECIALTY_ICONS[specialty] || Activity;

  return (
    <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-2 text-gray-500">
      <IconComponent size={14} className={cn("shrink-0 transition-colors duration-200", iconClassName)} strokeWidth={2} />
      <span className="text-[11.5px] font-medium truncate">{specialty}</span>
    </div>
  );
}
