import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { PatientListItem } from "../types/patient.types";
import { getPatientAge, getPatientFullName, getPatientInitials } from "../utils/patient.utils";
import { BLOOD_TYPE_LABELS, GENDER_LABELS } from "../constants/patient.constants";
import { BT_BADGE } from "../constants/bloodType.constants";

interface Props {
  patient: PatientListItem;
  isLast: boolean;
  onClick: () => void;
}

export function PatientRow({ patient, isLast, onClick }: Props) {
  const initials = getPatientInitials(patient);
  const fullName = getPatientFullName(patient);
  const age = getPatientAge(patient.birthDate);
  const clinic = patient.clinics[0]?.clinic;

  return (
    <tr
      onClick={onClick}
      className={cn(
        "group cursor-pointer transition-colors duration-150",
        "hover:bg-secundario/5",
        !isLast && "border-b ",
        !patient.isActive && "opacity-70",
      )}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold",
              "bg-principal-gradient",
              !patient.isActive && "opacity-40",
            )}
          >
            {initials}
          </div>

          <div>
            <p className="text-[13.5px] font-semibold text-encabezado leading-tight transition-colors group-hover:text-principal">
              {fullName}
            </p>
            {patient.curp && <p className="text-[10px] text-subtitulo font-mono mt-0.5">{patient.curp}</p>}
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-encabezado">{age} años</span>
        <span className="text-xs text-subtitulo ml-2">{GENDER_LABELS[patient.gender]}</span>
      </td>

      <td className="px-5 py-4">
        <p className="text-[12.5px] text-encabezado">{patient.phone}</p>
        {patient.email && <p className="text-[11px] text-subtitulo">{patient.email}</p>}
      </td>

      <td className="px-5 py-4">
        {patient.bloodType ? (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border tracking-wide transition-colors",
              BT_BADGE[patient.bloodType],
            )}
          >
            {BLOOD_TYPE_LABELS[patient.bloodType]}
          </span>
        ) : (
          <span className="text-[11px] text-subtitulo italic">Sin registro</span>
        )}
      </td>

      <td className="px-5 py-4">
        <span className="text-[12.5px] text-encabezado">{clinic?.name ?? "—"}</span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", patient.isActive ? "bg-emerald-500" : "bg-zinc-400")} />
          <span
            className={cn(
              "text-[12px] font-semibold",
              patient.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-text-muted",
            )}
          >
            {patient.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
      </td>

      <td className="px-5 py-4 text-right">
        <ChevronRight
          size={15}
          className="text-subtitulo opacity-0 group-hover:opacity-100 group-hover:text-principal transition-all ml-auto"
        />
      </td>
    </tr>
  );
}
