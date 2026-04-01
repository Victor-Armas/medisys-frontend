import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignDoctorProfile, createDoctor, createUser, doctorActiveToggle, getAllUsers, getUserById } from "@/features/users/services/users.service";
import type { AssignDoctorPayload, CreateDoctorPayload, DoctorProfile } from "@/features/users/types/doctors.types";
import { CreateUserPayload, User } from "../types";
import { Clinic, clinicKeys } from "@/features/clinics";

const ADMIN_STALE_TIME = 1000 * 60 * 5;

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => ["users", id] as const,
};

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
