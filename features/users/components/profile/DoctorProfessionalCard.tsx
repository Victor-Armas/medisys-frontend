import { Stethoscope, Award, GraduationCap, BookOpen, MapPin } from "lucide-react";
import { SectionCard } from "./shared/SectionCard";

import type { DoctorProfile } from "@features/users/types/doctors.types";
import { FieldRow } from "../shared/FieldRow";

interface Props {
  profile: DoctorProfile;
}

export function DoctorProfessionalCard({ profile }: Props) {
  const address = [
    profile.address && profile.numHome ? `${profile.address} #${profile.numHome}` : profile.address,
    profile.colony,
    profile.city,
    profile.state,
    profile.zipCode ? `C.P. ${profile.zipCode}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <SectionCard title="Perfil profesional" icon={<Stethoscope size={14} />} accentColor="#1d9e75">
      <div className="divide-y divide-border-default/50">
        <FieldRow label="Cédula profesional" value={profile.professionalLicense} mono icon={<Award size={12} />} />
        <FieldRow label="Especialidad" value={profile.specialty} icon={<Stethoscope size={12} />} />
        <FieldRow label="Universidad" value={profile.university} icon={<GraduationCap size={12} />} />
        <FieldRow label="Título completo" value={profile.fullTitle} icon={<BookOpen size={12} />} />
      </div>
      <div className="mx-4 mb-4 p-3 rounded-xl bg-bg-base border border-border-default/60">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2 flex items-center gap-1.5">
          <MapPin size={10} /> Dirección personal
        </p>
        <p className="text-sm text-text-primary leading-relaxed">{address || "—"}</p>
      </div>
    </SectionCard>
  );
}
