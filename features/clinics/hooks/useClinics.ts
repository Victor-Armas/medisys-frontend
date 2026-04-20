import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "@features/clinics/services/clinics.service";
import type { CreateClinicPayload, UpdateClinicPayload, Clinic } from "@features/clinics/types/clinic.types";

/*
----ESCENARIO A: Creas una clínica nueva------
  Solo necesitas que la tabla se refresque, no los detalles de las clínicas que el doctor ya tiene abiertas.

  Esto solo refresca las llaves que EMPIECEN con ["clinics", "list"]
    qc.invalidateQueries({ queryKey: clinicKeys.lists() });

-----ESCENARIO B: Editas el nombre de una clínica específica------
  Quieres que la lista se actualice Y que el detalle de esa clínica específica también.

  Refresca la lista
    qc.invalidateQueries({ queryKey: clinicKeys.lists() });
  Refresca el perfil de esa clínica
    qc.invalidateQueries({ queryKey: clinicKeys.detail(id) });

-----ESCENARIO C: El usuario cierra sesión o cambia de empresa------
  Quieres limpiar absolutamente todo rastro de clínicas de la memoria.

  Al invalidar "all", React Query busca TODO lo que empiece con ["clinics"]
  ¡Esto incluye lists, details, y cualquier otra sub-llave!
    qc.invalidateQueries({ queryKey: clinicKeys.all });
*/

export const clinicKeys = {
  all: ["clinics"] as const,
  lists: () => [...clinicKeys.all, "list"] as const,
  detail: (id: string) => [...clinicKeys.all, "detail", id] as const,
  eligibleDoctors: (clinicId: string) => [...clinicKeys.all, "eligible-doctors", clinicId] as const,
};

export function useClinics(options?: { initialData?: Clinic[] }) {
  return useQuery({
    queryKey: clinicKeys.lists(),
    queryFn: clinicsService.getAll,
    initialData: options?.initialData,
  });
}

export function useEligibleDoctors(clinicId: string) {
  return useQuery({
    queryKey: clinicKeys.eligibleDoctors(clinicId),
    queryFn: () => clinicsService.getEligibleDoctors(clinicId),
    enabled: !!clinicId,
  });
}

export function useCreateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateClinicPayload) => clinicsService.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.lists() }),
  });
}

export function useUpdateClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClinicPayload }) => clinicsService.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: clinicKeys.lists() });
      qc.invalidateQueries({ queryKey: clinicKeys.detail(id) });
    },
  });
}

export function useToggleClinic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clinicsService.toggle(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: clinicKeys.lists() });
      await qc.cancelQueries({ queryKey: clinicKeys.detail(id) });

      const previousClinics = qc.getQueryData<Clinic[]>(clinicKeys.lists());

      qc.setQueryData<Clinic[]>(clinicKeys.lists(), (oldClinics) => {
        if (!oldClinics) return [];
        return oldClinics.map((clinic) => (clinic.id === id ? { ...clinic, isActive: !clinic.isActive } : clinic));
      });

      return { previousClinics };
    },
    onError: (_error, _id, context) => {
      if (context?.previousClinics) {
        qc.setQueryData(clinicKeys.lists(), context.previousClinics);
      }
    },
    onSettled: (_data, _error, id) => {
      qc.invalidateQueries({ queryKey: clinicKeys.lists() });
      qc.invalidateQueries({ queryKey: clinicKeys.detail(id) });
    },
  });
}

export function useAssignDoctorToClinic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clinicId, payload }: { clinicId: string; payload: { doctorProfileId: string; isPrimary?: boolean } }) =>
      clinicsService.assignDoctorToClinic(clinicId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}
