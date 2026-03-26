// app/(dashboard)/users/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import type { SystemUser } from "@/types/users.types";
import { UserProfileClient } from "@/components/users/UserProfileClient";

async function fetchUserServer(id: string): Promise<SystemUser | null> {
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

export default async function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await fetchUserServer(params.id);
  if (!user) notFound();
  return <UserProfileClient user={user} />;
}
