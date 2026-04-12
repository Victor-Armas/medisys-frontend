// app/(admin)/patients/[id]/edit/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PatientFormPage } from "@/features/patients/components/PatientFormPage";
import type { Patient } from "@/features/patients/types/patient.types";

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

export default async function EditPatientPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) notFound();

  const patient = await fetchPatient(id, token);
  if (!patient) notFound();

  return <PatientFormPage patient={patient} />;
}
