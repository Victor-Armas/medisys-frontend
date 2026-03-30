export interface Schedule {
  id: string;
  weekDay: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface DoctorInClinic {
  id: string;
  isPrimary: boolean;
  isActive: boolean;
  assignedAt: string;
  schedules: Schedule[];
  doctorProfile: {
    id: string;
    specialty: string | null;
    professionalLicense: string;
    isAvailable: boolean;
    defaultAppointmentDuration: number;
    canManageOwnSchedule: boolean;
    user: {
      id: string;
      firstName: string;
      middleName: string | null;
      lastNamePaternal: string;
      lastNameMaternal: string;
      photoUrl: string | null;
      phone: string | null;
      isActive: boolean;
    };
  };
}

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  rfc: string | null;
  professionalLicense: string | null;
  brandColor: string | null;
  maxDoctors: number;
  isActive: boolean;
  createdAt: string;
  doctorClinics: DoctorInClinic[];
}

export interface CreateClinicPayload {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  rfc?: string;
  professionalLicense?: string;
  brandColor?: string;
  maxDoctors?: number;
}

export type UpdateClinicPayload = Partial<CreateClinicPayload>;

export interface CreateSchedulePayload {
  doctorClinicId: string;
  weekDay: number;
  startTime: string;
  endTime: string;
}

export type ClinicModalState =
  | "none"
  | "create-clinic"
  | "edit-clinic"
  | "add-schedule";
