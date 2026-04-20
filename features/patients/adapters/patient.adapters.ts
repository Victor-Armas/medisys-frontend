// features/patients/adapters/patient.adapters.ts
import type { Patient, PatientAddress } from "../types/patient.types";
import type {
  PatientFormData,
  AddressFormData,
} from "../schemas/patient.schema";

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

/**
 * Construye un objeto AddressFormData vacío.
 */
export function buildEmptyAddress(isPrimary = false): AddressFormData {
  return {
    country: "MX",
    isPrimary,
    postalCodeId: undefined,
    neighborhoodId: undefined,
    street: "",
    extNumber: "",
    intNumber: "",
    municipality: "",
    state: "",
    postalCodeInput: "",
    neighborhoodInput: "",
    foreignState: "",
    foreignCity: "",
    foreignPostalCode: "",
    foreignAddressLine: "",
  };
}

/**
 * Transforma una dirección de la API al formato de formulario AddressFormData.
 */
export function addressToForm(addr: PatientAddress): AddressFormData {
  return {
    country: addr.country ?? "MX",
    isPrimary: addr.isPrimary,
    postalCodeId: undefined,
    neighborhoodId: undefined,
    street: addr.street ?? "",
    extNumber: addr.extNumber ?? "",
    intNumber: addr.intNumber ?? "",
    municipality: addr.postalCode?.municipality?.name ?? "",
    state: addr.postalCode?.municipality?.state?.name ?? "",
    postalCodeInput: addr.postalCode?.code ?? "",
    neighborhoodInput: addr.neighborhood?.name ?? "",
    foreignState: addr.foreignState ?? "",
    foreignCity: addr.foreignCity ?? "",
    foreignPostalCode: addr.foreignPostalCode ?? "",
    foreignAddressLine: addr.foreignAddressLine ?? "",
  };
}

/**
 * Transforma los datos del formulario de dirección al Payload de la API.
 */
export function buildAddressPayload(data: AddressFormData) {
  const isMx = !data.country || data.country === "MX";
  if (isMx) {
    return {
      country: "MX",
      isPrimary: data.isPrimary ?? false,
      postalCodeId: data.postalCodeId,
      neighborhoodId: data.neighborhoodId,
      street: data.street || undefined,
      extNumber: data.extNumber || undefined,
      intNumber: data.intNumber || undefined,
    };
  }
  return {
    country: data.country,
    isPrimary: data.isPrimary ?? false,
    foreignState: data.state || data.foreignState || undefined,
    foreignCity: data.municipality || data.foreignCity || undefined,
    foreignPostalCode:
      data.postalCodeInput || data.foreignPostalCode || undefined,
    foreignAddressLine: data.street || data.foreignAddressLine || undefined,
  };
}
