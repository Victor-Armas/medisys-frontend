export type PhysicalActivityValue = "SEDENTARY" | "OCCASIONAL" | "MODERATE" | "FREQUENT" | "INTENSE" | "PRO";

export interface PhysicalActivityOption {
  id: string;
  category: string;
  label: string;
  value: PhysicalActivityValue;
}

export const PHYSICAL_ACTIVITY_OPTIONS: PhysicalActivityOption[] = [
  {
    id: "pa_001",
    category: "Sedentario",
    label: "Sedentario (sin actividad física regular)",
    value: "SEDENTARY",
  },
  {
    id: "pa_002",
    category: "Ocasional",
    label: "Ocasional (1–2 veces/semana)",
    value: "OCCASIONAL",
  },
  {
    id: "pa_003",
    category: "Moderado",
    label: "Moderado (3–4 veces/semana)",
    value: "MODERATE",
  },
  {
    id: "pa_004",
    category: "Frecuente",
    label: "Frecuente (5–6 veces/semana)",
    value: "FREQUENT",
  },
  {
    id: "pa_005",
    category: "Intenso",
    label: "Intenso (entrenamiento diario)",
    value: "INTENSE",
  },
  {
    id: "pa_006",
    category: "Profesional",
    label: "Deportista profesional / alto rendimiento",
    value: "PRO",
  },
];
