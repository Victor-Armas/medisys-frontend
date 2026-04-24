// features/appointments/utils/appointment.utils.ts
import dayjs from "@/shared/utils/date.utils";
import type {
  AppointmentCalendarEvent,
  AppointmentListItem,
  AppointmentStatus,
  AppointmentType,
  DoctorResource,
  ClinicWithDoctors,
} from "../types/appointment.types";
import { getDoctorColor, hexToRgba } from "./appointment.colors";

// Zona horaria del consultorio — Monterrey (UTC-6)
const CLINIC_TZ = "America/Monterrey";

// Convierte una fecha UTC del backend a hora local del consultorio
export function toClinicTime(utcIso: string): dayjs.Dayjs {
  return dayjs(utcIso).tz(CLINIC_TZ);
}

// Determina si una cita ya ocurrió
export function isPastAppointment(startTimeUtc: string): boolean {
  return dayjs(startTimeUtc).isBefore(dayjs());
}

// Estados que no admiten más cambios
export function isImmutableStatus(status: AppointmentStatus): boolean {
  return status === "COMPLETED" || status === "CANCELLED" || status === "NO_SHOW";
}

// Nombre visible del paciente/invitado para mostrar en chips
export function getPatientDisplayName(item: Pick<AppointmentListItem, "patient" | "guestName">): string {
  if (item.patient) {
    return `${item.patient.firstName} ${item.patient.lastNamePaternal}`;
  }
  return item.guestName ?? "Invitado";
}

// Etiqueta del tipo de cita
export function getAppointmentTypeLabel(type: AppointmentType): string {
  const labels: Record<AppointmentType, string> = {
    IN_PERSON: "Presencial",
    HOME_VISIT: "Domicilio",
    VIRTUAL: "Virtual",
  };
  return labels[type];
}

// Transforma la lista de clínicas del backend en DoctorResources para el calendario
export function transformClinicsToDoctorResources(clinics: ClinicWithDoctors[]): DoctorResource[] {
  return clinics.flatMap((clinic) =>
    clinic.doctorClinics
      .filter((dc) => dc.isActive && dc.doctorProfile.user.isActive)
      .map((dc) => ({
        doctorClinicId: dc.id,
        userId: dc.doctorProfile.user.id,
        firstName: dc.doctorProfile.user.firstName,
        lastNamePaternal: dc.doctorProfile.user.lastNamePaternal,
        photoUrl: dc.doctorProfile.user.photoUrl,
        specialty: dc.doctorProfile.specialty,
        clinicId: clinic.id,
        clinicName: clinic.name,
        clinicBrandColor: clinic.brandColor,
        isPrimary: dc.isPrimary,
      })),
  );
}

// Transforma appointments del backend en eventos del calendario
export function transformToCalendarEvents(
  appointments: AppointmentListItem[],
  resources: DoctorResource[],
  colorOverrides: Record<string, string>,
): AppointmentCalendarEvent[] {
  return appointments.map((appt) => {
    const doctorClinicId = appt.doctorClinic.id;
    const color = getDoctorColor(doctorClinicId, resources, colorOverrides);
    const bgColor = hexToRgba(color, 0.12);
    const localStart = toClinicTime(appt.startTime);
    const localEnd = toClinicTime(appt.endTime);

    return {
      id: appt.id,
      appointmentId: appt.id,
      start: localStart.format("YYYY-MM-DDTHH:mm:ss"),
      end: localEnd.format("YYYY-MM-DDTHH:mm:ss"),
      title: getPatientDisplayName(appt),
      type: "appointment",
      color,
      backgroundColor: bgColor,
      resourceId: doctorClinicId,
      status: appt.status,
      isPast: isPastAppointment(appt.startTime),
    };
  });
}

// Transiciones de estado válidas para mostrar botones en el modal de detalle
export function getValidTransitions(status: AppointmentStatus): AppointmentStatus[] {
  const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["IN_PROGRESS", "CANCELLED", "NO_SHOW"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED"],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
  };
  return transitions[status];
}
