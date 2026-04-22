import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "@features/clinics/services/clinics.service";
import type {
  CreateClinicPayload,
  UpdateClinicPayload,
  Clinic,
  AssignDoctorPayload,
  DeactivateDoctorArgs,
} from "@features/clinics/types/clinic.types";

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
    // Usamos el tipo definido en clinic.types.ts
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClinicPayload }) => clinicsService.update(id, payload),

    onSuccess: (updatedClinic, { id }) => {
      // OPTIMIZACIÓN: En lugar de invalidar y disparar un GET,
      // actualizamos el caché directamente con la respuesta del PUT/PATCH.
      qc.setQueryData(clinicKeys.detail(id), updatedClinic);

      // La lista sí conviene invalidarla o actualizarla manualmente
      qc.invalidateQueries({ queryKey: clinicKeys.lists() });
    },
  });
}

export function useToggleClinic() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clinicsService.toggle(id),
    onMutate: async (id) => {
      // Cancelamos queries para evitar race conditions
      await qc.cancelQueries({ queryKey: clinicKeys.all });

      const previousClinics = qc.getQueryData<Clinic[]>(clinicKeys.lists());
      const previousDetail = qc.getQueryData<Clinic>(clinicKeys.detail(id));

      // UPDATE OPTIMISTA: Lista
      qc.setQueryData<Clinic[]>(clinicKeys.lists(), (old) =>
        old?.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
      );

      // UPDATE OPTIMISTA: Detalle (Faltaba en tu código original)
      if (previousDetail) {
        qc.setQueryData<Clinic>(clinicKeys.detail(id), {
          ...previousDetail,
          isActive: !previousDetail.isActive,
        });
      }

      return { previousClinics, previousDetail };
    },
    onError: (_err, id, context) => {
      // Rollback íntegro
      if (context?.previousClinics) qc.setQueryData(clinicKeys.lists(), context.previousClinics);
      if (context?.previousDetail) qc.setQueryData(clinicKeys.detail(id), context.previousDetail);
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
    mutationFn: ({ clinicId, payload }: { clinicId: string; payload: AssignDoctorPayload }) =>
      clinicsService.assignDoctorToClinic(clinicId, payload),

    onSuccess: (_data, { clinicId }) => {
      /**
       * SINCERIDAD RADICAL:
       * Usar clinicKeys.all es "matar moscas a cañonazos".
       * Invalida solo lo que este proceso toca.
       */
      qc.invalidateQueries({ queryKey: clinicKeys.detail(clinicId) });
      qc.invalidateQueries({ queryKey: clinicKeys.eligibleDoctors(clinicId) });
      qc.invalidateQueries({ queryKey: clinicKeys.lists() }); // Por si la lista muestra conteo de doctores
    },
  });
}

export function useDeactivateDoctorFromClinic() {
  const qc = useQueryClient();

  return useMutation({
    // MutationKey: Crucial para debugging en DevTools y evitar colisiones
    mutationKey: ["clinics", "deactivate-doctor"],

    mutationFn: ({ clinicId, doctorProfileId }: DeactivateDoctorArgs) =>
      clinicsService.deactivateDoctor(clinicId, doctorProfileId),

    onSuccess: (_data, { clinicId }) => {
      /**
       * ESTRATEGIA DE INVALIDACIÓN GRANULAR
       * Evitamos qc.invalidateQueries(clinicKeys.all) para prevenir
       * cascadas de peticiones innecesarias.
       */

      // 1. Invalida el detalle de la clínica (la lista de doctores activos cambió)
      qc.invalidateQueries({
        queryKey: clinicKeys.detail(clinicId),
      });

      // 2. Invalida la lista de doctores elegibles (ahora este médico debería estar disponible para ser asignado)
      qc.invalidateQueries({
        queryKey: clinicKeys.eligibleDoctors(clinicId),
      });

      // 3. Opcional: Invalida listas globales si muestran conteos de personal
      qc.invalidateQueries({
        queryKey: clinicKeys.lists(),
      });
    },

    onError: (error: Error) => {
      // Centralización de logs técnicos, dejando la notificación visual a la UI
      console.error(`[ClinicMutation] Failed to deactivate doctor: ${error.message}`);
    },
  });
}
