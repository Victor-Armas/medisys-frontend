// features/patients/utils/patient.adapters.ts
import type { Patient } from "../types/patient.types";
import type { PatientFormData } from "../validations/patient.schema";

/**
 * Transforma la entidad Patient (API) al formato PatientFormData (React Hook Form)
 */
export const adaptPatientToForm = (p: Patient): PatientFormData => {
  return {
    firstName: p.firstName,
    middleName: p.middleName ?? "",
    lastNamePaternal: p.lastNamePaternal,
    lastNameMaternal: p.lastNameMaternal ?? "",
    birthDate: p.birthDate.slice(0, 10), // ISO string a YYYY-MM-DD
    gender: p.gender,
    curp: p.curp ?? "",
    phone: p.phone,
    email: p.email ?? "",
    maritalStatus: p.maritalStatus ?? undefined,
    occupation: p.occupation ?? "",
    educationLevel: p.educationLevel ?? undefined,
    bloodType: p.bloodType ?? undefined,
    emergencyContactName: p.emergencyContactName ?? "",
    emergencyContactPhone: p.emergencyContactPhone ?? "",
    emergencyContactRelation: p.emergencyContactRelation ?? "",
  };
};

/**
 * Transforma los datos del formulario al Payload que el Backend requiere.
 * Convierte strings vacíos en undefined para mantener limpia la DB.
 */
export const adaptFormToPayload = (data: PatientFormData) => {
  const sanitize = (val?: string) => (val?.trim() === "" ? undefined : val);

  return {
    firstName: data.firstName,
    middleName: sanitize(data.middleName),
    lastNamePaternal: data.lastNamePaternal,
    lastNameMaternal: sanitize(data.lastNameMaternal),
    birthDate: data.birthDate,
    gender: data.gender,
    curp: sanitize(data.curp),
    phone: data.phone,
    email: sanitize(data.email),
    maritalStatus: data.maritalStatus || undefined,
    occupation: sanitize(data.occupation),
    educationLevel: data.educationLevel || undefined,
    bloodType: data.bloodType || undefined,
    emergencyContactName: sanitize(data.emergencyContactName),
    emergencyContactPhone: sanitize(data.emergencyContactPhone),
    emergencyContactRelation: sanitize(data.emergencyContactRelation),
    clinicId: data.clinicId || undefined,
  };
};
