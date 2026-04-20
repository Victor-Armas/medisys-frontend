// app/(dashboard)/users/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { User } from "@/features/users/types/users.types";
import DoctorProfileClient from "@/features/users/profile/DoctorProfile/DoctorProfileClient";
import { isDoctor } from "@/features/users/types/doctors.types";
import UserProfileClient from "@/features/users/profile/UserProfile/UserProfileClient";

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchUserServer(id: string): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const headers = { Authorization: `Bearer ${token}` };

  // Intentar primero como doctor (incluye doctorProfile)
  try {
    const doctorRes = await fetch(`${base}/doctors/${id}`, {
      headers,
      cache: "no-store",
    });
    if (doctorRes.ok) return doctorRes.json();
  } catch {}

  // Si no es doctor, buscar como usuario genérico
  try {
    const userRes = await fetch(`${base}/users/${id}`, {
      headers,
      cache: "no-store",
    });
    if (userRes.ok) return userRes.json();
  } catch {}

  return null;
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await fetchUserServer(id);
  if (!user) notFound();
  const doctorProfile = isDoctor(user?.role);
  return <>{doctorProfile ? <DoctorProfileClient user={user} /> : <UserProfileClient user={user} />}</>;
}
