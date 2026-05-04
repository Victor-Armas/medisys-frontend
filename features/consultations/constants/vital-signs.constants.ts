export interface VitalSignRange {
  label: string;
  unit: string;
  low?: number;
  high?: number;
  criticalLow?: number;
  criticalHigh?: number;
  warningMessage: (value: number) => string;
  criticalMessage?: (value: number) => string;
}

export const VITAL_SIGN_RANGES = {
  bloodPressureSystolic: {
    label: "T.A. sistólica",
    unit: "mmHg",
    criticalLow: 80,
    low: 90,
    high: 140,
    criticalHigh: 180,
    warningMessage: (v: number) =>
      v > 140 ? `Presión sistólica elevada (${v} mmHg)` : `Presión sistólica por debajo de rango (${v} mmHg)`,
    criticalMessage: (v: number) =>
      v >= 180
        ? `Presión sistólica significativamente elevada (${v} mmHg)`
        : `Presión sistólica significativamente baja (${v} mmHg)`,
  },
  bloodPressureDiastolic: {
    label: "T.A. diastólica",
    unit: "mmHg",
    criticalLow: 50,
    low: 60,
    high: 90,
    criticalHigh: 120,
    warningMessage: (v: number) => (v > 90 ? `Presión diastólica elevada (${v} mmHg)` : `Presión diastólica baja (${v} mmHg)`),
    criticalMessage: (v: number) =>
      v >= 120
        ? `Presión diastólica significativamente elevada (${v} mmHg)`
        : `Presión diastólica significativamente baja (${v} mmHg)`,
  },
  heartRateBpm: {
    label: "Frecuencia cardíaca",
    unit: "lpm",
    criticalLow: 40,
    low: 60,
    high: 100,
    criticalHigh: 150,
    warningMessage: (v: number) =>
      v > 100 ? `Frecuencia cardíaca elevada (${v} lpm)` : `Frecuencia cardíaca por debajo de rango (${v} lpm)`,
    criticalMessage: (v: number) =>
      v >= 150
        ? `Frecuencia cardíaca significativamente elevada (${v} lpm)`
        : `Frecuencia cardíaca significativamente baja (${v} lpm)`,
  },
  respiratoryRate: {
    label: "Frecuencia respiratoria",
    unit: "rpm",
    criticalLow: 8,
    low: 12,
    high: 20,
    criticalHigh: 30,
    warningMessage: (v: number) =>
      v > 20 ? `Frecuencia respiratoria elevada (${v} rpm)` : `Frecuencia respiratoria por debajo de rango (${v} rpm)`,
    criticalMessage: (v: number) =>
      v >= 30
        ? `Frecuencia respiratoria significativamente elevada (${v} rpm)`
        : `Frecuencia respiratoria significativamente baja (${v} rpm)`,
  },
  temperatureC: {
    label: "Temperatura",
    unit: "°C",
    criticalLow: 35.0,
    low: 36.0,
    high: 37.5,
    criticalHigh: 39.5,
    warningMessage: (v: number) => (v > 37.5 ? `Temperatura elevada (${v} °C)` : `Temperatura por debajo de rango (${v} °C)`),
    criticalMessage: (v: number) =>
      v >= 39.5 ? `Temperatura significativamente elevada (${v} °C)` : `Temperatura significativamente baja (${v} °C)`,
  },
  oxygenSaturation: {
    label: "SpO₂",
    unit: "%",
    criticalLow: 90,
    low: 95,
    warningMessage: (v: number) => `Saturación baja (${v}%)`,
    criticalMessage: (v: number) => `Saturación significativamente baja (${v}%)`,
  },
  bmi: {
    label: "IMC",
    unit: "kg/m²",
    criticalLow: 16,
    low: 18.5,
    high: 25,
    criticalHigh: 40,
    warningMessage: (v: number) =>
      v >= 25 ? (v >= 30 ? `Obesidad (IMC ${v})` : `Sobrepeso (IMC ${v})`) : `Bajo peso (IMC ${v})`,
    criticalMessage: (v: number) => (v >= 40 ? `Obesidad mórbida (IMC ${v})` : `Desnutrición severa (IMC ${v})`),
  },
} as const;

export type VitalSignRangeKey = keyof typeof VITAL_SIGN_RANGES;

export type AlertSeverity = "warning" | "critical";

export interface VitalSignAlert {
  field: string;
  label: string;
  severity: AlertSeverity;
  message: string;
}

// ── BMI categories ────────────────────────────────────────────────────────────

export const getBmiCategory = (bmi: number): { label: string; color: string } => {
  if (bmi < 18.5) return { label: "Bajo peso", color: "text-blue-500" };
  if (bmi < 25) return { label: "Normal", color: "text-emerald-500" };
  if (bmi < 30) return { label: "Sobrepeso", color: "text-amber-500" };
  if (bmi < 40) return { label: "Obesidad", color: "text-orange-500" };
  return { label: "Obesidad mórbida", color: "text-red-600" };
};

// ── Consultation type labels ──────────────────────────────────────────────────

export const CONSULTATION_TYPE_LABELS: Record<string, string> = {
  FIRST_VISIT: "Primera vez",
  FOLLOW_UP: "Seguimiento",
  URGENT: "Urgencia",
  ROUTINE: "Revisión rutina",
  PROCEDURE: "Procedimiento",
};

export const getVitalStatusColor = (key: string, value: number | string | undefined | null) => {
  if (value == null || value === "") return "text-encabezado";

  if (key === "bloodPressure" && typeof value === "string") {
    const [sysStr, diaStr] = value.split("/");
    const sys = Number(sysStr);
    const dia = Number(diaStr);

    if (isNaN(sys) || isNaN(dia)) return "text-encabezado";

    const sysRange = VITAL_SIGN_RANGES.bloodPressureSystolic;
    const diaRange = VITAL_SIGN_RANGES.bloodPressureDiastolic;

    const isCritical =
      sys >= sysRange.criticalHigh! ||
      sys <= sysRange.criticalLow! ||
      dia >= diaRange.criticalHigh! ||
      dia <= diaRange.criticalLow!;
    const isWarning = sys > sysRange.high! || sys < sysRange.low! || dia > diaRange.high! || dia < diaRange.low!;

    if (isCritical) return "text-negative-text font-bold";
    if (isWarning) return "text-wairning-text font-bold";
    return "text-encabezado font-bold";
  }

  const range = VITAL_SIGN_RANGES[key as VitalSignRangeKey];
  if (!range) return "text-encabezado font-bold";

  const num = Number(value);
  if (isNaN(num)) return "text-encabezado font-bold";

  // Verificamos de forma segura si la propiedad existe en el rango actual
  const criticalHigh = "criticalHigh" in range ? (range.criticalHigh as number) : undefined;
  const criticalLow = "criticalLow" in range ? (range.criticalLow as number) : undefined;
  const high = "high" in range ? (range.high as number) : undefined;
  const low = "low" in range ? (range.low as number) : undefined;

  if ((criticalHigh !== undefined && num >= criticalHigh) || (criticalLow !== undefined && num <= criticalLow)) {
    return "text-negative-text font-bold";
  }
  if ((high !== undefined && num >= high) || (low !== undefined && num <= low)) {
    return "text-wairning-text font-bold";
  }

  return "text-encabezado font-bold";
};

export const getVitalMessages = (key: string, value: number | string | undefined | null) => {
  if (value == null || value === "") return [];
  const messages: { text: string; color: string }[] = [];

  if (key === "bloodPressure" && typeof value === "string") {
    const [sysStr, diaStr] = value.split("/");
    const sys = Number(sysStr);
    const dia = Number(diaStr);

    if (!isNaN(sys)) {
      const sysRange = VITAL_SIGN_RANGES.bloodPressureSystolic;
      if ((sysRange.criticalHigh && sys >= sysRange.criticalHigh) || (sysRange.criticalLow && sys <= sysRange.criticalLow)) {
        if (sysRange.criticalMessage) messages.push({ text: sysRange.criticalMessage(sys), color: "text-negative-text" });
      } else if ((sysRange.high && sys >= sysRange.high) || (sysRange.low && sys <= sysRange.low)) {
        messages.push({ text: sysRange.warningMessage(sys), color: "text-wairning-text" });
      }
    }

    if (!isNaN(dia)) {
      const diaRange = VITAL_SIGN_RANGES.bloodPressureDiastolic;
      if ((diaRange.criticalHigh && dia >= diaRange.criticalHigh) || (diaRange.criticalLow && dia <= diaRange.criticalLow)) {
        if (diaRange.criticalMessage) messages.push({ text: diaRange.criticalMessage(dia), color: "text-negative-text" });
      } else if ((diaRange.high && dia >= diaRange.high) || (diaRange.low && dia <= diaRange.low)) {
        messages.push({ text: diaRange.warningMessage(dia), color: "text-wairning-text" });
      }
    }
    return messages;
  }

  const range = VITAL_SIGN_RANGES[key as VitalSignRangeKey];
  if (!range) return [];

  const num = Number(value);
  if (isNaN(num)) return [];

  const criticalHigh = "criticalHigh" in range ? (range.criticalHigh as number) : undefined;
  const criticalLow = "criticalLow" in range ? (range.criticalLow as number) : undefined;
  const high = "high" in range ? (range.high as number) : undefined;
  const low = "low" in range ? (range.low as number) : undefined;

  if ((criticalHigh !== undefined && num >= criticalHigh) || (criticalLow !== undefined && num <= criticalLow)) {
    if (range.criticalMessage) messages.push({ text: range.criticalMessage(num), color: "text-negative-text" });
  } else if ((high !== undefined && num >= high) || (low !== undefined && num <= low)) {
    messages.push({ text: range.warningMessage(num), color: "text-wairning-text" });
  }

  return messages;
};
