// app/(admin)/patients/new/page.tsx
import { PatientFormPage } from "@/features/patients";
import { cookies } from "next/headers";

export default async function NewPatientPage() {
  const cookieStore = await cookies();
  const clinicIdCookie = cookieStore.get("lastClinicId")?.value; // si el admin trabaja en una clínica específica
  return <PatientFormPage clinicId={clinicIdCookie} />;
}
