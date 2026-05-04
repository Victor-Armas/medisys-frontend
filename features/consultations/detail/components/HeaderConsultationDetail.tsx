"use client";

import { useState } from "react";
import { ArrowLeft, FileText, Printer, Pill } from "lucide-react";
import { ConsultationResponse } from "../../types/consultation.types";
import Link from "next/link";
import { useIssuePrescription } from "../../hooks/useConsultation";
import api from "@/shared/lib/api";
import { notify } from "@/shared/ui/toaster";

interface Props {
  c: ConsultationResponse;
  canPrint: boolean;
}

export default function HeaderConsultationDetail({ c, canPrint }: Props) {
  const [includeSig, setIncludeSig] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingPrescription, setIsDownloadingPrescription] = useState(false);

  // Usamos tu hook personalizado
  const { mutate: issuePrescription, isPending } = useIssuePrescription(c.id);

  const handleDownloadNote = async () => {
    try {
      setIsDownloading(true);

      const res = await api.get(`/consultations/${c.id}/pdf?signature=${includeSig}`, { responseType: "blob" });

      const fileURL = URL.createObjectURL(res.data);
      window.open(fileURL, "_blank");

      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
    } catch (error) {
      console.error(error);
      notify.error("Error", "No se pudo abrir la nota médica.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPrescription = async () => {
    if (!c.prescription?.pdfUrl) return;
    try {
      setIsDownloadingPrescription(true);
      // Fetcheamos el PDF directo de Cloudinary (sin el api client para no mandar JWT)
      const res = await fetch(c.prescription.pdfUrl);
      const blob = await res.blob();

      // Forzamos el tipo de contenido a application/pdf para que el navegador lo muestre inline
      const fileURL = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      window.open(fileURL, "_blank");

      // Limpiamos la URL después de un tiempo
      setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
    } catch (error) {
      console.error("Error al descargar la receta:", error);
      notify.error("Error", "Hubo un problema al abrir la receta médica.");
    } finally {
      setIsDownloadingPrescription(false);
    }
  };

  const handleIssuePrescription = () => {
    if (!c.prescription) return;
    // Disparamos la mutación
    issuePrescription({
      prescriptionId: c.prescription.id,
      includeSignature: includeSig,
    });
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <Link
        href="/admin/consultations"
        className="flex items-center gap-2 text-md text-principal hover:text-principal-hover2 font-semibold transition-colors"
      >
        <ArrowLeft size={16} /> Volver
      </Link>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Signature toggle */}
        <label className="flex items-center gap-2 text-xs text-subtitulo cursor-pointer mr-1">
          <input
            type="checkbox"
            checked={includeSig}
            onChange={(e) => setIncludeSig(e.target.checked)}
            className="w-3.5 h-3.5 accent-principal"
          />
          Incluir firma
        </label>

        {/* Botón Descargar Nota */}
        <button
          onClick={handleDownloadNote}
          disabled={isDownloading}
          className="flex items-center gap-2 border border-disable/30 text-encabezado px-4 py-2 rounded-lg text-sm font-medium hover:bg-fondo-inputs transition-colors disabled:opacity-60"
        >
          <FileText size={15} /> {isDownloading ? "Descargando..." : "Descargar nota"}
        </button>

        {/* Descargar receta (Solo si el PDF ya existe) */}
        {c.prescription?.pdfUrl && (
          <button
            onClick={handleDownloadPrescription}
            disabled={isDownloadingPrescription}
            className="flex items-center gap-2 border border-disable/30 text-encabezado px-4 py-2 rounded-lg text-sm font-medium hover:bg-fondo-inputs transition-colors disabled:opacity-60"
          >
            <Printer size={15} /> {isDownloadingPrescription ? "Abriendo..." : "Descargar receta"}
          </button>
        )}

        {/* Emitir receta */}
        {canPrint && c.prescription?.status === "DRAFT" && (
          <button
            onClick={handleIssuePrescription}
            disabled={isPending}
            className="flex items-center gap-2 bg-principal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-principal-hover transition-colors disabled:opacity-60"
          >
            <Pill size={15} /> {isPending ? "Emitiendo..." : "Emitir receta"}
          </button>
        )}
      </div>
    </div>
  );
}
