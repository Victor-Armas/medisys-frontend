import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignDoctorProfile,
  createDoctor,
  createUser,
  doctorActiveToggle,
  doctorSchedulePermissionToggle,
  getAllUsers,
  getUserById,
  updateDoctorProfile,
  updateUser,
  uploadDoctorSignature,
  uploadUserPhoto,
} from "@/features/users/services/users.service";
import type { AssignDoctorPayload, CreateDoctorPayload, UpdateDoctorProfilePayload } from "@/features/users/types/doctors.types";
import { CreateUserPayload, User } from "../types";
import { notify } from "@/shared/ui/toaster";
import { UpdateUserPayload } from "../types/users.types";
import { Clinic, clinicKeys } from "@/features/clinics";

const ADMIN_STALE_TIME = 1000 * 60 * 5;

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => ["users", id] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useUsers(options?: { initialData?: User[] }) {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getAllUsers,
    initialData: options?.initialData,
    staleTime: options?.initialData ? ADMIN_STALE_TIME : 0,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}

// ─── Create mutations ─────────────────────────────────────────────────────────

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateUserPayload) => createUser(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateDoctorPayload) => createDoctor(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  });
}

export function useAssignDoctorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AssignDoctorPayload) => assignDoctorProfile(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

// ─── Update mutations ─────────────────────────────────────────────────────────

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => updateUser(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(id) });
      notify.success("Usuario actualizado correctamente");
    },
    onError: () => notify.error("Error al actualizar el usuario"),
  });
}

export function useUpdateDoctorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorProfileId, payload }: { doctorProfileId: string; payload: UpdateDoctorProfilePayload }) =>
      updateDoctorProfile(doctorProfileId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
      notify.success("Perfil médico actualizado correctamente");
    },
    onError: () => notify.error("Error al actualizar el perfil médico"),
  });
}

// ─── Upload mutations ─────────────────────────────────────────────────────────

export function useUploadUserPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) => uploadUserPhoto(userId, file),
    onSuccess: (_data, { userId }) => {
      qc.invalidateQueries({ queryKey: userKeys.detail(userId) });
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      notify.success("Foto actualizada correctamente");
    },
    onError: () => notify.error("Error al subir la foto"),
  });
}

export function useUploadDoctorSignature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ doctorProfileId, file }: { doctorProfileId: string; file: File }) =>
      uploadDoctorSignature(doctorProfileId, file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

// ─── Toggle mutations ─────────────────────────────────────────────────────────

export function useToggleDoctorAvailability() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorActiveToggle(id),

    onMutate: async (doctorId) => {
      await qc.cancelQueries({ queryKey: userKeys.lists() });
      await qc.cancelQueries({ queryKey: clinicKeys.lists() });

      const previousUsers = qc.getQueryData<User[]>(userKeys.lists());
      const previousClinics = qc.getQueryData<Clinic[]>(clinicKeys.lists());

      // optimistic update USERS cache
      qc.setQueryData<User[]>(userKeys.lists(), (old) =>
        old?.map((user) =>
          user.doctorProfile?.id === doctorId
            ? {
                ...user,
                doctorProfile: {
                  ...user.doctorProfile,
                  isAvailable: !user.doctorProfile.isAvailable,
                },
              }
            : user,
        ),
      );

      // optimistic update CLINICS cache
      qc.setQueryData<Clinic[]>(clinicKeys.lists(), (old) =>
        old?.map((clinic) => ({
          ...clinic,
          doctorClinics: clinic.doctorClinics.map((dc) =>
            dc.doctorProfile.id === doctorId
              ? {
                  ...dc,
                  doctorProfile: {
                    ...dc.doctorProfile,
                    isAvailable: !dc.doctorProfile.isAvailable,
                  },
                }
              : dc,
          ),
        })),
      );

      return { previousUsers, previousClinics };
    },

    onError: (_err, _id, context) => {
      if (context?.previousUsers) {
        qc.setQueryData(userKeys.lists(), context.previousUsers);
      }

      if (context?.previousClinics) {
        qc.setQueryData(clinicKeys.lists(), context.previousClinics);
      }
    },

    onSettled: (_data, _error, doctorId) => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: clinicKeys.lists() });
      qc.invalidateQueries({ queryKey: userKeys.detail(doctorId) });
    },
  });
}

export function useToggleSchedulePermission() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (doctorProfileId: string) => doctorSchedulePermissionToggle(doctorProfileId),

    onMutate: async (doctorProfileId) => {
      await qc.cancelQueries({ queryKey: userKeys.lists() });
      await qc.cancelQueries({ queryKey: clinicKeys.lists() });

      const previousUsers = qc.getQueryData<User[]>(userKeys.lists());
      const previousClinics = qc.getQueryData<Clinic[]>(clinicKeys.lists());

      // Optimistic update — users cache
      qc.setQueryData<User[]>(userKeys.lists(), (old) =>
        old?.map((user) =>
          user.doctorProfile?.id === doctorProfileId
            ? {
                ...user,
                doctorProfile: {
                  ...user.doctorProfile,
                  canManageOwnSchedule: !user.doctorProfile.canManageOwnSchedule,
                },
              }
            : user,
        ),
      );

      // Optimistic update — clinics cache
      qc.setQueryData<Clinic[]>(clinicKeys.lists(), (old) =>
        old?.map((clinic) => ({
          ...clinic,
          doctorClinics: clinic.doctorClinics.map((dc) =>
            dc.doctorProfile.id === doctorProfileId
              ? {
                  ...dc,
                  doctorProfile: {
                    ...dc.doctorProfile,
                    canManageOwnSchedule: !dc.doctorProfile.canManageOwnSchedule,
                  },
                }
              : dc,
          ),
        })),
      );

      return { previousUsers, previousClinics };
    },

    onError: (_err, _id, context) => {
      if (context?.previousUsers) qc.setQueryData(userKeys.lists(), context.previousUsers);
      if (context?.previousClinics) qc.setQueryData(clinicKeys.lists(), context.previousClinics);
      notify.error("Error al cambiar el permiso de auto-gestión");
    },

    onSuccess: (data) => {
      const state = data.canManageOwnSchedule ? "activada" : "desactivada";
      notify.success(`Auto-gestión de horario ${state}`);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: userKeys.lists() });
      qc.invalidateQueries({ queryKey: clinicKeys.lists() });
    },
  });
}
