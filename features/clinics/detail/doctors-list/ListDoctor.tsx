import { ShieldAlert, ShieldCheck, User } from "lucide-react";
import { DoctorInClinic } from "../../types/clinic.types";
import { getName } from "@features/clinics/utils/clinic.utils";
import { Button } from "@/shared/ui/button";

interface Prop {
  doctor: DoctorInClinic;
  onSelect: (id: DoctorInClinic["id"]) => void; // Renombrado por semántica on[Event]
}

export default function ListDoctor({ doctor, onSelect }: Prop) {
  const { doctorProfile } = doctor;
  const fullName = getName(doctor);
  const canManage = doctorProfile.canManageOwnSchedule;

  return (
    <div className="bg-fondo-inputs shadow-lg p-6 flex flex-col h-full w-full transition-all hover:shadow-xl group rounded-md duration-300">
      <div className="flex-1">
        <div className="flex justify-between w-full gap-4 mb-6">
          <div className="flex items-start gap-3 min-w-0">
            <div className="bg-inner-principal p-2 rounded-sm shrink-0">
              <User className="text-principal" size={28} />
            </div>

            <div className="min-w-0">
              <h3 className="text-encabezado text-[14px] font-bold leading-tight wrap-break-word">{fullName}</h3>

              <p className="text-subtitulo text-xs mt-1 line-clamp-2">{doctorProfile.specialty ?? "Médico General"}</p>
            </div>
          </div>

          <div className="shrink-0">
            {doctorProfile.isAvailable ? (
              <p className="bg-positive text-positive-text px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Activo
              </p>
            ) : (
              <p className="bg-negative text-negative-text px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                Inactivo
              </p>
            )}
          </div>
        </div>

        <div
          className={`flex items-center gap-2 p-1 rounded-lg justify-center  ${
            canManage ? "bg-inner-secundario text-secundario-text" : "bg-disable text-subtitulo"
          }`}
        >
          {canManage ? <ShieldCheck size={16} className="shrink-0" /> : <ShieldAlert size={16} className="shrink-0" />}
          <span className="text-[11px] font-medium leading-none">
            {canManage ? "Puede gestionar su horario" : "Gestión solo por Admin"}
          </span>
        </div>
      </div>
      <Button className="mt-5 py-1" variant="primary2" onClick={() => onSelect(doctor.id)}>
        Seleccionar Médico
      </Button>
    </div>
  );
}
