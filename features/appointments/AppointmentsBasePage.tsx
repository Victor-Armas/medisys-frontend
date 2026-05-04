// features/appointments/AppointmentsBasePage.tsx
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Menu } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { AppointmentCalendar } from "./calendario/AppointmentCalendar";
import { AppointmentsSidebar } from "./sidebar/AppointmentsSidebar";
import { CreateAppointmentModal } from "./modales/CreateAppointmentModal";
import { DetailAppointmentModal } from "./modales/DetailAppointmentModal";
import { useAppointments } from "./hooks/useAppointments";
import { useAppointmentsFilterStore } from "./store/appointmentsFilter.store";
import { useDoctorColorsStore } from "./store/doctorColors.store";
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
  userId: string;
}

export function AppointmentsBasePage({ initialData, initialResources, role, userId }: Props) {
  const { canCreateAppointments, canManagerDoctor, isDoctor } = usePermissions(role);
  const [visibleRange, setVisibleRange] = useState<VisibleRange | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const initVisibleDoctors = useAppointmentsFilterStore((s) => s.initVisibleDoctors);
  const initColors = useDoctorColorsStore((s) => s.initForUser);
  const initClinicColors = useClinicColorsStore((s) => s.initForUser);

  const isInitialized = useRef(false);
  useEffect(() => {
    if (!isInitialized.current && initialResources.length > 0 && userId) {
      initVisibleDoctors(initialResources.map((r) => r.doctorClinicId));
      initColors(userId);
      initClinicColors(userId);
      isInitialized.current = true;
    }
  }, [initialResources, userId, initVisibleDoctors, initColors, initClinicColors]);

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
    setShowMobileSidebar(false);
  }, []);

  return (
    <div className="flex h-full w-full bg-external overflow-hidden relative space-x-4">
      {/* Overlay para móvil */}
      {showMobileSidebar && (
        <div className="absolute inset-0 bg-black/50 z-40 md:hidden" onClick={() => setShowMobileSidebar(false)} />
      )}

      {/* Sidebar - Drawer en móvil, normal en desktop */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0 h-full pl-4",
          showMobileSidebar ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <AppointmentsSidebar
          resources={initialResources}
          isDoctor={isDoctor}
          userId={userId}
          onNewAppointment={handleNewAppointment}
          onCloseMobile={() => setShowMobileSidebar(false)}
        />
      </div>

      <main className="flex-1 min-w-0 flex flex-col px-4 pt-4 gap-3 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowMobileSidebar(true)}
            className="md:hidden p-1.5 -ml-1.5 rounded-md hover:bg-black/5 text-subtitulo transition-colors"
          >
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-encabezado leading-tight">Agendar Citas</h1>
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
        userId={userId}
        canManagerDoctor={canManagerDoctor}
        appointmentId={selectedAppointmentId}
        onOpenChange={(open) => {
          if (!open) setSelectedAppointmentId(null);
        }}
      />
    </div>
  );
}
