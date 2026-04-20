import { UnifiedUserFormData } from "@/validations/user.schema";
import { CreateDoctorPayload, CreateUserPayload } from "../types";

// Extrae solo los campos que necesita POST /api/users
export function toCreateUserPayload(data: UnifiedUserFormData): CreateUserPayload {
  return {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    middleName: data.middleName ?? null,
    lastNamePaternal: data.lastNamePaternal,
    lastNameMaternal: data.lastNameMaternal,
    phone: data.phone ?? null,
    role: data.role,
  };
}

// Mapea a CreateDoctorPayload — superRefine ya garantizó que los campos médicos existen
export function toCreateDoctorPayload(data: UnifiedUserFormData): CreateDoctorPayload {
  const base = toCreateUserPayload(data);
  return {
    ...base,
    middleName: base.middleName ?? null,
    phone: base.phone ?? null,
    professionalLicense: data.professionalLicense!,
    address: data.address!,
    numHome: data.numHome!,
    colony: data.colony!,
    city: data.city!,
    state: data.state!,
    zipCode: data.zipCode!,
    specialty: data.specialty ?? null,
    university: data.university ?? null,
    fullTitle: data.fullTitle ?? null,
  };
}
