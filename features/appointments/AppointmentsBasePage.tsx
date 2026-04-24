// features/appointments/AppointmentsBasePage.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";
import { AppointmentCalendar } from "./calendario/AppointmentCalendar";
import { AppointmentsSidebar } from "./sidebar/AppointmentsSidebar";
import { CreateAppointmentModal } from "./modales/CreateAppointmentModal";
import { DetailAppointmentModal } from "./modales/DetailAppointmentModal";
import { useAppointments } from "./hooks/useAppointments";
import { useAppointmentsFilterStore } from "./store/appointmentsFilter.store";
import { useDoctorColorsStore } from "./store/doctorColors.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { AppointmentsListResponse, DoctorResource, AppointmentCalendarEvent } from "./types/appointment.types";
import type { VisibleRange } from "@/shared/calendar/types";
import { StaffRole } from "@/features/users/types";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useClinicColorsStore } from "./store/clinicColors.store";

interface SlotInfo {
  start: dayjs.Dayjs;
  resourceId?: string;
}

interface Props {
  initialData: AppointmentsListResponse;
  initialResources: DoctorResource[];
  role: StaffRole;
}

export function AppointmentsBasePage({ initialData, initialResources, role }: Props) {
  const { canCreateAppointments } = usePermissions(role);
  const [visibleRange, setVisibleRange] = useState<VisibleRange | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const initVisibleDoctors = useAppointmentsFilterStore((s) => s.initVisibleDoctors);
  const initColors = useDoctorColorsStore((s) => s.initForUser);
  const initClinicColors = useClinicColorsStore((s) => s.initForUser);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (initialResources.length > 0) {
      initVisibleDoctors(initialResources.map((r) => r.doctorClinicId));
    }
  }, [initialResources.length]); // eslint-disable-line

  useEffect(() => {
    if (user?.id) {
      initColors(user.id);
    }
  }, [user?.id]); // eslint-disable-line

  useEffect(() => {
    if (user?.id) {
      initClinicColors(user.id);
    }
  }, [user?.id, initClinicColors]);

  const { events, isLoading: loadingEvents } = useAppointments({
    visibleRange,
    resources: initialResources,
    initialData,
  });

  const handleCellClick = useCallback((info: { start: dayjs.Dayjs; resourceId?: string }) => {
    setSelectedSlot(info);
    setCreateModalOpen(true);
  }, []);

  const handleEventClick = useCallback((event: AppointmentCalendarEvent) => {
    setSelectedAppointmentId(event.appointmentId);
  }, []);

  const handleNewAppointment = useCallback(() => {
    setSelectedSlot(null);
    setCreateModalOpen(true);
  }, []);

  return (
    <div className="flex h-full w-full px-6 bg-external overflow-hidden">
      <AppointmentsSidebar resources={initialResources} onNewAppointment={handleNewAppointment} />
      <main className="flex-1 min-w-0 flex flex-col p-4 gap-3 overflow-hidden">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-encabezado">Agendar Citas</h1>
            {loadingEvents && <p className="text-xs text-subtitulo">Actualizando...</p>}
          </div>
        </div>

        <div className="flex-1 min-h-0 rounded-md overflow-hidden shadow-sm border border-disable/30">
          <AppointmentCalendar
            events={events}
            resources={initialResources}
            onCellClick={handleCellClick}
            onEventClick={handleEventClick}
            onVisibleRangeChange={setVisibleRange}
          />
        </div>
      </main>

      {canCreateAppointments && (
        <CreateAppointmentModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          resources={initialResources}
          slotInfo={selectedSlot}
        />
      )}

      <DetailAppointmentModal
        appointmentId={selectedAppointmentId}
        onOpenChange={(open) => {
          if (!open) setSelectedAppointmentId(null);
        }}
      />
    </div>
  );
}
