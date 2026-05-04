"use client";
import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Activity, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ConsultationFormValues, VitalSignsValues } from "../../schemas/consultation.schema";
import { useVitalSignsAlerts, calculateBmi } from "../../hooks/useVitalSignsAlerts";
import { getBmiCategory } from "../../constants/vital-signs.constants";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Input } from "@/shared/ui/input";

interface VitalField {
  key: keyof VitalSignsValues;
  label: string;
  unit: string;
  placeholder: string;
  type?: "text" | "number";
}

const VITAL_FIELDS: VitalField[] = [
  { key: "bloodPressure", label: "T.A.", unit: "mmHg", placeholder: "120/80", type: "text" },
  { key: "heartRateBpm", label: "FC", unit: "lpm", placeholder: "72", type: "number" },
  { key: "respiratoryRate", label: "FR", unit: "rpm", placeholder: "16", type: "number" },
  { key: "temperatureC", label: "Temp.", unit: "°C", placeholder: "36.5", type: "number" },
  { key: "oxygenSaturation", label: "SpO₂", unit: "%", placeholder: "98", type: "number" },
  { key: "weightKg", label: "Peso", unit: "kg", placeholder: "65", type: "number" },
  { key: "heightCm", label: "Talla", unit: "cm", placeholder: "170", type: "number" },
];

export function VitalSignsSection() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>();
  const vitalValues = useWatch({ control, name: "vitalSigns" });

  const debouncedVitalValues = useDebounce(vitalValues, 500);
  const alerts = useVitalSignsAlerts(debouncedVitalValues ?? {});

  const weight = vitalValues?.weightKg;
  const height = vitalValues?.heightCm;
  const bmi = calculateBmi(weight, height);
  const bmiCategory = bmi ? getBmiCategory(bmi) : null;

  useEffect(() => {
    if (bmi) setValue("vitalSigns.bmi", bmi);
  }, [bmi, setValue]);

  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");

  return (
    <section className="bg-interior rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-principal" />
        <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Signos Vitales</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {VITAL_FIELDS.map(({ key, label, unit, placeholder, type }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">{label}</label>
            <div className="relative">
              <Input
                type={type === "number" ? "number" : "text"}
                step={key === "temperatureC" ? "0.1" : "any"}
                {...register(`vitalSigns.${key}`, {
                  setValueAs: (v: string) => {
                    if (type !== "number") {
                      // Para campos de texto (ej. bloodPressure), "" → undefined
                      return v === "" ? undefined : v;
                    }
                    // Para campos numéricos
                    if (v === "") return undefined;
                    const parsed = parseFloat(v);
                    return isNaN(parsed) ? undefined : parsed;
                  },
                })}
                min={type === "number" ? 0 : undefined}
                error={errors.vitalSigns?.[key]?.message}
                placeholder={placeholder}
                className="text-center p-2"
              />
              <span className="absolute -bottom-4 left-0 right-0 text-center text-[9px] text-subtitulo">{unit}</span>
            </div>
          </div>
        ))}

        {/* BMI auto-calculated */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">IMC</label>
          <div className="bg-fondo-inputs rounded-md px-2 py-2 text-center">
            <p className="text-sm font-bold text-encabezado">{bmi ?? "—"}</p>
            {bmiCategory && <p className={cn("text-[9px] font-semibold", bmiCategory.color)}>{bmiCategory.label}</p>}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {criticalAlerts.map((a) => (
            <div
              key={a.field}
              className="flex items-center gap-1.5 bg-negative/10 border border-negative/30 text-negative-text px-2.5 py-1 rounded-full text-[11px] font-semibold"
            >
              <AlertCircle size={12} className="shrink-0" />
              <span className="whitespace-nowrap">{a.message}</span>
            </div>
          ))}

          {warningAlerts.map((a) => (
            <div
              key={a.field}
              className="flex items-center gap-1.5 bg-wairning/15 border border-wairning/30 text-wairning-text px-2.5 py-1 rounded-full text-[11px] font-medium"
            >
              <AlertCircle size={12} className="shrink-0" />
              <span className="whitespace-nowrap">{a.message}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
