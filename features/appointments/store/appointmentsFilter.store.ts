// features/appointments/store/appointmentsFilter.store.ts
import { create } from "zustand";
import type { AppointmentStatus, AppointmentType, DoctorResource } from "../types/appointment.types";

interface AppointmentsFilterState {
  visibleDoctorIds: string[];
  statusFilter: AppointmentStatus | null;
  clinicFilters: string[]; // <-- Arreglo para múltiples consultorios
  typeFilter: AppointmentType | null;

  // Actions
  initVisibleDoctors: (ids: string[]) => void;
  toggleDoctor: (id: string) => void; // Mantenemos el original por compatibilidad
  toggleDoctorGroup: (doctorClinicIds: string[]) => void; // El nuevo para agrupar
  toggleClinic: (clinicId: string) => void;
  setStatusFilter: (status: AppointmentStatus | null) => void;
  setTypeFilter: (type: AppointmentType | null) => void;
  resetFilters: () => void;
}

export const useAppointmentsFilterStore = create<AppointmentsFilterState>((set) => ({
  visibleDoctorIds: [],
  statusFilter: null,
  clinicFilters: [],
  typeFilter: null,

  initVisibleDoctors: (ids) => set({ visibleDoctorIds: ids }),

  // Toggle individual (original)
  toggleDoctor: (id) =>
    set((state) => ({
      visibleDoctorIds: state.visibleDoctorIds.includes(id)
        ? state.visibleDoctorIds.filter((d) => d !== id)
        : [...state.visibleDoctorIds, id],
    })),

  // Toggle grupal (nuevo para múltiples clínicas)
  toggleDoctorGroup: (doctorClinicIds) =>
    set((state) => {
      const allVisible = doctorClinicIds.every((id) => state.visibleDoctorIds.includes(id));
      if (allVisible) {
        return {
          visibleDoctorIds: state.visibleDoctorIds.filter((id) => !doctorClinicIds.includes(id)),
        };
      } else {
        const nextIds = new Set([...state.visibleDoctorIds, ...doctorClinicIds]);
        return { visibleDoctorIds: Array.from(nextIds) };
      }
    }),

  toggleClinic: (clinicId) =>
    set((state) => ({
      clinicFilters: state.clinicFilters.includes(clinicId)
        ? state.clinicFilters.filter((id) => id !== clinicId)
        : [...state.clinicFilters, clinicId],
    })),

  setStatusFilter: (status) => set({ statusFilter: status }),
  setTypeFilter: (type) => set({ typeFilter: type }),

  resetFilters: () => set({ statusFilter: null, clinicFilters: [], typeFilter: null }),
}));

export function getClinicColor(clinicId: string, resources: DoctorResource[], overrides: Record<string, string>): string {
  // 1. Prioridad: Lo que el usuario eligió manualmente (Cookie)
  const override = overrides[clinicId];
  if (override) return override;

  // 2. Segunda prioridad: El color que viene de la BD
  const resource = resources.find((r) => r.clinicId === clinicId);
  if (resource?.clinicBrandColor) return resource.clinicBrandColor;

  // 3. Fallback: Color por defecto
  return "#7405a6";
}
