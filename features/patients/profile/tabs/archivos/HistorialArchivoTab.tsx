"use client";

import { useState } from "react";
import { FolderOpen, Upload } from "lucide-react";
import { notify } from "@/shared/ui/toaster";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import type { MedicalFileCategory, PatientMedicalFile } from "@/features/patients/types/patient.types";
import { useDeleteMedicalFile, useMedicalFiles } from "@/features/patients/hooks/useMedicalFiles";
import { useFileUpload } from "@/features/patients/hooks/useFileUpload";
import { MEDICAL_FILE_CATEGORY_LABELS } from "@/features/patients/constants/patient.constants";
import { CATEGORIES } from "@/features/patients/constants/archivos.constants";
import { UploadPanel } from "./UploadPanel";
import { FileCard } from "./FileCard";
import { FilesFilterChip } from "./FilesFilterChips";

interface Props {
  patientId: string;
  hasEditPermission: boolean;
}

export function HistorialArchivoTab({ patientId, hasEditPermission }: Props) {
  const { data: files = [], isLoading } = useMedicalFiles(patientId);
  const deleteFile = useDeleteMedicalFile();
  const { form, setForm, fileInputRef, handleFileChange, handleDrop, handleUpload, resetUploadForm, isUploading } =
    useFileUpload(patientId);

  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PatientMedicalFile | null>(null);
  const [filterCat, setFilterCat] = useState<MedicalFileCategory | "ALL">("ALL");

  const displayed = filterCat === "ALL" ? files : files.filter((file) => file.category === filterCat);

  async function handleUploadSubmit() {
    const success = await handleUpload();
    if (success) {
      setShowUpload(false);
    }
  }

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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 pb-10">
      <div className="xl:col-span-2">{/* <VisitHistoryPlaceholder /> */}</div>

      <div className="xl:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-principal" />
            <h4 className="text-sm font-bold text-encabezado">Repositorio de documentos</h4>
            {files.length > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-principal text-principal">{files.length}</span>
            )}
          </div>
          {hasEditPermission && (
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-principal text-white text-xs font-semibold rounded-xl hover:bg-principal-hover transition-colors"
            >
              <Upload size={13} />
              Subir archivo
            </button>
          )}
        </div>

        {showUpload && (
          <UploadPanel
            form={form}
            setForm={setForm}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onDrop={handleDrop}
            onSubmit={handleUploadSubmit}
            onCancel={() => {
              resetUploadForm();
              setShowUpload(false);
            }}
            isSubmitting={isUploading}
          />
        )}

        {files.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <FilesFilterChip
              label="Todos"
              count={files.length}
              active={filterCat === "ALL"}
              onClick={() => setFilterCat("ALL")}
            />
            {CATEGORIES.filter((category) => files.some((file) => file.category === category)).map((category) => (
              <FilesFilterChip
                key={category}
                label={MEDICAL_FILE_CATEGORY_LABELS[category]}
                count={files.filter((file) => file.category === category).length}
                active={filterCat === category}
                onClick={() => setFilterCat(category)}
              />
            ))}
          </div>
        )}

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

function EmptyFilesState({ hasEditPermission, onUpload }: { hasEditPermission: boolean; onUpload: () => void }) {
  return (
    <div className="rounded-3xl border border-dashed border-border-default p-10 text-center space-y-4 /80">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-principal/10 text-principal flex items-center justify-center">
        <Upload size={20} />
      </div>
      <div>
        <h3 className="text-base font-bold text-encabezado">No hay archivos aún</h3>
        <p className="text-sm text-subtitulo">Sube documentación médica para que esté disponible en el expediente.</p>
      </div>
      {hasEditPermission && (
        <button
          onClick={onUpload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-principal text-white text-sm font-semibold hover:bg-principal-hover transition-colors"
        >
          Subir archivo
        </button>
      )}
    </div>
  );
}

function FilesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border bg-interior h-40" />
      ))}
    </div>
  );
}
