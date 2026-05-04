import { useMemo } from "react";
import type { VitalSignsValues } from "../schemas/consultation.schema";
import { AlertSeverity, VitalSignAlert, VITAL_SIGN_RANGES } from "../constants/vital-signs.constants";

// ── Helper seguro (FIX TS) ─────────────────────────────────────────────

const checkRange = (value: number, rangeKey: keyof typeof VITAL_SIGN_RANGES, fieldLabel: string): VitalSignAlert | null => {
  const range = VITAL_SIGN_RANGES[rangeKey];

  let severity: AlertSeverity | null = null;
  let message = "";

  // 👇 destructuring seguro (TS ya no se queja)
  const low = "low" in range ? range.low : undefined;
  const high = "high" in range ? range.high : undefined;
  const criticalLow = "criticalLow" in range ? range.criticalLow : undefined;
  const criticalHigh = "criticalHigh" in range ? range.criticalHigh : undefined;

  const warningMessage = range.warningMessage;
  const criticalMessage = "criticalMessage" in range ? range.criticalMessage : undefined;

  // Critical primero
  if (criticalLow !== undefined && value <= criticalLow) {
    severity = "critical";
    message = criticalMessage ? criticalMessage(value) : "";
  } else if (criticalHigh !== undefined && value >= criticalHigh) {
    severity = "critical";
    message = criticalMessage ? criticalMessage(value) : "";
  }
  // Warning después
  else if (low !== undefined && value < low) {
    severity = "warning";
    message = warningMessage(value);
  } else if (high !== undefined && value > high) {
    severity = "warning";
    message = warningMessage(value);
  }

  if (!severity) return null;

  return {
    field: rangeKey,
    label: fieldLabel,
    severity,
    message,
  };
};

// ── Parse BP ───────────────────────────────────────────────────────────

const parseBloodPressure = (bp: string | undefined): { systolic: number; diastolic: number } | null => {
  if (!bp) return null;

  const parts = bp.split("/");
  if (parts.length !== 2) return null;

  const systolic = Number(parts[0]);
  const diastolic = Number(parts[1]);

  if (isNaN(systolic) || isNaN(diastolic)) return null;

  return { systolic, diastolic };
};

// ── Hook ───────────────────────────────────────────────────────────────

export function useVitalSignsAlerts(values: VitalSignsValues): VitalSignAlert[] {
  return useMemo(() => {
    const alerts: VitalSignAlert[] = [];

    // Blood pressure
    const bp = parseBloodPressure(values.bloodPressure);
    if (bp) {
      const systolicAlert = checkRange(bp.systolic, "bloodPressureSystolic", "T.A. sistólica");
      if (systolicAlert) alerts.push(systolicAlert);

      const diastolicAlert = checkRange(bp.diastolic, "bloodPressureDiastolic", "T.A. diastólica");
      if (diastolicAlert) alerts.push(diastolicAlert);
    }

    // Heart rate
    if (values.heartRateBpm !== undefined) {
      const alert = checkRange(values.heartRateBpm, "heartRateBpm", "FC");
      if (alert) alerts.push(alert);
    }

    // Respiratory rate
    if (values.respiratoryRate !== undefined) {
      const alert = checkRange(values.respiratoryRate, "respiratoryRate", "FR");
      if (alert) alerts.push(alert);
    }

    // Temperature
    if (values.temperatureC !== undefined) {
      const alert = checkRange(values.temperatureC, "temperatureC", "Temp.");
      if (alert) alerts.push(alert);
    }

    // SpO2
    if (values.oxygenSaturation !== undefined) {
      const alert = checkRange(values.oxygenSaturation, "oxygenSaturation", "SpO₂");
      if (alert) alerts.push(alert);
    }

    // BMI
    const bmi = values.bmi ?? calculateBmi(values.weightKg, values.heightCm);

    if (bmi !== null) {
      const alert = checkRange(bmi, "bmi", "IMC");
      if (alert) alerts.push(alert);
    }

    return alerts;
  }, [values]);
}

// ── BMI ────────────────────────────────────────────────────────────────

export const calculateBmi = (weightKg: number | undefined, heightCm: number | undefined): number | null => {
  if (!weightKg || !heightCm || heightCm <= 0) return null;

  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
};
