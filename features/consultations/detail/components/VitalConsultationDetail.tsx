"use client";

import { Activity } from "lucide-react";
import { ConsultationResponse } from "../../types/consultation.types";
import { cn } from "@/shared/lib/utils";
import { getBmiCategory, getVitalMessages, getVitalStatusColor } from "../../constants/vital-signs.constants";

interface Props {
  c: ConsultationResponse;
}

// Función auxiliar para colorear los valores según los rangos

export default function VitalConsultationDetail({ c }: Props) {
  const bmiCategory = c.vitalSigns?.bmi ? getBmiCategory(c.vitalSigns.bmi) : null;

  return (
    <div className="bg-interior rounded-sm shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={15} className="text-principal" />
        <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Signos Vitales</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { key: "bloodPressure", label: "T.A.", value: c.vitalSigns!.bloodPressure, unit: "mmHg" },
          { key: "heartRateBpm", label: "FC", value: c.vitalSigns!.heartRateBpm, unit: "lpm" },
          { key: "respiratoryRate", label: "FR", value: c.vitalSigns!.respiratoryRate, unit: "rpm" },
          { key: "temperatureC", label: "Temp.", value: c.vitalSigns!.temperatureC, unit: "°C" },
          { key: "oxygenSaturation", label: "SpO₂", value: c.vitalSigns!.oxygenSaturation, unit: "%" },
          { key: "bmi", label: "IMC", value: c.vitalSigns!.bmi, unit: "" },
        ].map(({ key, label, value, unit }) => {
          if (value == null) return null;

          // Obtenemos los mensajes adicionales para este valor
          const messages = getVitalMessages(key, value);

          return (
            <div key={label} className="bg-fondo-inputs rounded-md p-3 text-center flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold text-subtitulo uppercase tracking-wider">{label}</p>
              <p className={cn("text-base mt-1", getVitalStatusColor(key, value))}>{value}</p>
              <p className="text-[10px] text-subtitulo">{unit}</p>

              {/* Etiquetas textuales de advertencia o estado crítico */}
              {messages.length > 0 && (
                <div className="flex flex-col gap-0.5 mt-1">
                  {messages.map((msg, idx) => (
                    <p key={idx} className={cn("text-[9px] font-semibold leading-tight", msg.color)}>
                      {msg.text}
                    </p>
                  ))}
                </div>
              )}

              {/* Agregamos la etiqueta del IMC directo en la tarjeta, solo si no saltó un mensaje genérico */}
              {key === "bmi" && bmiCategory && messages.length === 0 && (
                <p className={cn("text-[9px] font-semibold mt-1", bmiCategory.color)}>{bmiCategory.label}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
