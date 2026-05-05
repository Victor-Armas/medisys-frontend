"use client";
import { useRef, useState } from "react";
import { Upload, FileText, ExternalLink, FolderOpen } from "lucide-react";
import { usePatientFiles, useUploadPatientFile } from "../../hooks/useConsultation";
import { formatFileSize } from "../../utils/consultation.utils";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";
import { notify } from "@/shared/ui/toaster";

interface Props {
  patientId: string;
}

const CATEGORIES = ["LAB_RESULTS", "IMAGING", "PRESCRIPTION", "REFERRAL", "SURGERY_REPORT", "PATHOLOGY", "OTHER"] as const;
const CAT_LABELS: Record<string, string> = {
  LAB_RESULTS: "Laboratorio",
  IMAGING: "Imagen",
  PRESCRIPTION: "Receta",
  REFERRAL: "Interconsulta",
  SURGERY_REPORT: "Cirugía",
  PATHOLOGY: "Patología",
  OTHER: "Otro",
};
const CAT_COLORS: Record<string, string> = {
  LAB_RESULTS: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  IMAGING: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  PRESCRIPTION: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  REFERRAL: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  SURGERY_REPORT: "bg-red-500/10 text-red-600 border-red-500/20",
  PATHOLOGY: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  OTHER: "bg-subtitulo/10 text-subtitulo",
};

export function ConsultationArchivosTab({ patientId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadCat, setUploadCat] = useState("OTHER");
  const [uploadDesc, setUploadDesc] = useState("");
  const [filterCat, setFilterCat] = useState<string>("ALL");
  const [showUpload, setShowUpload] = useState(false);

  const { data: files = [], isLoading } = usePatientFiles(patientId);
  const { mutate: upload, isPending } = useUploadPatientFile(patientId);

  const displayed = filterCat === "ALL" ? files : files.filter((f) => f.category === filterCat);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload(
      { file, category: uploadCat, description: uploadDesc },
      {
        onSuccess: () => {
          setShowUpload(false);
          setUploadDesc("");
          if (inputRef.current) inputRef.current.value = "";
        },
      },
    );
  };

  // 🔥 MAGIA APLICADA: Tu misma función para abrir archivos en memoria
  const handleViewFile = async (url: string, mimeType: string) => {
    const loadId = notify.loading("Abriendo archivo...");
    try {
      const res = await fetch(url);
      const blob = await res.blob();

      // Forzamos el MIME type dinámicamente según el archivo
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
    <div className="flex flex-col gap-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen size={15} className="text-principal" />
          <h3 className="text-sm font-bold text-encabezado">Archivos del paciente</h3>
          {files.length > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-principal text-white">{files.length}</span>
          )}
        </div>
        <button
          onClick={() => setShowUpload((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-principal text-white text-xs font-semibold rounded-xl hover:bg-principal-hover transition-colors"
        >
          <Upload size={12} /> Subir archivo
        </button>
      </div>

      {/* Upload panel (se mantiene igual) */}
      {showUpload && (
        <div className="bg-interior border border-brand/20 rounded-xl p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <select
              value={uploadCat}
              onChange={(e) => setUploadCat(e.target.value)}
              className="w-full rounded-lg bg-fondo-inputs text-sm text-encabezado px-3 py-2 outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CAT_LABELS[c]}
                </option>
              ))}
            </select>
            <input
              value={uploadDesc}
              onChange={(e) => setUploadDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="w-full rounded-lg bg-fondo-inputs text-sm text-encabezado px-3 py-2 outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="w-full py-2.5 bg-principal text-white text-sm font-semibold rounded-xl hover:bg-principal-hover transition-colors disabled:opacity-60"
          >
            {isPending ? "Subiendo…" : "Seleccionar archivo (PDF / Imagen)"}
          </button>
          <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
        </div>
      )}

      {/* Filter chips (se mantiene igual) */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <FilterChip label="Todos" count={files.length} active={filterCat === "ALL"} onClick={() => setFilterCat("ALL")} />
          {CATEGORIES.filter((c) => files.some((f) => f.category === c)).map((c) => (
            <FilterChip
              key={c}
              label={CAT_LABELS[c]}
              count={files.filter((f) => f.category === c).length}
              active={filterCat === c}
              onClick={() => setFilterCat(c)}
            />
          ))}
        </div>
      )}

      {/* Files grid */}
      {isLoading ? (
        <ECGLoader />
      ) : displayed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-disable p-10 text-center">
          <Upload size={28} className="text-subtitulo mx-auto mb-3" />
          <p className="text-sm font-semibold text-encabezado">Sin archivos</p>
          <p className="text-xs text-subtitulo mt-1">Sube documentación médica del paciente</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayed.map((f) => {
            const isImg = f.mimeType.startsWith("image/");
            return (
              // 🚀 CAMBIO: Etiqueta <a> por <button> para manejar la descarga manual
              <button
                key={f.id}
                type="button"
                onClick={() => handleViewFile(f.fileUrl, f.mimeType)}
                className="group bg-interior border border-disable/20 rounded-xl overflow-hidden hover:shadow-md transition-shadow text-left"
              >
                <div className="h-20 bg-fondo-inputs flex items-center justify-center relative overflow-hidden">
                  {isImg ? (
                    <Image
                      src={f.fileUrl}
                      alt={f.fileName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <FileText size={24} className="text-red-400" />
                      <span className="text-[10px] font-bold text-subtitulo uppercase">PDF</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink size={18} className="text-white" />
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <span
                    className={cn(
                      "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border",
                      CAT_COLORS[f.category],
                    )}
                  >
                    {CAT_LABELS[f.category]}
                  </span>
                  <p className="text-xs font-medium text-encabezado truncate" title={f.description ?? f.fileName}>
                    {f.description ?? f.fileName}
                  </p>
                  <p className="text-[10px] text-subtitulo">{formatFileSize(f.fileSize)}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[10px] font-semibold transition-colors",
        active ? "bg-principal text-white border-transparent" : "text-subtitulo border-disable hover:bg-interior",
      )}
    >
      {label} <span className="ml-1 opacity-70">({count})</span>
    </button>
  );
}
