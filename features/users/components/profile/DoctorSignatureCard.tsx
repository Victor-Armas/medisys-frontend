import Image from "next/image";
import { FileSignature } from "lucide-react";
import { SectionCard } from "./shared/SectionCard";
import type { DoctorProfile } from "@features/users/types/doctors.types";

interface Props {
  profile: DoctorProfile;
}

export function DoctorSignatureCard({ profile }: Props) {
  return (
    <SectionCard title="Firma digital" icon={<FileSignature size={14} />} accentColor="#7c6ab5">
      {profile.signatureUrl ? (
        <div className="p-4">
          <div className="border border-dashed border-border-strong rounded-xl p-4 flex items-center justify-center bg-bg-base min-h-[72px]">
            <Image src={profile.signatureUrl} alt="Firma digital" width={200} height={72} className="max-h-16 object-contain" />
          </div>
          <p className="text-xs text-text-secondary mt-2 text-center">Se estampa en recetas y documentos PDF</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="border border-dashed border-border-default rounded-xl h-16 flex flex-col items-center justify-center bg-bg-base gap-1">
            <FileSignature size={18} className="text-text-disabled" />
            <p className="text-xs text-text-disabled">Sin firma registrada</p>
          </div>
          <button className="w-full text-xs font-semibold py-2 border border-dashed border-border-strong rounded-xl transition-colors hover:border-brand hover:text-brand text-text-secondary">
            + Subir firma digital
          </button>
        </div>
      )}
    </SectionCard>
  );
}
