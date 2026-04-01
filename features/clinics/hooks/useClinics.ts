import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "@features/clinics/services/clinics.service";
import type { CreateClinicPayload, UpdateClinicPayload, CreateSchedulePayload, Clinic } from "@features/clinics/types/clinic.types";

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
  all: ["clinics"] as const, // El identificador base.
  lists: () => [...clinicKeys.all, "list"] as const, // Para listas con filtros o paginación. ["clinics", "list"]
  detail: (id: string) => [...clinicKeys.all, "detail", id] as const, // Para una clínica específica. // ["clinics", "detail", "id-123"]
};

export function useClinics(options?: { initialData?: Clinic[] }) {
  return useQuery({
    queryKey: clinicKeys.lists(),
    queryFn: clinicsService.getAll,
    initialData: options?.initialData,
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
      await qc.cancelQueries({ queryKey: clinicKeys.detail(id) }); // 1. Cancelar peticiones

      const previousClinics = qc.getQueryData<Clinic[]>(clinicKeys.lists()); // 2. Guardar el estado previo

      // 3. Actualizar la caché
      qc.setQueryData<Clinic[]>(clinicKeys.lists(), (oldClinics) => {
        if (!oldClinics) return [];
        return oldClinics.map((clinic) => (clinic.id === id ? { ...clinic, isActive: !clinic.isActive } : clinic));
      });

      return { previousClinics }; // 4. Retornar el contexto con el respaldo
    },

    // Si la mutación falla, usamos el respaldo para revertir la UI
    onError: (_error, _id, context) => {
      if (context?.previousClinics) {
        qc.setQueryData(clinicKeys.lists(), context.previousClinics);
      }
    },

    // Siempre, al terminar (éxito o error), nos sincronizamos con el backend
    onSettled: (_data, _error, id) => {
      qc.invalidateQueries({ queryKey: clinicKeys.lists() });
      qc.invalidateQueries({ queryKey: clinicKeys.detail(id) });
    },
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
    mutationFn: (scheduleId: string) => clinicsService.removeSchedule(scheduleId),
    onSuccess: () => qc.invalidateQueries({ queryKey: clinicKeys.all }),
  });
}
