import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { MedicalStaffRole } from "@/features/users/types/users.types";
import type { DashboardStats } from "@/features/dashboard/types/dashboard.types";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

interface AuthContext {
  token: string;
  role: MedicalStaffRole;
}

async function getServerAuthContext(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) redirect("/login");

  try {
    const userData = JSON.parse(userCookie) as { role?: MedicalStaffRole };
    if (!userData.role) throw new Error("No role found");
    return { token, role: userData.role };
  } catch {
    redirect("/login");
  }
}

async function fetchDashboardStats(token: string): Promise<DashboardStats | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/dashboard/stats`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    return res.ok ? (res.json() as Promise<DashboardStats>) : null;
  } catch {
    return null;
  }
}

export default async function DashboardRoute() {
  const { token, role } = await getServerAuthContext();
  const initialData = await fetchDashboardStats(token);

  return <DashboardPage serverRole={role} initialData={initialData} />;
}
