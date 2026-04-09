"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileSignature, Upload, Check, X, Loader2 } from "lucide-react";
import { SectionCard } from "./shared/SectionCard";
import { useUploadDoctorSignature } from "@/features/users/hooks";
import type { DoctorProfile } from "@features/users/types/doctors.types";
import { notify } from "@/shared/ui/toaster";

interface Props {
  profile: DoctorProfile;
}

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp";
const MAX_SIZE_MB = 3;

export function DoctorSignatureCard({ profile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadSign = useUploadDoctorSignature();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      notify.error(`La imagen no debe superar ${MAX_SIZE_MB} MB`);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSelectedFile(file);
    e.target.value = "";
  }

  function handleUpload() {
    if (!selectedFile) return;
    const loadId = notify.loading("Subiendo firma digital...");
    uploadSign.mutate(
      {
        doctorProfileId: profile.id,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          notify.success("Firma actualizada correctamente", undefined, { id: loadId });
          setPreviewUrl(null);
          setSelectedFile(null);
        },

        onError: () => {
          notify.error("Error al subir la firma", undefined, { id: loadId });
        },
      },
    );
  }

  function handleCancel() {
    setPreviewUrl(null);
    setSelectedFile(null);
  }

  const signatureToShow = previewUrl || profile.signatureUrl;

  return (
    <SectionCard title="Firma digital" icon={<FileSignature size={14} />} accentColor="#7c6ab5">
      <div className="p-4 space-y-3">
        {/* Preview */}
        <div className="border border-dashed border-border-strong rounded-xl p-4 flex items-center justify-center bg-bg-base min-h-[200px]">
          {signatureToShow ? (
            <Image src={signatureToShow} alt="Firma digital" width={200} height={72} className="max-h-44 w-auto object-contain" />
          ) : (
            <div className="flex flex-col items-center gap-1">
              <FileSignature size={18} className="text-text-disabled" />
              <p className="text-xs text-text-disabled">Sin firma registrada</p>
            </div>
          )}
        </div>

        <p className="text-xs text-text-secondary text-center">Se coloca en recetas y documentos PDF</p>

        {/* Actions */}
        {previewUrl ? (
          <div className="flex gap-2">
            {/* Save */}
            <button
              onClick={handleUpload}
              disabled={uploadSign.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border text-white bg-green-500 hover:bg-green-700 transition disabled:bg-gray-500 disabled:text-white/70 disabled:cursor-not-allowed"
            >
              {uploadSign.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={14} />
                  Guardar
                </>
              )}
            </button>

            {/* Cancel */}
            <button
              onClick={handleCancel}
              disabled={uploadSign.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border border-border-strong text-text-secondary hover:border-brand cursor-pointer"
            >
              <X size={14} />
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploadSign.isPending}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border-strong text-xs font-semibold text-text-secondary hover:border-brand hover:text-brand transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {uploadSign.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload size={13} />
                {profile.signatureUrl ? "Reemplazar firma" : "Subir firma digital"}
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden input */}
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileChange} />
    </SectionCard>
  );
}
