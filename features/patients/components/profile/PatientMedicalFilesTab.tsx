"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, Image, Upload, Trash2, Download, Loader2, FolderOpen, X, AlertCircle } from "lucide-react";
import { isAxiosError } from "axios";

import { useMedicalFiles, useUploadMedicalFile, useDeleteMedicalFile } from "../../hooks/useMedicalFiles";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import { notify } from "@/shared/ui/toaster";
import { cn } from "@/shared/lib/utils";
import type { PatientMedicalFile, MedicalFileCategory } from "../../types/patient.types";
import { MEDICAL_FILE_CATEGORY_LABELS, MEDICAL_FILE_CATEGORY_COLORS } from "../../types/patient.types";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = Object.keys(MEDICAL_FILE_CATEGORY_LABELS) as MedicalFileCategory[];

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isPdf(mimeType: string): boolean {
  return mimeType === "application/pdf";
}

// ── Upload Form State ─────────────────────────────────────────────────────────

interface UploadFormState {
  file: File | null;
  category: MedicalFileCategory;
  description: string;
  error: string | null;
}

const INITIAL_FORM: UploadFormState = {
  file: null,
  category: "LAB_RESULTS",
  description: "",
  error: null,
};

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  canEdit: boolean;
}

export function PatientMedicalFilesTab({ patientId, canEdit }: Props) {
  const { data: files = [], isLoading } = useMedicalFiles(patientId);
  const upload = useUploadMedicalFile();
  const deleteFile = useDeleteMedicalFile();

  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState<UploadFormState>(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState<PatientMedicalFile | null>(null);
  const [filterCategory, setFilterCategory] = useState<MedicalFileCategory | "ALL">("ALL");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File selection ────────────────────────────────────────────────────────

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setForm((prev) => ({
        ...prev,
        file: null,
        error: "Solo se permiten archivos PDF, JPEG, PNG o WebP.",
      }));
      return;
    }

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setForm((prev) => ({
        ...prev,
        file: null,
        error: `El archivo supera el límite de ${MAX_FILE_SIZE_MB} MB.`,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, file: selected, error: null }));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (!dropped) return;

      // Reutilizamos la misma validación simulando el evento
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    },
    [handleFileChange],
  );

  // ── Submit ────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (!form.file) {
      setForm((prev) => ({ ...prev, error: "Selecciona un archivo." }));
      return;
    }

    const loadId = notify.loading("Subiendo archivo…");
    try {
      await upload.mutateAsync({
        patientId,
        file: form.file,
        category: form.category,
        description: form.description || undefined,
      });
      notify.success("Archivo guardado", form.file.name, { id: loadId });
      setForm(INITIAL_FORM);
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al subir"), undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const loadId = notify.loading("Eliminando archivo…");
    try {
      await deleteFile.mutateAsync({ patientId, fileId: deleteTarget.id });
      notify.success("Archivo eliminado", undefined, { id: loadId });
    } catch {
      notify.error("Error al eliminar", undefined, { id: loadId });
    } finally {
      setDeleteTarget(null);
    }
  }

  // ── Filtered files ────────────────────────────────────────────────────────

  const displayed = filterCategory === "ALL" ? files : files.filter((f) => f.category === filterCategory);

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) return <FilesSkeleton />;

  return (
    <div className="space-y-5">
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Filtro por categoría */}
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="Todos"
            active={filterCategory === "ALL"}
            count={files.length}
            onClick={() => setFilterCategory("ALL")}
          />
          {CATEGORIES.filter((cat) => files.some((f) => f.category === cat)).map((cat) => (
            <FilterChip
              key={cat}
              label={MEDICAL_FILE_CATEGORY_LABELS[cat]}
              active={filterCategory === cat}
              count={files.filter((f) => f.category === cat).length}
              onClick={() => setFilterCategory(cat)}
            />
          ))}
        </div>

        {canEdit && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors shadow-sm shadow-brand/20 shrink-0"
          >
            <Upload size={14} />
            Subir archivo
          </button>
        )}
      </div>

      {/* ── Upload Panel ── */}
      {showUpload && (
        <UploadPanel
          form={form}
          setForm={setForm}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          onSubmit={handleSubmit}
          onCancel={() => {
            setForm(INITIAL_FORM);
            setShowUpload(false);
          }}
          isSubmitting={upload.isPending}
        />
      )}

      {/* ── File Grid ── */}
      {displayed.length === 0 ? (
        <EmptyState canEdit={canEdit} onUpload={() => setShowUpload(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayed.map((file) => (
            <FileCard key={file.id} file={file} canDelete={canEdit} onDelete={() => setDeleteTarget(file)} />
          ))}
        </div>
      )}

      {/* ── Confirm Delete ── */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        variant="danger"
        title="Eliminar archivo"
        message={
          <span>
            ¿Estás seguro de eliminar <strong>{deleteTarget?.fileName}</strong>? Esta acción no se puede deshacer.
          </span>
        }
        confirmText="Eliminar"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

// ── Upload Panel ──────────────────────────────────────────────────────────────

interface UploadPanelProps {
  form: UploadFormState;
  setForm: React.Dispatch<React.SetStateAction<UploadFormState>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function UploadPanel({ form, setForm, fileInputRef, onFileChange, onDrop, onSubmit, onCancel, isSubmitting }: UploadPanelProps) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="bg-bg-base border border-border-default rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default bg-bg-surface">
        <div className="flex items-center gap-2">
          <Upload size={14} className="text-brand" />
          <h4 className="text-sm font-semibold text-text-primary">Subir archivo médico</h4>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
            dragOver
              ? "border-brand bg-brand/5"
              : form.file
                ? "border-emerald-400 bg-emerald-50/50"
                : "border-border-strong hover:border-brand/50 hover:bg-brand/5",
          )}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" onChange={onFileChange} />
          {form.file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                {isPdf(form.file.type) ? (
                  <FileText size={20} className="text-emerald-600" />
                ) : (
                  <Image size={20} className="text-emerald-600" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary truncate max-w-[220px]">{form.file.name}</p>
                <p className="text-xs text-text-secondary">{formatFileSize(form.file.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-bg-subtle flex items-center justify-center mx-auto">
                <Upload size={18} className="text-text-secondary" />
              </div>
              <p className="text-sm font-medium text-text-primary">
                Arrastra un archivo o <span className="text-brand">haz clic</span>
              </p>
              <p className="text-xs text-text-disabled">PDF, JPEG, PNG, WebP · Máx. 10 MB</p>
            </div>
          )}
        </div>

        {/* Validation error */}
        {form.error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
            <AlertCircle size={12} />
            {form.error}
          </p>
        )}

        {/* Category */}
        <div className="space-y-1.5">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">Categoría *</label>
          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value as MedicalFileCategory,
              }))
            }
            className="w-full px-4 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {MEDICAL_FILE_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">
            Descripción <span className="font-normal normal-case">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Ej: Biometría hemática 12/04/2025"
            maxLength={200}
            className="w-full px-4 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-text-disabled"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !form.file}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Subir archivo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── File Card ─────────────────────────────────────────────────────────────────

function FileCard({ file, canDelete, onDelete }: { file: PatientMedicalFile; canDelete: boolean; onDelete: () => void }) {
  const colors = MEDICAL_FILE_CATEGORY_COLORS[file.category];
  const isImage = file.mimeType.startsWith("image/");

  return (
    <div className="group relative bg-bg-surface border border-border-default rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Preview / Icon area */}
      <div className="h-28 bg-bg-subtle flex items-center justify-center relative overflow-hidden">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.fileUrl} alt={file.description ?? file.fileName} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FileText size={32} className="text-red-500/70" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-disabled">PDF</span>
          </div>
        )}

        {/* Overlay actions on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-white/90 text-text-primary hover:bg-white transition-colors"
            title="Ver/descargar"
            onClick={(e) => e.stopPropagation()}
          >
            <Download size={14} />
          </a>
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 rounded-lg bg-white/90 text-red-500 hover:bg-white transition-colors"
              title="Eliminar"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1.5">
        {/* Category badge */}
        <span
          className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border",
            colors.bg,
            colors.text,
            colors.border,
          )}
        >
          {MEDICAL_FILE_CATEGORY_LABELS[file.category]}
        </span>

        {/* Description or filename */}
        <p className="text-xs font-medium text-text-primary leading-tight truncate" title={file.description ?? file.fileName}>
          {file.description ?? file.fileName}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-disabled">{formatFileSize(file.fileSize)}</span>
          <span className="text-[10px] text-text-disabled">
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

// ── Filter Chip ───────────────────────────────────────────────────────────────

function FilterChip({ label, active, count, onClick }: { label: string; active: boolean; count: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all",
        active
          ? "bg-brand text-white border-brand"
          : "bg-bg-surface border-border-default text-text-secondary hover:border-brand/40 hover:text-brand",
      )}
    >
      {label}
      <span
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold",
          active ? "bg-white/20 text-white" : "bg-bg-subtle text-text-disabled",
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ canEdit, onUpload }: { canEdit: boolean; onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-bg-subtle flex items-center justify-center">
        <FolderOpen size={22} className="text-text-disabled" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">Sin archivos médicos</p>
        <p className="text-xs text-text-secondary mt-1 max-w-xs">
          Aquí se guardarán laboratorios, radiografías, recetas y otros documentos clínicos.
        </p>
      </div>
      {canEdit && (
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors"
        >
          <Upload size={14} />
          Subir primer archivo
        </button>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function FilesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border-default overflow-hidden">
          <div className="h-28 bg-bg-subtle" />
          <div className="p-3 space-y-2">
            <div className="h-4 bg-bg-subtle rounded w-1/3" />
            <div className="h-3 bg-bg-subtle rounded w-3/4" />
            <div className="h-3 bg-bg-subtle rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
