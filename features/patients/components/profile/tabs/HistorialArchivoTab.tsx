"use client";

import {
  Calendar,
  Clock,
  Lock,
  FileText,
  Image,
  Upload,
  Trash2,
  Download,
  Loader2,
  FolderOpen,
  X,
  AlertCircle,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/ui/toaster";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import {
  MEDICAL_FILE_CATEGORY_COLORS,
  MEDICAL_FILE_CATEGORY_LABELS,
  MedicalFileCategory,
  PatientMedicalFile,
} from "@/features/patients/types/patient.types";
import { useDeleteMedicalFile, useMedicalFiles, useUploadMedicalFile } from "@/features/patients/hooks/useMedicalFiles";

// ── Constants ─────────────────────────────────────────────────────────────────

const CATEGORIES = Object.keys(MEDICAL_FILE_CATEGORY_LABELS) as MedicalFileCategory[];
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  hasEditPermission: boolean;
}

interface UploadState {
  file: File | null;
  category: MedicalFileCategory;
  description: string;
  error: string | null;
}

const INITIAL_UPLOAD: UploadState = {
  file: null,
  category: "LAB_RESULTS",
  description: "",
  error: null,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HistorialArchivoTab({ patientId, hasEditPermission }: Props) {
  const { data: files = [], isLoading } = useMedicalFiles(patientId);
  const upload = useUploadMedicalFile();
  const deleteFile = useDeleteMedicalFile();

  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState<UploadState>(INITIAL_UPLOAD);
  const [deleteTarget, setDeleteTarget] = useState<PatientMedicalFile | null>(null);
  const [filterCat, setFilterCat] = useState<MedicalFileCategory | "ALL">("ALL");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ── File validation + selection ───────────────────────────────────────────

  const validateAndSetFile = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setForm((p) => ({ ...p, file: null, error: "Solo PDF, JPEG, PNG o WebP." }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setForm((p) => ({ ...p, file: null, error: `Máximo ${MAX_FILE_SIZE_MB} MB.` }));
      return;
    }
    setForm((p) => ({ ...p, file, error: null }));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0];
      if (selected) validateAndSetFile(selected);
    },
    [validateAndSetFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files[0];
      if (dropped) validateAndSetFile(dropped);
    },
    [validateAndSetFile],
  );

  // ── Upload ────────────────────────────────────────────────────────────────

  async function handleUpload() {
    if (!form.file) {
      setForm((p) => ({ ...p, error: "Selecciona un archivo." }));
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
      setForm(INITIAL_UPLOAD);
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al subir"), undefined, { id: loadId });
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return;
    const loadId = notify.loading("Eliminando…");
    try {
      await deleteFile.mutateAsync({ patientId, fileId: deleteTarget.id });
      notify.success("Archivo eliminado", undefined, { id: loadId });
    } catch {
      notify.error("Error al eliminar", undefined, { id: loadId });
    } finally {
      setDeleteTarget(null);
    }
  }

  const displayed = filterCat === "ALL" ? files : files.filter((f) => f.category === filterCat);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 pb-10">
      {/* ── Visitas anteriores (Fase 3 placeholder) ── */}
      <div className="xl:col-span-2">
        <VisitHistoryPlaceholder />
      </div>

      {/* ── Repositorio de documentos ── */}
      <div className="xl:col-span-3 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-brand" />
            <h4 className="text-sm font-bold text-text-primary">Repositorio de documentos</h4>
            {files.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand/10 text-brand">{files.length}</span>
            )}
          </div>
          {hasEditPermission && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-brand text-white text-xs font-semibold rounded-xl hover:bg-brand-hover transition-colors"
            >
              <Upload size={13} />
              Subir archivo
            </button>
          )}
        </div>

        {/* Upload panel */}
        {showUpload && (
          <UploadPanel
            form={form}
            setForm={setForm}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onSubmit={handleUpload}
            onCancel={() => {
              setForm(INITIAL_UPLOAD);
              setShowUpload(false);
            }}
            isSubmitting={upload.isPending}
          />
        )}

        {/* Category filters */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <FilterChip label="Todos" count={files.length} active={filterCat === "ALL"} onClick={() => setFilterCat("ALL")} />
            {CATEGORIES.filter((c) => files.some((f) => f.category === c)).map((c) => (
              <FilterChip
                key={c}
                label={MEDICAL_FILE_CATEGORY_LABELS[c]}
                count={files.filter((f) => f.category === c).length}
                active={filterCat === c}
                onClick={() => setFilterCat(c)}
              />
            ))}
          </div>
        )}

        {/* File grid */}
        {isLoading ? (
          <FilesSkeleton />
        ) : displayed.length === 0 ? (
          <EmptyFilesState hasEditPermission={hasEditPermission} onUpload={() => setShowUpload(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayed.map((file) => (
              <FileCard key={file.id} file={file} canDelete={hasEditPermission} onDelete={() => setDeleteTarget(file)} />
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        variant="danger"
        title="Eliminar archivo"
        message={
          <span>
            ¿Eliminar <strong>{deleteTarget?.fileName}</strong>? Esta acción no se puede deshacer.
          </span>
        }
        confirmText="Eliminar"
        onConfirm={handleDelete}
      />
    </div>
  );
}

// ── Visit History Placeholder ─────────────────────────────────────────────────

function VisitHistoryPlaceholder() {
  const mockVisits = [
    { type: "Consulta general", date: "15 Oct 2023", doctor: "Dra. C. Cervantes" },
    { type: "Seguimiento", date: "02 Ago 2023", doctor: "Dra. C. Cervantes" },
    { type: "Primera consulta", date: "21 May 2023", doctor: "Dra. C. Cervantes" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-brand" />
        <h4 className="text-sm font-bold text-text-primary">Visitas anteriores</h4>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600">Fase 3</span>
      </div>

      {/* Coming soon overlay with fake data */}
      <div className="relative rounded-2xl border border-border-default overflow-hidden">
        {/* Fake visit list (blurred/locked) */}
        <div className="divide-y divide-border-default/50 opacity-40 select-none pointer-events-none">
          {mockVisits.map((v, i) => (
            <div key={i} className="flex items-start gap-3 p-4">
              <div className="flex flex-col items-center shrink-0 w-8">
                <div className="w-8 h-8 rounded-lg bg-bg-subtle flex items-center justify-center">
                  <Calendar size={13} className="text-text-disabled" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary">{v.type}</p>
                <p className="text-[11px] text-text-secondary">{v.doctor}</p>
                <p className="text-[10px] text-text-disabled mt-0.5">{v.date}</p>
              </div>
              <div className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                Atendida
              </div>
            </div>
          ))}
        </div>

        {/* Lock overlay */}
        <div className="absolute inset-0 bg-bg-surface/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Lock size={18} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-primary">Historial de consultas</p>
            <p className="text-xs text-text-secondary mt-1 max-w-[180px]">
              Disponible en la Fase 3 del sistema. Las visitas y notas clínicas se registrarán aquí.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-200">
            Próximamente
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Upload Panel ──────────────────────────────────────────────────────────────

interface UploadPanelProps {
  form: UploadState;
  setForm: React.Dispatch<React.SetStateAction<UploadState>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function UploadPanel({ form, setForm, fileInputRef, onFileChange, onDrop, onSubmit, onCancel, isSubmitting }: UploadPanelProps) {
  const [dragOver, setDragOver] = useState(false);
  const isPdf = form.file?.type === "application/pdf";

  return (
    <div className="bg-bg-base border border-brand/20 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-surface">
        <div className="flex items-center gap-2">
          <Upload size={13} className="text-brand" />
          <span className="text-sm font-semibold text-text-primary">Subir archivo médico</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="p-4 space-y-4">
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
            "border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all",
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
                {isPdf ? <FileText size={18} className="text-emerald-600" /> : <Image size={18} className="text-emerald-600" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-text-primary truncate max-w-[200px]">{form.file.name}</p>
                <p className="text-xs text-text-secondary">{formatBytes(form.file.size)}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-bg-subtle flex items-center justify-center mx-auto">
                <Upload size={16} className="text-text-secondary" />
              </div>
              <p className="text-sm font-medium text-text-primary">
                Arrastra o <span className="text-brand">selecciona</span>
              </p>
              <p className="text-xs text-text-disabled">PDF, JPEG, PNG, WebP · Máx. {MAX_FILE_SIZE_MB} MB</p>
            </div>
          )}
        </div>

        {form.error && (
          <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
            <AlertCircle size={12} />
            {form.error}
          </p>
        )}

        {/* Category */}
        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">Categoría *</label>
          <select
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as MedicalFileCategory }))}
            className="w-full px-3 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {MEDICAL_FILE_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Description / context */}
        <div className="space-y-1">
          <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">
            Descripción <span className="font-normal normal-case text-text-disabled">(opcional)</span>
          </label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Ej: Biometría hemática – antecedente previo"
            maxLength={200}
            className="w-full px-3 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all placeholder:text-text-disabled"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
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
            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            Subir
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
      {/* Preview */}
      <div className="h-24 bg-bg-subtle flex items-center justify-center relative overflow-hidden">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={file.fileUrl} alt={file.description ?? file.fileName} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <FileText size={28} className="text-red-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-disabled">PDF</span>
          </div>
        )}
        {/* Hover actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <a
            href={file.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-white/90 text-text-primary hover:bg-white transition-colors"
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

      {/* Info */}
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
        <p className="text-xs font-medium text-text-primary leading-tight truncate" title={file.description ?? file.fileName}>
          {file.description ?? file.fileName}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-text-disabled">{formatBytes(file.fileSize)}</span>
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

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
        active
          ? "bg-brand text-white border-brand"
          : "bg-bg-surface border-border-default text-text-secondary hover:border-brand/40 hover:text-brand",
      )}
    >
      {label}
      <span
        className={cn(
          "text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full",
          active ? "bg-white/20 text-white" : "bg-bg-subtle text-text-disabled",
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ── Empty + Skeleton ──────────────────────────────────────────────────────────

function EmptyFilesState({ hasEditPermission, onUpload }: { hasEditPermission: boolean; onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3 bg-bg-surface/50 rounded-2xl border border-dashed border-border-default">
      <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
        <FolderOpen size={20} className="text-text-disabled" />
      </div>
      <div>
        <p className="text-sm font-semibold text-text-primary">Sin archivos médicos</p>
        <p className="text-xs text-text-secondary mt-0.5 max-w-xs">
          Laboratorios, radiografías, recetas y otros documentos clínicos.
        </p>
      </div>
      {hasEditPermission && (
        <button
          onClick={onUpload}
          className="flex items-center gap-2 px-3 py-2 bg-brand text-white rounded-xl text-xs font-semibold hover:bg-brand-hover transition-colors"
        >
          <Upload size={13} />
          Subir primer archivo
        </button>
      )}
    </div>
  );
}

function FilesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border-default overflow-hidden">
          <div className="h-24 bg-bg-subtle" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-bg-subtle rounded w-1/3" />
            <div className="h-3 bg-bg-subtle rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
