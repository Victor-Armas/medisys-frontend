import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { StaffRole, User } from "@/features/users/types";
import dayjs from "dayjs";
import { AppointmentsBasePage, AppointmentsListResponse, transformClinicsToDoctorResources } from "@/features/appointments";

async function getServerAuthContext(): Promise<{ token: string; role: StaffRole; userId: User["id"] }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userCookie = cookieStore.get("user")?.value;

  if (!token || !userCookie) redirect("/login");

  try {
    const userData = JSON.parse(userCookie);
    if (!userData.role) throw new Error("No role");
    return { token, role: userData.role as StaffRole, userId: userData.id as User["id"] };
  } catch {
    redirect("/login");
  }
}

async function fetchInitialAppointments(token: string, dateFrom: string, dateTo: string): Promise<AppointmentsListResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/appointments?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return { appointments: [], total: 0, page: 1, limit: 100 };
    return res.json() as Promise<AppointmentsListResponse>;
  } catch {
    return { appointments: [], total: 0, page: 1, limit: 100 };
  }
}

async function fetchInitialClinics(token: string) {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/clinics`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AppointmentsPage() {
  const auth = await getServerAuthContext();

  // Rango inicial: semana actual (lunes → domingo)
  const monday = dayjs().day(1);
  const dateFrom = monday.format("YYYY-MM-DD");
  const dateTo = monday.add(6, "day").format("YYYY-MM-DD");

  const [initialData, clinics] = await Promise.all([
    fetchInitialAppointments(auth.token, dateFrom, dateTo),
    fetchInitialClinics(auth.token),
  ]);

  const initialResources = transformClinicsToDoctorResources(clinics);

  return (
    <AppointmentsBasePage initialData={initialData} initialResources={initialResources} role={auth.role} userId={auth.userId} />
  );
}
