"use client";
import { useRef, useState } from "react";
import { Paperclip, Upload, FileText, Image as ImageIcon, ExternalLink } from "lucide-react";
import { usePatientFiles, useUploadPatientFile } from "../../hooks/useConsultation";
import { formatFileSize } from "../../utils/consultation.utils";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { notify } from "@/shared/ui/toaster";

interface Props {
  patientId: string | null;
}

const CATEGORIES = ["LAB_RESULTS", "IMAGING", "PRESCRIPTION", "REFERRAL", "SURGERY_REPORT", "PATHOLOGY", "OTHER"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  LAB_RESULTS: "Laboratorio",
  IMAGING: "Imagen",
  PRESCRIPTION: "Receta",
  REFERRAL: "Interconsulta",
  SURGERY_REPORT: "Cirugía",
  PATHOLOGY: "Patología",
  OTHER: "Otro",
};

export function FilesSidebar({ patientId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("OTHER");
  const [description, setDescription] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const { data: files = [], isLoading } = usePatientFiles(patientId);
  const { mutate: upload, isPending } = useUploadPatientFile(patientId ?? "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !patientId) return;
    upload(
      { file, category, description },
      {
        onSuccess: () => {
          setShowUpload(false);
          setDescription("");
          if (inputRef.current) inputRef.current.value = "";
        },
      },
    );
  };

  const isImage = (mime: string) => mime.startsWith("image/");

  const handleViewFile = async (url: string, mimeType: string) => {
    const loadId = notify.loading("Abriendo archivo...");
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const fileURL = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
      window.open(fileURL, "_blank");

      setTimeout(() => window.URL.revokeObjectURL(fileURL), 10000);
      notify.dismiss(loadId);
    } catch (error) {
      console.error("Error al abrir el archivo:", error);
      notify.error("Error", "No se pudo abrir el archivo.", { id: loadId });
    }
  };

  return (
    <div className="bg-interior rounded-xl p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip size={14} className="text-principal" />
          <h3 className="text-xs font-bold text-encabezado uppercase tracking-wider">Archivos y Gabinete</h3>
        </div>
        {patientId && (
          <button
            type="button"
            onClick={() => setShowUpload(!showUpload)}
            className="text-principal hover:text-principal-hover transition-colors"
          >
            <Upload size={14} />
          </button>
        )}
      </div>

      {/* Upload panel (se mantiene igual) */}
      {showUpload && patientId && (
        <div className="bg-fondo-inputs rounded-lg p-3 flex flex-col gap-2 border border-disable/20">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded bg-interior text-xs text-encabezado px-2 py-1.5 outline-none focus:ring-1 focus:ring-principal/30"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción (opcional)"
            className="w-full rounded bg-interior text-xs text-encabezado px-2 py-1.5 outline-none focus:ring-1 focus:ring-principal/30"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="w-full py-2 bg-principal text-white text-xs font-semibold rounded hover:bg-principal-hover transition-colors disabled:opacity-60"
          >
            {isPending ? "Subiendo…" : "Seleccionar archivo"}
          </button>
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {isLoading && <ECGLoader />}
      {!isLoading && files.length === 0 && <p className="text-xs text-subtitulo text-center py-3">No hay archivos cargados</p>}
      {!isLoading &&
        files.map((f) => (
          // 🚀 CAMBIO: Etiqueta <a> por <button>
          <button
            key={f.id}
            type="button"
            onClick={() => handleViewFile(f.fileUrl, f.mimeType)}
            className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-fondo-inputs transition-colors group text-left"
          >
            {isImage(f.mimeType) ? (
              <ImageIcon size={14} className="text-principal shrink-0" />
            ) : (
              <FileText size={14} className="text-principal shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-encabezado truncate">{f.fileName}</p>
              <p className="text-[10px] text-subtitulo">
                {CATEGORY_LABELS[f.category] ?? f.category} · {formatFileSize(f.fileSize)}
              </p>
            </div>
            <ExternalLink size={12} className="text-subtitulo opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        ))}
    </div>
  );
}
