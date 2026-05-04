// src/app/consultations/new/page.tsx (Ajusta tus rutas de importación)

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { StaffRole } from "@/features/users/types/users.types";
import { PatientSearchResult } from "@/features/consultations/types/consultation.types";
import ConsultationNewPage from "@/features/consultations/new/ConsultationNewPage";
import type { DoctorClinic } from "@/features/consultations/types/consultation.types";
import { AppointmentConsultation } from "@/features/appointments/types/appointment.types";

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

// ── CARGA SELECTIVA TIPADA (LAZY FETCHING) ──────────────────────────────────
// 👇 2. Tipamos el retorno de la función
async function getPreloadedPatient(patientId: string, token: string): Promise<PatientSearchResult | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    // Obtenemos los detalles del paciente desde el endpoint correcto de patients
    const response = await fetch(`${API_URL}/patients/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    // 👇 3. Casteamos el JSON a tu interfaz estricta
    return (await response.json()) as PatientSearchResult;
  } catch (error) {
    console.error("Error precargando contexto del paciente:", error);
    return null;
  }
}

async function fetchDoctorClinics(token: string): Promise<DoctorClinic[]> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  try {
    const res = await fetch(`${base}/clinics/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return [];

    // Es vital usar await aquí antes de retornar
    const data: DoctorClinic[] = await res.json();
    return data;
  } catch {
    return [];
  }
}

async function getAppointments(appointmentId: string, token: string): Promise<AppointmentConsultation | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

  try {
    const res = await fetch(`${base}/appointments/${appointmentId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Mapeamos el objeto que viene de la API a nuestra interfaz plana
    return {
      id: data.id,
      doctorClinicId: data.doctorClinic?.id,
      patientId: data.patient?.id,
      reason: data.reason,
      guestName: data.guestName,
      guestPhone: data.guestPhone,
      internalNotes: data.internalNotes,
    };
  } catch {
    return null;
  }
}

// ── COMPONENTE DE SERVIDOR (ORQUESTADOR) ────────────────────────────────────

interface PageProps {
  searchParams: Promise<{ appointmentId?: string; patientId?: string }>;
}

export default async function NewConsultationPage({ searchParams }: PageProps) {
  const auth = await getServerAuthContext();

  const params = await searchParams;
  const { appointmentId, patientId: patientIdFromUrl } = params;

  // 1. Cargamos clínicas y cita (si hay)
  const [doctorClinic, appointment] = await Promise.all([
    fetchDoctorClinics(auth.token),
    appointmentId ? getAppointments(appointmentId, auth.token) : Promise.resolve(null),
  ]);

  // 2. Determinamos el patientId final (prioridad URL, luego cita)
  const effectivePatientId = patientIdFromUrl || appointment?.patientId;

  // 3. Cargamos el paciente si tenemos un ID
  const initialPatient = effectivePatientId ? await getPreloadedPatient(effectivePatientId, auth.token) : null;

  return (
    <ConsultationNewPage
      serverRole={auth.role}
      initialPatient={initialPatient}
      doctorClinic={doctorClinic}
      appointment={appointment}
    />
  );
}
