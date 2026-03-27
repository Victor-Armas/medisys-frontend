// services/users.service.ts
// Cubre /users (staff general) y /doctors (médicos con perfil).
// El backend tiene endpoints separados pero el frontend los unifica aquí.

import api from "@/lib/api";
import type {
  AssignDoctorPayload,
  CreateDoctorPayload,
} from "@/types/doctors.types";
import type { CreateUserPayload, User } from "@/types/users.types";

// ─── Staff general ────────────────────────────────────────────

// GET /api/users — lista todos los usuarios (admin, recep, etc.)
// GET /api/doctors — lista médicos con perfil
// Los combinamos en el hook para mostrar todo en una sola tabla
export async function getAllUsers(): Promise<User[]> {
  const [usersRes, doctorsRes] = await Promise.all([
    api.get<User[]>("/users"),
    api.get<User[]>("/doctors"),
  ]);
  // Deduplica por id (doctores aparecen en ambas listas)
  const map = new Map<string, User>();
  [...usersRes.data, ...doctorsRes.data].forEach((u) => map.set(u.id, u));
  return Array.from(map.values());
}

export async function getUserById(id: string): Promise<User> {
  // Intentar primero como doctor (trae doctorProfile)
  // Si falla, buscar como usuario genérico
  try {
    const res = await api.get<User>(`/doctors/${id}`);
    return res.data;
  } catch {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  }
}

// POST /api/users — crear admin o recepcionista
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const res = await api.post<User>("/users", payload);
  return res.data;
}

// ─── Doctores ─────────────────────────────────────────────────

// POST /api/doctors — crear doctor desde cero
export async function createDoctor(
  payload: CreateDoctorPayload
): Promise<User> {
  const res = await api.post<User>("/doctors", payload);
  return res.data;
}

// POST /api/doctors/assign — asignar perfil a usuario existente
export async function assignDoctorProfile(
  payload: AssignDoctorPayload
): Promise<User> {
  const res = await api.post<User>("/doctors/assign", payload);
  return res.data;
}
