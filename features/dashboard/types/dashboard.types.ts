export interface DashboardKpis {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalConsultations: number;
  newPatients: number;
  completionRate: number;
}

export interface AppointmentByDay {
  date: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface TypeCount {
  type: string;
  count: number;
}

export interface DoctorPerformanceStat {
  name: string;
  total: number;
  completed: number;
  cancelled: number;
}

export interface TopDiagnosisStat {
  description: string;
  icd10Code: string | null;
  count: number;
}

export interface GenderCount {
  gender: string;
  count: number;
}

export interface DashboardStats {
  period: { from: string; to: string };
  kpis: DashboardKpis;
  appointmentsByDay: AppointmentByDay[];
  appointmentsByStatus: StatusCount[];
  appointmentsByType: TypeCount[];
  consultationsByType: TypeCount[];
  topDiagnoses: TopDiagnosisStat[];
  doctorPerformance: DoctorPerformanceStat[];
  patientsByGender: GenderCount[];
}

export interface DashboardQuery {
  dateFrom?: string;
  dateTo?: string;
  clinicId?: string;
  doctorUserId?: string;
}

export type DateRangeKey = "7d" | "30d" | "thisMonth" | "3m" | "custom";
