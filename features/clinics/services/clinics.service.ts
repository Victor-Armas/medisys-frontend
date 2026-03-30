import api from "@shared/lib/api";
import type {
  Clinic,
  CreateClinicPayload,
  UpdateClinicPayload,
  CreateSchedulePayload,
} from "@features/clinics/types/clinic.types";

export const clinicsService = {
  getAll: async (): Promise<Clinic[]> => {
    const res = await api.get<Clinic[]>("/clinics");
    return res.data;
  },

  getOne: async (id: string): Promise<Clinic> => {
    const res = await api.get<Clinic>(`/clinics/${id}`);
    return res.data;
  },

  create: async (payload: CreateClinicPayload): Promise<Clinic> => {
    const res = await api.post<Clinic>("/clinics", payload);
    return res.data;
  },

  update: async (id: string, payload: UpdateClinicPayload): Promise<Clinic> => {
    const res = await api.patch<Clinic>(`/clinics/${id}`, payload);
    return res.data;
  },

  toggle: async (id: string): Promise<Clinic> => {
    const res = await api.patch<Clinic>(`/clinics/${id}/toggle`);
    return res.data;
  },

  addSchedule: async (payload: CreateSchedulePayload): Promise<void> => {
    await api.post("/clinics/schedules", payload);
  },

  removeSchedule: async (scheduleId: string): Promise<void> => {
    await api.delete(`/clinics/schedules/${scheduleId}`);
  },

  toggleDoctorAvailability: async (doctorProfileId: string): Promise<void> => {
    await api.patch(`/clinics/doctors/${doctorProfileId}/availability`);
  },
};
