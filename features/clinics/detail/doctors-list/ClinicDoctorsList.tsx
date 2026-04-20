"use client";

import { ArrowLeft, Users } from "lucide-react";
import { DoctorScheduleCard } from "../../schedule/doctor-card/DoctorScheduleCard";
import { useMemo, useState } from "react";
import ListDoctor from "./ListDoctor";
import { ClinicWithRelations, DoctorInClinic } from "../../types/clinic.types";
import AssignDoctorClinicCard from "./AssignDoctorClinicCard";
import { AuthUser } from "@/features/auth";

interface Props {
  doctors: DoctorInClinic[];
  clinic: ClinicWithRelations;
  canAssignDoctor: boolean;
  loggedUserId?: AuthUser["id"];
  onAssignDoctor: () => void;
  onAddSchedule: (dc: DoctorInClinic, prefillDate?: string) => void;
  onAddOverride: (dc: DoctorInClinic, prefillDate?: string) => void;
}

export function ClinicDoctorsList({
  doctors,
  clinic,
  canAssignDoctor,
  loggedUserId,
  onAddSchedule,
  onAddOverride,
  onAssignDoctor,
}: Props) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<DoctorInClinic["id"] | null>(null);

  const activeDoctor = useMemo(() => {
    // 1. Si NO es admin y hay un ID logueado, forzamos su propio perfil
    if (!canAssignDoctor && loggedUserId) {
      return doctors.find((dc) => dc.doctorProfile.user.id === loggedUserId) || null;
    }
    // 2. Si ES admin, buscamos por la selección manual de los cards
    return doctors.find((dc) => dc.id === selectedDoctorId) || null;
  }, [doctors, canAssignDoctor, loggedUserId, selectedDoctorId]);

  const canAddMoreDoctors = clinic.doctorClinics.length < clinic.maxDoctors;

  if (doctors.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full p-4">
        <div
          onClick={canAssignDoctor ? onAssignDoctor : undefined}
          className="group flex flex-col items-center justify-center text-center p-10 bg-disable/80 hover:bg-disable/20 border-2 border-dashed border-secundario-hover hover:border-secundario rounded-2xl w-full max-w-md cursor-pointer transition-all duration-200"
        >
          {/* Icono con efecto de escala en hover */}
          <div className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-200">
            <Users size={24} strokeWidth={1.5} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>

          <h4 className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 uppercase tracking-wider mb-1.5 transition-colors">
            Sin médicos asignados
          </h4>

          <p className="text-xs text-gray-400 max-w-[240px] leading-relaxed">
            Haz clic aquí para agregar un médico y comenzar a gestionar sus horarios.
          </p>
        </div>
      </div>
    );
  }

  if (!activeDoctor) {
    return (
      <div className="px-4 py-5">
        <h2 className=" text-subtitulo uppercase font-semibold text-[14px] ">Lista de doctores</h2>
        <div className="grid grid-cols-3 justify-items-center items-center mt-5 gap-10">
          {doctors.map((doctor) => (
            <ListDoctor key={doctor.id} doctor={doctor} onSelect={() => setSelectedDoctorId(doctor.id)} />
          ))}
          {canAssignDoctor && canAddMoreDoctors && <AssignDoctorClinicCard onAssignDoctor={onAssignDoctor} />}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-5 ">
      {/* Botón para regresar: Solo útil para el Admin */}
      {canAssignDoctor && (
        <button
          onClick={() => setSelectedDoctorId(null)}
          className="flex items-center gap-2 text-xs font-bold text-principal uppercase tracking-tight hover:opacity-70 transition-all mb-4"
        >
          <ArrowLeft size={14} />
          Volver a la lista
        </button>
      )}

      <DoctorScheduleCard
        doctorClinic={activeDoctor}
        // Corregido: Usamos canAssignDoctor como flag de permiso de Admin
        canManage={canAssignDoctor || activeDoctor.doctorProfile.canManageOwnSchedule}
        onAddSchedule={(_, date) => onAddSchedule(activeDoctor, date)} // Corregido: activeDoctor en vez de dc
        onAddOverride={(_, date) => onAddOverride(activeDoctor, date)} // Corregido: activeDoctor en vez de dc
      />
    </div>
  );
}
