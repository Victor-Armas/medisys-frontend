"use client";

import { Pill } from "lucide-react";
import { ConsultationResponse } from "../../types/consultation.types";
import { cn } from "@/shared/lib/utils";

interface Props {
  c: ConsultationResponse;
}

export default function PrescriptionConsultationDetail({ c }: Props) {
  return (
    <div className="bg-interior rounded-sm shadow-sm">
      <div className="flex items-center justify-between mb-1 bg-disable px-5 py-3">
        <div className="flex items-center gap-2">
          <Pill size={15} className="text-principal" />
          <h2 className="text-sm font-bold text-encabezado uppercase tracking-wider">Receta</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-subtitulo">
          <span>
            Folio: <span className="font-semibold text-encabezado">{c.prescription?.folioNumber}</span>
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full font-semibold",
              c.prescription?.status === "ISSUED"
                ? "bg-positive text-positive-text"
                : c.prescription?.status === "DRAFT"
                  ? "bg-wairning/20 text-wairning-text"
                  : "bg-negative/20 text-negative-text",
            )}
          >
            {c.prescription?.status === "ISSUED" ? "Emitida" : c.prescription?.status === "DRAFT" ? "Borrador" : "Cancelada"}
          </span>
        </div>
      </div>
      <div className="overflow-x-auto px-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-disable/30">
              {["#", "Medicamento", "Dosis", "Frecuencia", "Duración", "Vía"].map((h) => (
                <th key={h} className="text-left py-2 px-3 text-subtitulo font-semibold uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.prescription?.items.map((item, idx) => (
              <tr key={item.id} className="border-b border-disable/10 last:border-0">
                <td className="py-2.5 px-3 text-subtitulo">{idx + 1}</td>
                <td className="py-2.5 px-3">
                  <p className="font-semibold text-encabezado">{item.medicationName}</p>
                  {item.brandName && <p className="text-subtitulo">{item.brandName}</p>}
                  {item.instructions && <p className="text-subtitulo italic mt-0.5">{item.instructions}</p>}
                </td>
                <td className="py-2.5 px-3 text-encabezado">{item.dose}</td>
                <td className="py-2.5 px-3 text-encabezado">{item.frequency}</td>
                <td className="py-2.5 px-3 text-encabezado">{item.duration}</td>
                <td className="py-2.5 px-3 text-encabezado">{item.route ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
