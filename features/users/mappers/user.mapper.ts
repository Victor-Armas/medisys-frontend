import { UnifiedUserFormData } from "@/validations/user.schema";
import { CreateDoctorPayload, CreateUserPayload } from "../types";

// Extrae solo los campos que necesita POST /api/users
export function toCreateUserPayload(data: UnifiedUserFormData): CreateUserPayload {
  return {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    middleName: data.middleName!,
    lastNamePaternal: data.lastNamePaternal,
    lastNameMaternal: data.lastNameMaternal,
    phone: data.phone!,
    role: data.role,
  };
}

// Mapea a CreateDoctorPayload — superRefine ya garantizó que los campos médicos existen
export function toCreateDoctorPayload(data: UnifiedUserFormData): CreateDoctorPayload {
  return {
    ...toCreateUserPayload(data),
    professionalLicense: data.professionalLicense!,
    address: data.address!,
    numHome: data.numHome!,
    colony: data.colony!,
    city: data.city!,
    state: data.state!,
    zipCode: data.zipCode!,
    specialty: data.specialty!,
    university: data.university!,
    fullTitle: data.fullTitle!,
  };
}
