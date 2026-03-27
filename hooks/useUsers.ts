import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignDoctorProfile,
  createDoctor,
  createUser,
  getAllUsers,
  getUserById,
} from "@/services/users.service";
import type {
  AssignDoctorPayload,
  CreateDoctorPayload,
} from "@/types/doctors.types";
import type { CreateUserPayload, User } from "@/types/users.types";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
};

export function useUsers(options?: { initialData?: User[] }) {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getAllUsers,
    initialData: options?.initialData,
    staleTime: options?.initialData ? 30_000 : 0,
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
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useCreateDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreateDoctorPayload) => createDoctor(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useAssignDoctorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AssignDoctorPayload) => assignDoctorProfile(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}
