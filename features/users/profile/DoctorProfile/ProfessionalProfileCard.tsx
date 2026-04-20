"use client";

import { BaseDoctorProfile } from "../../types/doctors.types";

interface Props {
  doctor?: BaseDoctorProfile | null;
}

export default function ProfessionalProfileCard({ doctor }: Props) {
  const duration = doctor?.defaultAppointmentDuration;
  return (
    <div className="space-y-4">
      <div className="flex justify-between bg-external p-3 mt-3 rounded-md">
        <p className="text-subtitulo">Cedula Profesional:</p>
        <span className="text-principal tracking-widest font-semibold">{doctor?.professionalLicense}</span>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <h3 className="text-subtitulo text-xs font-medium uppercase">Especialidad</h3>
          <p className="text-encabezado text-md mt-1">{doctor?.specialty ? doctor?.specialty : "Sin registro"}</p>
        </div>
        <div>
          <h3 className="text-subtitulo text-xs font-medium uppercase">Universidad</h3>
          <p className="text-encabezado text-md mt-1">{doctor?.university ? doctor?.university : "Sin registro"}</p>
        </div>
      </div>

      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Duracion por Consulta</h3>
        <p className="text-encabezado text-md mt-1">
          {duration ? (duration >= 60 ? duration + " Hora" : duration + " Minutos") : "Sin registro"}
        </p>
      </div>
    </div>
  );
}
