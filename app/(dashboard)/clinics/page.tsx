import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Clinic } from "@features/clinics/types/clinic.types";
import { ClinicsPanelClient } from "@/features/clinics";
import { StaffRole } from "@/features/users/types";

// 1. RESPONSABILIDAD: Obtener el contexto del usuario (Auth)
async function getServerAuthContext(): Promise<{ token: string; role: StaffRole }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) {
    redirect("/login");
  }

  try {
    const userData = JSON.parse(userCookie);
    if (!userData.role) throw new Error("No role found");

    return {
      token,
      role: userData.role as StaffRole,
    };
  } catch {
    redirect("/login");
  }
}

// 2. RESPONSABILIDAD: Obtener los datos de negocio (Clínicas)
async function fetchClinicsServer(token: string): Promise<Clinic[]> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/clinics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];

    // Es vital usar await aquí antes de retornar
    const data: Clinic[] = await res.json();
    return data;
  } catch {
    return [];
  }
}

// 3. COMPONENTE ORQUESTADOR
export default async function ClinicsPage() {
  // Primero obtenemos el contexto (necesitamos el token para el fetch)
  const auth = await getServerAuthContext();

  // Luego obtenemos los datos usando el token
  const initialClinics = await fetchClinicsServer(auth.token);

  // Inyectamos ambas cosas al Client Component
  return <ClinicsPanelClient initialClinics={initialClinics} initialRole={auth.role} />;
}
