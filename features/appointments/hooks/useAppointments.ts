"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRef } from "react";
import { appointmentsService } from "../services/appointments.service";
import { transformToCalendarEvents } from "../utils/appointment.utils";
import { useAppointmentsFilterStore } from "../store/appointmentsFilter.store";
import { useDoctorColorsStore } from "../store/doctorColors.store";
import { notify } from "@/shared/ui/toaster";
import { STATUS_CONFIG } from "../utils/appointment.colors";

import type {
  AppointmentsListResponse,
  DoctorResource,
  AppointmentDetail,
  CreateAppointmentPayload,
  UpdateAppointmentStatusPayload,
  AvailabilitySlotsMap,
  ListAppointmentsQuery,
} from "../types/appointment.types";
import type { VisibleRange } from "@/shared/calendar/types";

// ============================================================
// 1. QUERY KEYS (Centralizadas)
// ============================================================
export const appointmentKeys = {
  all: ["appointments"] as const,
  lists: () => [...appointmentKeys.all, "list"] as const,
  list: (filters: ListAppointmentsQuery) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, "detail"] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  availability: (doctorId: string, from: string, to: string) =>
    [...appointmentKeys.all, "availability", doctorId, from, to] as const,
  patientSearch: (query: string) => [...appointmentKeys.all, "patient-search", query] as const,
};

// ============================================================
// 2. READ HOOKS (Queries)
// ============================================================

interface UseAppointmentsOptions {
  visibleRange: VisibleRange | null;
  resources: DoctorResource[];
  initialData?: AppointmentsListResponse;
}

export function useAppointments({ visibleRange, resources, initialData }: UseAppointmentsOptions) {
  const { statusFilter, clinicFilters, typeFilter, visibleDoctorIds } = useAppointmentsFilterStore();
  const colorOverrides = useDoctorColorsStore((s) => s.overrides);

  const initialDataConsumed = useRef(false);

  const queryFilters: ListAppointmentsQuery = {
    dateFrom: visibleRange?.start.split("T")[0],
    dateTo: visibleRange?.end.split("T")[0],
    ...(statusFilter && { status: statusFilter }),
    ...(clinicFilters.length === 1 && { clinicId: clinicFilters[0] }),
    ...(typeFilter && { type: typeFilter }),
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: appointmentKeys.list(queryFilters),
    queryFn: () => appointmentsService.getAll(queryFilters),
    enabled: !!visibleRange,
    staleTime: 30 * 1000,
    refetchInterval: 1 * 60 * 1000,
    refetchOnWindowFocus: true,
    initialData: () => {
      // Si es la primera vez que carga y no hay filtros aplicados, usamos la data del SSR
      if (!initialDataConsumed.current && !statusFilter && !clinicFilters.length && !typeFilter) {
        initialDataConsumed.current = true;
        return initialData;
      }
      return undefined;
    },
  });

  const allEvents = data ? transformToCalendarEvents(data.appointments, resources, colorOverrides) : [];

  // Filtrar por médicos visibles del sidebar
  const events = visibleDoctorIds.length > 0 ? allEvents.filter((e) => visibleDoctorIds.includes(e.resourceId)) : allEvents;

  return { events, isLoading, isError };
}

export function useAppointmentDetail(id: string | null) {
  const { data, isLoading } = useQuery({
    queryKey: appointmentKeys.detail(id!),
    queryFn: () => appointmentsService.getById(id!),
    enabled: !!id,
    staleTime: 0,
  });

  return { appointment: data, isLoading };
}

export function useAvailableSlots(doctorClinicId: string | null) {
  const dateFrom = dayjs().format("YYYY-MM-DD");
  const dateTo = dayjs().add(60, "day").format("YYYY-MM-DD");

  const { data, isLoading } = useQuery<AvailabilitySlotsMap>({
    queryKey: appointmentKeys.availability(doctorClinicId!, dateFrom, dateTo),
    queryFn: () => appointmentsService.getAvailableSlots(doctorClinicId!, dateFrom, dateTo),
    enabled: !!doctorClinicId,
    staleTime: 2 * 60 * 1000,
  });

  const availabilityMap = data ?? {};
  const availableDates = Object.keys(availabilityMap)
    .filter((date) => availabilityMap[date].length > 0)
    .sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1));

  return { availabilityMap, availableDates, isLoading };
}

export function usePatientSearch(query: string) {
  const { data, isLoading } = useQuery({
    queryKey: appointmentKeys.patientSearch(query),
    queryFn: () => appointmentsService.searchPatients(query),
    enabled: query.trim().length >= 2,
    staleTime: 30 * 1000,
  });

  return { patients: data ?? [], isLoading };
}

// ============================================================
// 3. WRITE HOOKS (Mutations)
// ============================================================

export function useCreateAppointment(onSuccess?: (appt: AppointmentDetail) => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAppointmentPayload) => appointmentsService.create(payload),
    onSuccess: (appt) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      const name = appt.patient ? `${appt.patient.firstName} ${appt.patient.lastNamePaternal}` : (appt.guestName ?? "paciente");
      notify.success("Cita creada", `Cita para ${name} registrada correctamente.`);
      onSuccess?.(appt);
    },
    onError: () => notify.error("Error al crear la cita", "Verifica los datos e intenta de nuevo."),
  });
}

export function useUpdateAppointmentStatus(onSuccess?: () => void) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAppointmentStatusPayload }) =>
      appointmentsService.updateStatus(id, payload),
    onSuccess: (_, { id, payload }) => {
      qc.invalidateQueries({ queryKey: appointmentKeys.lists() });
      qc.invalidateQueries({ queryKey: appointmentKeys.detail(id) });

      const config = STATUS_CONFIG[payload.status];
      notify.success("Estado actualizado", `Cita marcada como: ${config.label}`);
      onSuccess?.();
    },
    onError: () => notify.error("Error al actualizar el estado"),
  });
}
