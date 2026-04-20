// app/(dashboard)/users/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { User } from "@/features/users/types/users.types";
import DoctorProfileClient from "@/features/users/profile/DoctorProfile/DoctorProfileClient";
import { isDoctor } from "@/features/users/types/doctors.types";
import UserProfileClient from "@/features/users/profile/UserProfile/UserProfileClient";
import { StaffRole } from "@/features/users/types";

type Props = {
  params: Promise<{ id: string }>;
};

// Interfaz estricta para la respuesta combinada
interface FetchUserResponse {
  user: User | null;
  role: StaffRole;
}

async function fetchUserServer(id: string): Promise<FetchUserResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    redirect("/login");
  }

  let role: StaffRole;
  try {
    const userData = JSON.parse(userCookie);
    if (!userData.role) throw new Error("No role found");
    role = userData.role as StaffRole;
  } catch {
    redirect("/login");
  }

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const headers = { Authorization: `Bearer ${token}` };

  // Buscar como doctor primero
  try {
    const doctorRes = await fetch(`${base}/doctors/${id}`, { headers, cache: "no-store" });
    if (doctorRes.ok) {
      return { user: await doctorRes.json(), role };
    }
  } catch {}

  // Buscar como usuario genérico si no es doctor
  try {
    const userRes = await fetch(`${base}/users/${id}`, { headers, cache: "no-store" });
    if (userRes.ok) {
      return { user: await userRes.json(), role };
    }
  } catch {}

  return { user: null, role };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  // Extraemos ambas variables desde la misma función
  const { user, role } = await fetchUserServer(id);

  if (!user) notFound();

  const isDoctorProfile = isDoctor(user.role);

  return <>{isDoctorProfile ? <DoctorProfileClient user={user} role={role} /> : <UserProfileClient user={user} />}</>;
}
