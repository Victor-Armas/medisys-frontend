"use client";

import { useState } from "react";
import { DoctorClinicItem } from "../../types/doctors.types";
import ClinicScheduleCard from "./Calendar/ClinicScheduleCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  clinics: DoctorClinicItem[];
  viewMode: "week" | "month";
  baseDate: Date;
}

export default function CalendarDoctorCard({ clinics, viewMode, baseDate }: Props) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(clinics.length / itemsPerPage);

  const displayClinics = clinics.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const needsPlaceholder = displayClinics.length < itemsPerPage && page === 0; // Solo mostrar ESPACIO DISPONIBLE si es la primera página y hay menos de 2

  return (
    <div className="flex flex-col h-full w-full pt-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch w-full grow">
        {displayClinics.map((clinic) => (
          <div key={clinic.id} className="min-w-0" style={{ minWidth: 0 }}>
             <ClinicScheduleCard
              dc={clinic}
              viewMode={viewMode}
              baseDate={baseDate}
            />
          </div>
        ))}

        {needsPlaceholder && clinics.length <= 1 && (
          <div className="bg-disable border-2 border-dashed border-inner-secundario rounded-2xl flex flex-col items-center justify-center p-8 text-center min-h-[250px] transition-colors h-full">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Espacio Disponible</h4>
            <p className="text-xs text-gray-400 max-w-[200px]">Agrega un segundo consultorio para visualizar sus horarios aquí.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pb-2">
           <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-1 rounded-full text-subtitulo hover:text-principal hover:bg-gray-100 disabled:opacity-30 transition-all border border-transparent shadow-sm hover:shadow"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-xs font-bold text-subtitulo">
            {page + 1} / {totalPages}
          </span>
          <button 
             onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="p-1 rounded-full text-subtitulo hover:text-principal hover:bg-gray-100 disabled:opacity-30 transition-all border border-transparent shadow-sm hover:shadow"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
