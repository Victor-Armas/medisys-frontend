// features/appointments/services/appointments.service.ts
import api from "@shared/lib/api"; // Cliente Axios ya configurado con interceptores de auth
import type {
  AppointmentDetail,
  AppointmentsListResponse,
  AvailabilitySlotsMap,
  CreateAppointmentPayload,
  ListAppointmentsQuery,
  PatientSearchResult,
  UpdateAppointmentStatusPayload,
} from "../types/appointment.types";

export const appointmentsService = {
  getAll: async (query: ListAppointmentsQuery): Promise<AppointmentsListResponse> => {
    const res = await api.get<AppointmentsListResponse>("/appointments", { params: query });
    return res.data;
  },

  getById: async (id: string): Promise<AppointmentDetail> => {
    const res = await api.get<AppointmentDetail>(`/appointments/${id}`);
    return res.data;
  },

  create: async (payload: CreateAppointmentPayload): Promise<AppointmentDetail> => {
    const res = await api.post<AppointmentDetail>("/appointments", payload);
    return res.data;
  },

  updateStatus: async (id: string, payload: UpdateAppointmentStatusPayload): Promise<AppointmentDetail> => {
    const res = await api.patch<AppointmentDetail>(`/appointments/${id}/status`, payload);
    return res.data;
  },

  getAvailableSlots: async (
    doctorClinicId: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<AvailabilitySlotsMap> => {
    const res = await api.get<AvailabilitySlotsMap>(`/clinics/doctors/${doctorClinicId}/availability`, {
      params: { dateFrom, dateTo },
    });
    return res.data;
  },

  searchPatients: async (query: string): Promise<PatientSearchResult[]> => {
    const res = await api.get<{ patients: PatientSearchResult[] }>("/patients", {
      params: { search: query, limit: 8 },
    });
    return res.data.patients;
  },
};
