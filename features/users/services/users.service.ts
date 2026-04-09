import api from "@/shared/lib/api";
import type {
  AssignDoctorPayload,
  BaseDoctorProfile,
  CreateDoctorPayload,
  UpdateDoctorProfilePayload,
} from "@/features/users/types/doctors.types";
import type { CreateUserPayload, User } from "../types";
import { UpdateUserPayload } from "../types/users.types";

// ─── Staff ────────────────────────────────────────────────────────────────────

export async function getAllUsers(): Promise<User[]> {
  const [usersRes, doctorsRes] = await Promise.all([api.get<User[]>("/users"), api.get<User[]>("/doctors")]);
  const map = new Map<string, User>();
  [...usersRes.data, ...doctorsRes.data].forEach((u) => map.set(u.id, u));
  return Array.from(map.values());
}

export async function getUserById(id: string): Promise<User> {
  try {
    const res = await api.get<User>(`/doctors/${id}`);
    return res.data;
  } catch {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  }
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await api.post<User>("/users", payload);
  return res.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const res = await api.patch<User>(`/users/${id}`, payload);
  return res.data;
}

export async function uploadUserPhoto(userId: string, file: File): Promise<{ photoUrl: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<{ photoUrl: string }>(`/users/${userId}/photo`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ─── Doctors ──────────────────────────────────────────────────────────────────

export async function createDoctor(payload: CreateDoctorPayload): Promise<User> {
  const res = await api.post<User>("/doctors", payload);
  return res.data;
}

export async function assignDoctorProfile(payload: AssignDoctorPayload): Promise<User> {
  const res = await api.post<User>("/doctors/assign", payload);
  return res.data;
}

export async function updateDoctorProfile(
  doctorProfileId: string,
  payload: UpdateDoctorProfilePayload,
): Promise<BaseDoctorProfile> {
  const res = await api.patch<BaseDoctorProfile>(`/doctors/profile/${doctorProfileId}`, payload);
  return res.data;
}

export async function uploadDoctorSignature(doctorProfileId: string, file: File): Promise<{ signatureUrl: string }> {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post<{ signatureUrl: string }>(`/doctors/${doctorProfileId}/signature`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function doctorActiveToggle(doctorProfileId: string): Promise<BaseDoctorProfile> {
  const res = await api.patch<BaseDoctorProfile>(`/doctors/${doctorProfileId}/availability`);
  return res.data;
}

export async function doctorSchedulePermissionToggle(
  doctorProfileId: string,
): Promise<Pick<BaseDoctorProfile, "id" | "canManageOwnSchedule">> {
  const res = await api.patch<Pick<BaseDoctorProfile, "id" | "canManageOwnSchedule">>(
    `/doctors/${doctorProfileId}/schedule-permission`,
  );
  return res.data;
}
