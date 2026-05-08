"use client";

import { useState } from "react";
import { Calendar, CheckCircle2, XCircle, UserX, Users, Stethoscope } from "lucide-react";
import { useDashboard } from "./hooks/useDashboard";
import { buildQueryFromRange } from "./utils/dashboard.utils";
import { KpiCard } from "./components/KpiCard";
import { ChartCard } from "./components/ChartCard";
import { DateRangeSelector } from "./components/DateRangeSelector";
import { AppointmentsTrendChart } from "./components/AppointmentsTrendChart";
import { StatusDonutChart } from "./components/StatusDonutChart";
import { ConsultationTypesChart } from "./components/ConsultationTypesChart";
import { TopDiagnosesChart } from "./components/TopDiagnosesChart";
import { DoctorPerformanceChart } from "./components/DoctorPerformanceChart";
import { CompletionRateWidget } from "./components/CompletionRateWidget";
import { EmptyChartState } from "./components/EmptyChartState";
import { usePermissions } from "@/shared/hooks/usePermissions";
import type { DashboardStats, DateRangeKey } from "./types/dashboard.types";
import type { MedicalStaffRole } from "@/features/users/types/users.types";
import { RouteSystemLoader } from "@/shared/animations/RouteSystemLoader";

interface DashboardPageProps {
  serverRole: MedicalStaffRole;
  initialData: DashboardStats | null;
}

export function DashboardPage({ serverRole, initialData }: DashboardPageProps) {
  const { isAdminOrMain } = usePermissions(serverRole);

  const today = new Date().toISOString().slice(0, 10);
  const [activeRange, setActiveRange] = useState<DateRangeKey>("thisMonth");
  const [customFrom, setCustomFrom] = useState(today);
  const [customTo, setCustomTo] = useState(today);

  const query = buildQueryFromRange(activeRange, customFrom, customTo);

  // Solo usamos el initialData (que es el de "Este mes") si estamos en ese filtro
  const isInitialFilter = activeRange === "thisMonth";
  const { data, isLoading, isFetching, refetch } = useDashboard(
    query, 
    isInitialFilter ? (initialData ?? undefined) : undefined
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <RouteSystemLoader />
      </div>
    );
  }

  const kpis = data?.kpis;

  return (
    <div className="flex flex-col gap-5 p-6 overflow-y-auto custom-scrollbar max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-encabezado">Dashboard</h1>
          <p className="text-sm text-subtitulo mt-0.5">
            {new Date().toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <DateRangeSelector
          activeRange={activeRange}
          customFrom={customFrom}
          customTo={customTo}
          isFetching={isFetching}
          onRangeChange={setActiveRange}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          onRefresh={refetch}
        />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiCard icon={Calendar} label="Citas totales" value={kpis?.totalAppointments ?? 0} color="purple" />
        <KpiCard
          icon={CheckCircle2}
          label="Completadas"
          value={kpis?.completedAppointments ?? 0}
          sub={`${kpis?.completionRate ?? 0}% de cumplimiento`}
          color="green"
        />
        <KpiCard icon={XCircle} label="Canceladas" value={kpis?.cancelledAppointments ?? 0} color="red" />
        <KpiCard icon={UserX} label="No se presentó" value={kpis?.noShowAppointments ?? 0} color="amber" />
        <KpiCard icon={Users} label="Pacientes nuevos" value={kpis?.newPatients ?? 0} color="blue" />
        <KpiCard icon={Stethoscope} label="Consultas" value={kpis?.totalConsultations ?? 0} color="purple" />
      </div>

      {/* Trend */}
      <ChartCard title="Tendencia de citas">
        {data?.appointmentsByDay.length ? <AppointmentsTrendChart data={data.appointmentsByDay} /> : <EmptyChartState />}
      </ChartCard>

      {/* Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Estado de citas">
          {data?.appointmentsByStatus.length ? <StatusDonutChart data={data.appointmentsByStatus} /> : <EmptyChartState />}
        </ChartCard>

        <ChartCard title="Tipos de consulta">
          {data?.consultationsByType.length ? <ConsultationTypesChart data={data.consultationsByType} /> : <EmptyChartState />}
        </ChartCard>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Top diagnósticos">
          {data?.topDiagnoses.length ? <TopDiagnosesChart data={data.topDiagnoses} /> : <EmptyChartState />}
        </ChartCard>

        {isAdminOrMain && (
          <ChartCard title="Rendimiento por médico">
            {data?.doctorPerformance.length ? <DoctorPerformanceChart data={data.doctorPerformance} /> : <EmptyChartState />}
          </ChartCard>
        )}
      </div>

      {/* Completion rate */}
      {kpis && (
        <CompletionRateWidget
          rate={kpis.completionRate}
          completed={kpis.completedAppointments}
          cancelled={kpis.cancelledAppointments}
          noShow={kpis.noShowAppointments}
          total={kpis.totalAppointments}
        />
      )}
    </div>
  );
}
