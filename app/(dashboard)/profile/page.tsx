import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@/features/users/types/users.types";
import DoctorProfileClient from "@/features/users/profile/DoctorProfile/DoctorProfileClient";
import UserProfileClient from "@/features/users/profile/UserProfile/UserProfileClient";
import { isDoctor } from "@/features/users/types/doctors.types";

async function fetchOwnProfile(token: string): Promise<User | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    // GET /api/auth/me returns the JWT payload; we need the full user object.
    // We fetch both doctor and user endpoints and return whichever succeeds.
    const meRes = await fetch(`${base}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!meRes.ok) return null;

    const me: { id: string; role: string } = await meRes.json();

    // Try doctor endpoint first (includes doctorProfile)
    if (me.role === "DOCTOR" || me.role === "MAIN_DOCTOR") {
      const doctorRes = await fetch(`${base}/doctors/${me.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (doctorRes.ok) return doctorRes.json();
    }

    // Fallback to users endpoint
    const userRes = await fetch(`${base}/users/${me.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return userRes.ok ? userRes.json() : null;
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const user = await fetchOwnProfile(token);
  if (!user) redirect("/login");

  const doctorProfile = isDoctor(user?.role);

  return <>{doctorProfile ? <DoctorProfileClient user={user} /> : <UserProfileClient user={user} />}</>;
}
