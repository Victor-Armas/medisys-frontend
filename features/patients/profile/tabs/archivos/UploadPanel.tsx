"use client";

import { useState } from "react";
import { AlertCircle, FileText, Image, Upload, X, Loader2 } from "lucide-react";
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
    <div className="bg-bg-base border border-brand/20 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b ">
        <div className="flex items-center gap-2">
          <Upload size={13} className="text-principal" />
          <span className="text-sm font-semibold text-encabezado">Subir archivo médico</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg text-subtitulo hover:text-encabezado hover:bg-subtitulo transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="p-4 space-y-4">
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
            "border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer",
            dragOver
              ? "border-brand bg-principal"
              : form.file
                ? "border-emerald-400 bg-emerald-50/50"
                : "border-border-strong hover:border-brand/50 hover:bg-principal",
          )}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onFileChange} />
          {form.file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                {isPdf ? <FileText size={18} className="text-emerald-600" /> : <Image size={18} className="text-emerald-600" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-encabezado truncate max-w-50">{form.file.name}</p>
                <p className="text-xs text-subtitulo">{formatBytes(form.file.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-subtitulo flex items-center justify-center mx-auto">
                <Upload size={16} className="text-subtitulo" />
              </div>
              <p className="text-sm font-medium text-encabezado">
                Arrastra o <span className="text-principal">selecciona</span>
              </p>
              <p className="text-xs text-subtitulo">Selecciona un PDF o imagen compatible.</p>
            </div>
          )}
        </div>

        {form.error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
            <AlertCircle size={12} />
            {form.error}
          </p>
        )}

        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">Categoría *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as UploadState["category"] }))}
            className="w-full px-3 py-2.5  border rounded-xl text-sm text-encabezado outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-subtitulo uppercase tracking-wider">
            Descripción <span className="font-normal normal-case text-subtitulo">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Ej: Biometría hemática – antecedente previo"
            maxLength={200}
            className="w-full px-3 py-2.5  border rounded-xl text-sm text-encabezado outline-none focus:border-brand focus:ring-principal/40 transition-all placeholder:text-subtitulo"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border text-sm text-subtitulo hover:bg-subtitulo transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !form.file}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-principal text-white text-sm font-semibold hover:bg-principal-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            Subir
          </button>
        </div>
      </div>
    </div>
  );
}
