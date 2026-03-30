import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "@features/clinics/services/clinics.service";
import type {
  CreateClinicPayload,
  UpdateClinicPayload,
  CreateSchedulePayload,
} from "@features/clinics/types/clinic.types";

export const clinicKeys = {
  all: ["clinics"] as const,
  detail: (id: string) => ["clinics", id] as const,
};

export function useClinics() {
  return useQuery({
    queryKey: clinicKeys.all,
    queryFn: clinicsService.getAll,
  });
}

export function useCreateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateClinicPayload) => clinicsService.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useUpdateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateClinicPayload;
    }) => clinicsService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useToggleClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicsService.toggle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useAddSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateSchedulePayload) => clinicsService.addSchedule(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useRemoveSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) =>
      clinicsService.removeSchedule(scheduleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useToggleDoctorAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (doctorProfileId: string) =>
      clinicsService.toggleDoctorAvailability(doctorProfileId),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}
