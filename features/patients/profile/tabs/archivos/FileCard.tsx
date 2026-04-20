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
    <div className="group relative  border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-24 bg-subtitulo flex items-center justify-center relative overflow-hidden">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.fileUrl} alt={file.description ?? file.fileName} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <FileText size={28} className="text-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-subtitulo">PDF</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-white/90 text-encabezado hover:bg-white transition-colors"
          >
            <Download size={13} />
          </a>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-lg bg-white/90 text-red-500 hover:bg-white transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="p-3 space-y-1.5">
        <span
          className={cn(
            "inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold border",
            colors.bg,
            colors.text,
            colors.border,
          )}
        >
          {MEDICAL_FILE_CATEGORY_LABELS[file.category]}
        </span>
        <p className="text-xs font-medium text-encabezado leading-tight truncate" title={file.description ?? file.fileName}>
          {file.description ?? file.fileName}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-subtitulo">{formatBytes(file.fileSize)}</span>
          <span className="text-[10px] text-subtitulo">
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
