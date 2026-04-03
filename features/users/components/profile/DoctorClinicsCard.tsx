import { Building2 } from "lucide-react";

import { ClinicDetailItem } from "./clinic-detail/ClinicDetailItem";
import type { DoctorClinicItem, DoctorProfile } from "@features/users/types/doctors.types";
import { SectionCard } from "./shared/SectionCard";
interface Props {
  profileDoctor?: DoctorProfile | null;
}

export function DoctorClinicsCard({ profileDoctor }: Props) {
  const doctorClinic: DoctorClinicItem[] = profileDoctor?.doctorClinics ?? [];
  const activeClinics = doctorClinic.filter((c) => c.isActive);
  const apointmentDuration = profileDoctor ? profileDoctor.defaultAppointmentDuration : 30; // respaldo solo si profileDoctor no existe
  return (
    <SectionCard title="Consultorios asignados" icon={<Building2 size={14} />} accentColor="#534ab7">
      {activeClinics.length === 0 ? (
        <div className="px-5 py-10 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
            <Building2 size={20} className="text-text-disabled" />
          </div>
          <p className="text-sm font-medium text-text-secondary">Sin consultorios asignados</p>
          <p className="text-xs text-text-disabled mt-1">Asigna un consultorio para activar la gestión de citas</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {activeClinics.map((dc) => (
            <ClinicDetailItem key={dc.id} dc={dc} apointmentDuration={apointmentDuration} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
