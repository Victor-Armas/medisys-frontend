import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { StaffRole } from "@/features/users/types";
import { ConsultationDetailPage } from "@/features/consultations/detail/ConsultationDetailPage";
import { ConsultationResponse } from "@/features/consultations/types/consultation.types";

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

async function fetchConsultation(id: string, token: string): Promise<ConsultationResponse | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/consultations/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConsultationDetailRoute({ params }: Props) {
  const { id } = await params;
  const auth = await getServerAuthContext();
  const consultation = await fetchConsultation(id, auth.token);
  if (!consultation) notFound();
  return <ConsultationDetailPage consultation={consultation} role={auth.role} />;
}
