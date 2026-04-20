import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "@features/clinics/services/clinics.service";
import { clinicKeys } from "./useClinics";
import type { CreateScheduleOverridePayload, UpdateScheduleOverridePayload } from "@features/clinics/types/clinic.types";

export function useAddScheduleOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateScheduleOverridePayload) => clinicsService.addScheduleOverride(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useRemoveScheduleOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicsService.removeScheduleOverride(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}

export function useUpdateScheduleOverride() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateScheduleOverridePayload }) =>
      clinicsService.updateScheduleOverride(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.lists() }),
  });
}
