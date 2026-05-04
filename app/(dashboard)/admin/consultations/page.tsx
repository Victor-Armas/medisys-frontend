import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StaffRole } from "@/features/users/types";
import { ConsultationsListPage } from "@/features/consultations/list/ConsultationsListPage";
import { ConsultationsListResponse } from "@/features/consultations/types/consultation.types";

// ── GESTIÓN DE AUTENTICACIÓN ───────────────────────────────────────────────
async function getServerAuthContext(): Promise<{ token: string; role: StaffRole }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) redirect("/login");

  try {
    const userData = JSON.parse(userCookie);
    if (!userData.role) throw new Error("No role");
    return { token, role: userData.role as StaffRole };
  } catch {
    redirect("/login");
  }
}

async function getConsultation(token: string): Promise<ConsultationsListResponse | undefined> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/consultations?limit=15&page=1`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return undefined;

    return await res.json();
  } catch {
    return undefined;
  }
}

export default async function ConsultationsPage() {
  const auth = await getServerAuthContext();
  const initialData = await getConsultation(auth.token);
  return <ConsultationsListPage role={auth.role} initialData={initialData} />;
}
