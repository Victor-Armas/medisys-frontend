"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileSignature, Upload, Check, X, Loader2 } from "lucide-react";
import { useUploadDoctorSignature } from "@/features/users/hooks";
import type { DoctorProfile } from "@features/users/types/doctors.types";
import { notify } from "@/shared/ui/toaster";

interface Props {
  profile: DoctorProfile;
  canEdit?: boolean;
}

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp";
const MAX_SIZE_MB = 3;

export function DoctorSignatureCard({ profile, canEdit = true }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadSign = useUploadDoctorSignature();
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
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
          // Mantenemos la imagen visible sin depender del servidor
          setUploadedUrl(previewUrl); 
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

  // Prioridad: 1. Preview actual, 2. Imagen recién subida, 3. Imagen del servidor
  const signatureToShow = previewUrl || uploadedUrl || profile.signatureUrl;

  return (
    <div className="flex flex-col h-full w-full pt-1 pb-1">
      {/* Área principal */}
      <div className="grow flex flex-col items-center justify-center">
        {signatureToShow ? (
          <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50/50 w-full grow transition-colors hover:bg-gray-50">
            <Image
              src={signatureToShow}
              alt="Firma digital"
              width={240}
              height={100}
              className="max-h-28 w-auto object-contain mix-blend-multiply"
            />
          </div>
        ) : canEdit ? (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploadSign.isPending}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 w-full min-h-[140px] grow transition-all hover:bg-indigo-50/50 hover:border-indigo-300 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
              <Upload size={22} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="mt-3 text-center">
              <p className="text-[13px] font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">
                Subir firma digital
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">PNG, JPG o WEBP (máx. 3MB)</p>
            </div>
          </button>
        ) : (
          <div className="border border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50/50 w-full min-h-[140px] grow">
            <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100 mb-3">
              <FileSignature size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">Sin firma registrada</p>
          </div>
        )}
      </div>

      {/* Texto descriptivo sutil */}
      <p className="text-[10px] text-gray-400 text-center font-medium mt-3 mb-2 uppercase tracking-wide">
        Se coloca en recetas y documentos PDF
      </p>

      {/* Acciones */}
      {canEdit && (
        <div className="mt-auto">
          {previewUrl ? (
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploadSign.isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploadSign.isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Guardando...
                  </>
                ) : (
                  <>
                    <Check size={15} /> Guardar
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={uploadSign.isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <X size={15} className="text-gray-400" /> Cancelar
              </button>
            </div>
          ) : signatureToShow ? (
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploadSign.isPending}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-[13px] font-bold text-gray-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadSign.isPending ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Subiendo...
                </>
              ) : (
                <>
                  <Upload size={15} className="text-gray-400" /> Reemplazar firma
                </>
              )}
            </button>
          ) : null}
        </div>
      )}

      {/* Hidden input */}
      <input ref={inputRef} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={handleFileChange} />
    </div>
  );
}
