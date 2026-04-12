// app/(admin)/patients/new/page.tsx
import { cookies } from "next/headers";
import { PatientFormPage } from "@/features/patients/components/PatientFormPage";

export default async function NewPatientPage() {
  const cookieStore = await cookies();
  const clinicIdCookie = cookieStore.get("lastClinicId")?.value; // si el admin trabaja en una clínica específica
  return <PatientFormPage clinicId={clinicIdCookie} />;
}
