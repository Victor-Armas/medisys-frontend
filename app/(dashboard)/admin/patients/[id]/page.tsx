// app/(admin)/patients/[id]/page.tsx
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { PatientProfilePage } from "@/features/patients/components/PatientProfilePage";
import type { Patient } from "@/features/patients/types/patient.types";
import { MedicalStaffRole } from "@/features/users/types/users.types";

type Props = { params: Promise<{ id: string }> };

async function fetchPatient(id: string, token: string): Promise<Patient | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

  try {
    const res = await fetch(`${base}/patients/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) notFound();

  const userCookie = cookieStore.get("user")?.value;
  let role: MedicalStaffRole;

  try {
    const user = userCookie ? JSON.parse(userCookie) : null;
    role = user?.role;

    if (!role || !user) {
      redirect("/admin/patients");
    }
  } catch {
    redirect("/login");
  }

  const patient = await fetchPatient(id, token);
  if (!patient) notFound();

  return <PatientProfilePage patient={patient} serverRole={role} />;
}
