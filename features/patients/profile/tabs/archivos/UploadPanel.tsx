"use client";

import { useState } from "react";
import { AlertCircle, FileText, Upload, X, Loader2, ImageOffIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CATEGORIES, type UploadState } from "@/features/patients/constants/archivos.constants";

interface Props {
  form: UploadState;
  setForm: React.Dispatch<React.SetStateAction<UploadState>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadPanel({ form, setForm, fileInputRef, onFileChange, onDrop, onSubmit, onCancel, isSubmitting }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const isPdf = form.file?.type === "application/pdf";

  return (
    <div className="bg-interior border border-principal/10 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-5 py-4 border-b border-disable/30 bg-card-header">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-inner-principal">
            <Upload size={14} className="text-principal" />
          </div>
          <span className="text-[13px] font-bold text-encabezado uppercase tracking-wide">Subir archivo médico</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-full text-subtitulo hover:text-negative-text hover:bg-negative/20 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div
          onDrop={(e) => {
            e.preventDefault();
            onDrop(e);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "group border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
            dragOver
              ? "border-principal bg-inner-principal/40 ring-4 ring-principal/5"
              : form.file
                ? "border-positive-text bg-positive/30"
                : "border-disable hover:border-principal/40 hover:bg-inner-principal/10",
          )}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onFileChange} />
          {form.file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 rounded-2xl bg-positive/20 text-positive-text">
                {isPdf ? (
                  <FileText size={32} strokeWidth={1.5} />
                ) : (
                  <ImageOffIcon size={32} strokeWidth={1.5} />
                )}
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-encabezado truncate max-w-xs">{form.file.name}</p>
                <p className="text-[11px] font-medium text-subtitulo uppercase tracking-wider">{formatBytes(form.file.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-disable flex items-center justify-center mx-auto text-subtitulo group-hover:scale-110 group-hover:bg-inner-principal group-hover:text-principal transition-all duration-300">
                <Upload size={20} strokeWidth={2.5} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-encabezado">
                  Haz clic para <span className="text-principal">seleccionar</span>
                </p>
                <p className="text-xs text-subtitulo">o arrastra tus archivos aquí (PDF o Imágenes)</p>
              </div>
            </div>
          )}
        </div>

        {form.error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-negative/10 text-negative-text animate-in head-shake">
            <AlertCircle size={14} />
            <p className="text-xs font-bold uppercase tracking-tight">{form.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-subtitulo uppercase tracking-widest ml-1">Categoría *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as UploadState["category"] }))}
              className="w-full px-4 py-2.5 bg-fondo-inputs border-none rounded-xl text-sm text-encabezado font-medium outline-none focus:ring-2 focus:ring-principal/30 transition-all appearance-none"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-subtitulo uppercase tracking-widest ml-1">
              Descripción <span className="font-normal normal-case opacity-60">(opcional)</span>
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Ej: Biometría hemática..."
              maxLength={200}
              className="w-full px-4 py-2.5 bg-fondo-inputs border-none rounded-xl text-sm text-encabezado font-medium outline-none focus:ring-2 focus:ring-principal/30 transition-all placeholder:text-subtitulo/50"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-disable hover:bg-disable/80 text-xs font-bold text-subtitulo uppercase tracking-widest transition-all"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !form.file}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-principal text-white text-xs font-bold uppercase tracking-widest hover:bg-principal-hover shadow-lg shadow-principal/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} strokeWidth={2.5} />}
            Subir Archivo
          </button>
        </div>
      </div>
    </div>
  );
}
