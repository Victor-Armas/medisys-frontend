"use client";

import { useCallback, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { notify } from "@/shared/ui/toaster";
import { useUploadMedicalFile } from "./useMedicalFiles";
import {
  ALLOWED_TYPES,
  INITIAL_UPLOAD,
  MAX_FILE_SIZE_MB,
  UploadState,
} from "../constants/archivos.constants";

export function useFileUpload(patientId: string) {
  const upload = useUploadMedicalFile();
  const [form, setForm] = useState<UploadState>(INITIAL_UPLOAD);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setForm((prev) => ({
        ...prev,
        file: null,
        error: "Solo PDF, JPEG, PNG o WebP.",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setForm((prev) => ({
        ...prev,
        file: null,
        error: `Máximo ${MAX_FILE_SIZE_MB} MB.`,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, file, error: null }));
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        validateAndSetFile(selectedFile);
      }
    },
    [validateAndSetFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
      }
    },
    [validateAndSetFile],
  );

  const resetUploadForm = useCallback(() => {
    setForm(INITIAL_UPLOAD);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!form.file) {
      setForm((prev) => ({ ...prev, error: "Selecciona un archivo." }));
      return false;
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
      resetUploadForm();
      return true;
    } catch (err) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      notify.error(
        Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al subir"),
        undefined,
        { id: loadId },
      );
      return false;
    }
  }, [form, patientId, resetUploadForm, upload]);

  return {
    form,
    setForm,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleUpload,
    resetUploadForm,
    isUploading: upload.isPending,
  };
}
