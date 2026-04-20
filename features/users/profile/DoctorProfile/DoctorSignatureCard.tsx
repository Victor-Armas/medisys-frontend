"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileSignature, Upload, Check, X, Loader2 } from "lucide-react";
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
    <div className="flex flex-col h-full w-full pt-2">
      {/* 2. Área de previsualización (flex-grow para expandirse si sobra espacio) */}
      <div className="grow flex flex-col">
        <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 grow transition-colors hover:bg-gray-50">
          {signatureToShow ? (
            <Image
              src={signatureToShow}
              alt="Firma digital"
              width={240}
              height={100}
              className="max-h-32 w-auto object-contain mix-blend-multiply"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
                <FileSignature size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium">Sin firma registrada</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Texto descriptivo sutil */}
      <p className="text-[11px] text-gray-400 text-center font-medium my-4">Se coloca en recetas y documentos PDF</p>

      {/* 4. Acciones (mt-auto asegura que siempre estén pegadas abajo) */}
      <div className="mt-auto pb-2">
        {previewUrl ? (
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploadSign.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadSign.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Check size={16} /> Guardar
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploadSign.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <X size={16} className="text-gray-400" /> Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploadSign.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadSign.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Subiendo...
              </>
            ) : (
              <>
                <Upload size={16} className="text-gray-400" />
                {profile.signatureUrl ? "Reemplazar firma" : "Subir firma digital"}
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden input */}
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileChange} />
    </div>
  );
}
