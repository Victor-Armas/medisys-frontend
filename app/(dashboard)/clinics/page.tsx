import { cookies } from "next/headers";

import type { Clinic } from "@features/clinics/types/clinic.types";
import { ClinicsPanelClient } from "@/features/clinics/components/ClinicsPanelClient";

async function fetchClinicsServer(): Promise<Clinic[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return [];

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/clinics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? res.json() : [];
  } catch {
    return [];
  }
}

export default async function ClinicsPage() {
  const initialClinics = await fetchClinicsServer();
  return <ClinicsPanelClient initialClinics={initialClinics} />;
}
