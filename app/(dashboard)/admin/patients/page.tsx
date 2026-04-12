// app/(admin)/patients/page.tsx
import { PatientListItem, PatientsListClient } from "@/features/patients";
import { StaffRole } from "@/features/users/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PatientsResponse {
  patients: PatientListItem[];
  total: number;
  role: StaffRole;
}

async function fetchPatientsServer(): Promise<PatientsResponse> {
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
    redirect("/auth/login");
  }
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/patients?page=1&limit=25`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return { patients: [], total: 0, role };
    const data = await res.json();
    return {
      patients: Array.isArray(data) ? data : data.patients || [],
      total: data.total || (Array.isArray(data) ? data.length : 0),
      role,
    };
  } catch (error) {
    console.error("Error fetching patients:", error);
    return { patients: [], total: 0, role };
  }
}

export default async function PatientsPage() {
  const { patients, total, role } = await fetchPatientsServer();
  return <PatientsListClient initialData={{ patients, total }} serverRole={role} />;
}
