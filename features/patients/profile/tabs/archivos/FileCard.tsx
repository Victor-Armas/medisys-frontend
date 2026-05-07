"use client";

import { Download, FileText, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { MEDICAL_FILE_CATEGORY_COLORS, MEDICAL_FILE_CATEGORY_LABELS } from "@/features/patients/constants/patient.constants";
import type { PatientMedicalFile } from "@/features/patients/types/patient.types";

interface Props {
  file: PatientMedicalFile;
  canDelete: boolean;
  onDelete: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileCard({ file, canDelete, onDelete }: Props) {
  const colors = MEDICAL_FILE_CATEGORY_COLORS[file.category];
  const isImage = file.mimeType.startsWith("image/");

  return (
    <div className="group relative bg-interior border border-disable/40 rounded-2xl overflow-hidden hover:shadow-xl hover:border-principal/30 transition-all duration-300">
      <div className="h-32 bg-fondo-inputs flex items-center justify-center relative overflow-hidden group-hover:bg-inner-principal/20 transition-colors">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.fileUrl} alt={file.description ?? file.fileName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 rounded-2xl bg-white shadow-sm text-red-500">
              <FileText size={32} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-subtitulo/40">PDF Document</span>
          </div>
        )}
        <div className="absolute inset-0 bg-principal/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-3 rounded-xl bg-white text-principal hover:scale-110 active:scale-95 shadow-lg transition-all"
            title="Descargar / Ver"
          >
            <Download size={16} strokeWidth={2.5} />
          </a>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-3 rounded-xl bg-white text-negative-text hover:scale-110 active:scale-95 shadow-lg transition-all"
              title="Eliminar"
            >
              <Trash2 size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors",
              colors.bg,
              colors.text,
              colors.border,
            )}
          >
            {MEDICAL_FILE_CATEGORY_LABELS[file.category]}
          </span>
        </div>
        
        <p className="text-[13px] font-bold text-encabezado leading-snug line-clamp-2 h-9" title={file.description ?? file.fileName}>
          {file.description ?? file.fileName}
        </p>

        <div className="flex items-center justify-between pt-1 border-t border-disable/30">
          <span className="text-[10px] font-mono font-bold text-subtitulo/60">{formatBytes(file.fileSize)}</span>
          <span className="text-[10px] font-bold text-subtitulo/60 uppercase tracking-tighter">
            {new Date(file.createdAt).toLocaleDateString("es-MX", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "UTC",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
