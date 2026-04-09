export { ClinicsPanelClient } from "./components/ClinicsPanelClient";

export type {
  ClinicWithRelations as Clinic,
  DoctorInClinicContext as DoctorInClinic,
  ClinicModalState,
  ActiveModalContext,
  CreateClinicPayload,
  UpdateClinicPayload,
  CreateScheduleRangePayload,
  UpdateScheduleRangePayload,
  CreateScheduleOverridePayload,
  UpdateScheduleOverridePayload,
} from "./types/clinic.types";

export type {
  BaseScheduleRange as ScheduleRange,
  BaseScheduleOverride as ScheduleOverride,
} from "./types/schedule.types";

export type { ScheduleOverrideType } from "@/features/users/types/users.types";

export { clinicKeys } from "./hooks/useClinics";
