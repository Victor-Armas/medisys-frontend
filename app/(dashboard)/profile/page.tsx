// app/(dashboard)/profile/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { User } from "@/features/users/types/users.types";
import DoctorProfileClient from "@/features/users/profile/DoctorProfile/DoctorProfileClient";
import UserProfileClient from "@/features/users/profile/UserProfile/UserProfileClient";
import { isDoctor } from "@/features/users/types/doctors.types";
import { StaffRole } from "@/features/users/types";

// Interfaz estricta para la respuesta combinada
interface FetchOwnProfileResponse {
  user: User | null;
  role: StaffRole;
}

async function fetchOwnProfileServer(): Promise<FetchOwnProfileResponse> {
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

  try {
    // 1. Obtener ID del usuario actual
    const meRes = await fetch(`${base}/auth/me`, { headers, cache: "no-store" });
    if (!meRes.ok) return { user: null, role };

    const me: { id: string; role: string } = await meRes.json();

    // 2. Traer perfil completo si es doctor
    if (me.role === "DOCTOR" || me.role === "MAIN_DOCTOR") {
      const doctorRes = await fetch(`${base}/doctors/${me.id}`, { headers, cache: "no-store" });
      if (doctorRes.ok) {
        return { user: await doctorRes.json(), role };
      }
    }

    // 3. Traer perfil completo genérico
    const userRes = await fetch(`${base}/users/${me.id}`, { headers, cache: "no-store" });
    return {
      user: userRes.ok ? await userRes.json() : null,
      role,
    };
  } catch {
    return { user: null, role };
  }
}

export default async function ProfilePage() {
  // Extraemos ambas variables de tu función unificada
  const { user, role } = await fetchOwnProfileServer();

  if (!user) redirect("/login");

  const isDoctorProfile = isDoctor(user.role);

  return <>{isDoctorProfile ? <DoctorProfileClient user={user} role={role} /> : <UserProfileClient user={user} />}</>;
}
