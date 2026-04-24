"use client";

import { useMemo } from "react";
import { getClinicColor, useAppointmentsFilterStore } from "../../store/appointmentsFilter.store";
import { DoctorResource } from "../../types/appointment.types";
import { useClinicColorsStore } from "../../store/clinicColors.store";
import { useAuthStore } from "@/features/auth";

interface Props {
  resources: DoctorResource[];
}
export default function ClinicToggleFilter({ resources }: Props) {
  const clinicFilters = useAppointmentsFilterStore((s) => s.clinicFilters);
  const toggleClinic = useAppointmentsFilterStore((s) => s.toggleClinic);

  const clinicOverrides = useClinicColorsStore((s) => s.overrides);
  const setClinicColor = useClinicColorsStore((s) => s.setClinicColor);
  const user = useAuthStore((s) => s.user);

  const uniqueClinics = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    resources.forEach((r) => {
      if (!map.has(r.clinicId)) {
        map.set(r.clinicId, { id: r.clinicId, name: r.clinicName });
      }
    });
    return Array.from(map.values());
  }, [resources]);

  if (uniqueClinics.length <= 1) return null;

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-subtitulo uppercase tracking-wider px-1 mb-1">Consultorios</p>

      {uniqueClinics.map((clinic) => {
        const isActive = clinicFilters.length === 0 || clinicFilters.includes(clinic.id);
        const color = getClinicColor(clinic.id, resources, clinicOverrides);

        return (
          <div key={clinic.id} className="flex items-center gap-2 px-1 py-1 rounded-sm hover:bg-fondo-inputs transition-colors">
            <button onClick={() => toggleClinic(clinic.id)} className="flex items-center gap-2 flex-1 text-left">
              <span
                className="w-3 h-3 rounded-md shrink-0 transition-opacity"
                style={{
                  backgroundColor: color,
                  opacity: isActive ? 1 : 0.3,
                  outline: isActive ? `2px solid ${color}` : "2px solid transparent",
                  outlineOffset: 1,
                }}
              />
              <span className={`text-xs truncate ${isActive ? "text-encabezado font-medium" : "text-subtitulo"}`}>
                {clinic.name}
              </span>
            </button>

            {/* Selector de Color Manual */}
            <label
              className="w-4 h-4 rounded-sm overflow-hidden cursor-pointer opacity-40 hover:opacity-100 transition-opacity shrink-0"
              style={{ backgroundColor: color }}
            >
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  if (user?.id) setClinicColor(clinic.id, e.target.value, user.id);
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
