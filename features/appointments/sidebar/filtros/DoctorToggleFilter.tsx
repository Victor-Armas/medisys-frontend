"use client";

import { useMemo } from "react";
import { useAppointmentsFilterStore } from "../../store/appointmentsFilter.store";
import { useDoctorColorsStore } from "../../store/doctorColors.store";
import { getDoctorColor } from "../../utils/appointment.colors";
import type { DoctorResource } from "../../types/appointment.types";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface Props {
  resources: DoctorResource[];
}

// Estructura para agrupar las múltiples relaciones del médico
interface GroupedDoctor {
  userId: string;
  firstName: string;
  lastNamePaternal: string;
  specialty: string | null;
  clinicIds: string[]; // Arreglo de todas las clínicas donde atiende
  doctorClinicIds: string[]; // Arreglo de sus IDs de relación para el calendario
  mainDoctorClinicId: string; // Referencia para el color base
}

export function DoctorToggleFilter({ resources }: Props) {
  // Leemos el nuevo arreglo clinicFilters
  const visibleDoctorIds = useAppointmentsFilterStore((s) => s.visibleDoctorIds);
  const toggleDoctorGroup = useAppointmentsFilterStore((s) => s.toggleDoctorGroup);
  const clinicFilters = useAppointmentsFilterStore((s) => s.clinicFilters);

  const colorOverrides = useDoctorColorsStore((s) => s.overrides);
  const setDoctorColor = useDoctorColorsStore((s) => s.setDoctorColor);
  const user = useAuthStore((s) => s.user);

  // 1. Agrupar médicos por su ID de usuario real (userId)
  const groupedDoctors = useMemo(() => {
    const map = new Map<string, GroupedDoctor>();

    resources.forEach((r) => {
      if (!map.has(r.userId)) {
        map.set(r.userId, {
          userId: r.userId,
          firstName: r.firstName,
          lastNamePaternal: r.lastNamePaternal,
          specialty: r.specialty,
          clinicIds: [r.clinicId],
          doctorClinicIds: [r.doctorClinicId],
          mainDoctorClinicId: r.doctorClinicId,
        });
      } else {
        const doc = map.get(r.userId)!;
        // Agregamos las clínicas adicionales a sus arreglos si no existen
        if (!doc.clinicIds.includes(r.clinicId)) doc.clinicIds.push(r.clinicId);
        if (!doc.doctorClinicIds.includes(r.doctorClinicId)) doc.doctorClinicIds.push(r.doctorClinicId);
      }
    });

    return Array.from(map.values());
  }, [resources]);

  if (groupedDoctors.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-subtitulo uppercase tracking-wider px-1 mb-1">Médicos</p>

      {groupedDoctors.map((doc) => {
        // Un médico es visible si AL MENOS UNO de sus IDs de calendario está activo
        const isVisible = doc.doctorClinicIds.some((id) => visibleDoctorIds.includes(id));
        const color = getDoctorColor(doc.mainDoctorClinicId, resources, colorOverrides);

        // REGLA DE NEGOCIO:
        // Si hay consultorios seleccionados Y el médico NO está en ninguno de ellos, se deshabilita
        const isDisabled = clinicFilters.length > 0 && !doc.clinicIds.some((id) => clinicFilters.includes(id));

        return (
          <div
            key={doc.userId}
            className={`flex items-center gap-2 px-1 py-1.5 rounded-sm transition-colors ${
              isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-fondo-inputs"
            }`}
          >
            {/* Botón Toggle */}
            <button
              disabled={isDisabled}
              onClick={() => toggleDoctorGroup(doc.doctorClinicIds)}
              className="flex items-center gap-2 flex-1 text-left disabled:cursor-not-allowed"
              title={isVisible ? "Ocultar" : "Mostrar"}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 transition-opacity"
                style={{
                  backgroundColor: color,
                  opacity: isVisible && !isDisabled ? 1 : 0.3,
                  outline: isVisible && !isDisabled ? `2px solid ${color}` : "2px solid transparent",
                  outlineOffset: 1,
                }}
              />
              <span
                className={`text-xs transition-opacity ${
                  isVisible && !isDisabled ? "text-encabezado font-medium" : "text-subtitulo"
                }`}
              >
                {doc.firstName} {doc.lastNamePaternal}
              </span>
            </button>

            {/* Selector de Color */}
            <label
              title={isDisabled ? "No disponible en los consultorios seleccionados" : "Cambiar color"}
              className={`w-4 h-4 rounded-sm overflow-hidden shrink-0 transition-opacity ${
                isDisabled ? "opacity-10 pointer-events-none" : "cursor-pointer opacity-40 hover:opacity-100"
              }`}
              style={{ backgroundColor: color }}
            >
              <input
                type="color"
                disabled={isDisabled}
                value={color}
                onChange={(e) => {
                  if (user?.id) setDoctorColor(doc.mainDoctorClinicId, e.target.value, user.id);
                }}
                className="w-0 h-0 opacity-0 absolute"
              />
            </label>
          </div>
        );
      })}
    </div>
  );
}
