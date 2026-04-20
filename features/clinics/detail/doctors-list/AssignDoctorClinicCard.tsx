import { UserPlus } from "lucide-react";
import React from "react";

interface Prop {
  onAssignDoctor: () => void;
}

export default function AssignDoctorClinicCard({ onAssignDoctor }: Prop) {
  return (
    <div
      onClick={onAssignDoctor}
      className="bg-fondo-inputs flex  text-center shadow-lg  h-full w-full transition-all hover:shadow-xl group rounded-md duration-300 border-2 border-dashed border-subtitulo/50 cursor-pointer justify-center items-center "
    >
      <div className="text-subtitulo flex flex-col items-center gap-2">
        <UserPlus size={30} strokeWidth={2} />
        <p>Nuevo Medico</p>
      </div>
    </div>
  );
}
