import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "@features/clinics/services/clinics.service";
import { clinicKeys } from "./useClinics";
import type { CreateScheduleRangePayload, UpdateScheduleRangePayload } from "@features/clinics/types/clinic.types";

export function useAddSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateScheduleRangePayload) => clinicsService.addSchedule(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useRemoveSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (scheduleId: string) => clinicsService.removeSchedule(scheduleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateScheduleRangePayload }) =>
      clinicsService.updateSchedule(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.lists() }),
  });
}
