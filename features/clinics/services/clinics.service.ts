import api from "@shared/lib/api";
import type {
  Clinic,
  CreateClinicPayload,
  UpdateClinicPayload,
  CreateScheduleRangePayload,
  CreateScheduleOverridePayload,
  UpdateScheduleRangePayload,
  UpdateScheduleOverridePayload,
} from "@features/clinics/types/clinic.types";
import { User } from "@/features/users/types";

export const clinicsService = {
  getAll: async (): Promise<Clinic[]> => {
    const res = await api.get<Clinic[]>("/clinics");
    return res.data;
  },

  getOne: async (id: string): Promise<Clinic> => {
    const res = await api.get<Clinic>(`/clinics/${id}`);
    return res.data;
  },

  getEligibleDoctors: async (clinicId: string): Promise<User[]> => {
    const res = await api.get<User[]>(`/clinics/${clinicId}/eligible-doctors`);
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

  // ── Schedule Ranges ──────────────────────────────────────
  addSchedule: async (payload: CreateScheduleRangePayload): Promise<void> => {
    await api.post("/clinics/schedules/range", payload);
  },

  updateSchedule: async (id: string, payload: UpdateScheduleRangePayload): Promise<void> => {
    await api.patch(`/clinics/schedules/range/${id}`, payload);
  },

  removeSchedule: async (scheduleId: string): Promise<void> => {
    await api.delete(`/clinics/schedules/range/${scheduleId}`);
  },
  // ── Schedule Overrides ───────────────────────────────────
  addScheduleOverride: async (payload: CreateScheduleOverridePayload): Promise<void> => {
    await api.post("/clinics/schedules/override", payload);
  },

  updateScheduleOverride: async (id: string, payload: UpdateScheduleOverridePayload): Promise<void> => {
    await api.patch(`/clinics/schedules/override/${id}`, payload);
  },

  removeScheduleOverride: async (overrideId: string): Promise<void> => {
    await api.delete(`/clinics/schedules/override/${overrideId}`);
  },

  assignDoctorToClinic: async (clinicId: string, payload: { doctorProfileId: string; isPrimary?: boolean }): Promise<void> => {
    await api.post(`/clinics/${clinicId}/assign-doctor`, payload);
  },
};
