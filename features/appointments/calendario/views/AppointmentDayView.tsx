"use client";

import React, { useMemo, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { useCalendarContext } from "@/shared/calendar/CalendarContext";
import { AppointmentEventChip } from "../components/AppointmentEventChip";
import type { AppointmentCalendarEvent, DoctorResource } from "../../types/appointment.types";
import { useDoctorColorsStore } from "../../store/doctorColors.store";
import { getDoctorColor, hexToRgba } from "../../utils/appointment.colors";
import { getClinicColor, useAppointmentsFilterStore } from "../../store/appointmentsFilter.store";
import { useClinicColorsStore } from "../../store/clinicColors.store";

const HOUR_HEIGHT = 64;
const START_HOUR = 7;
const MIN_COLUMN_WIDTH = 140; // px — mínimo antes de scroll horizontal

interface Props {
  events: AppointmentCalendarEvent[];
  resources: DoctorResource[];
}

export function AppointmentDayView({ events, resources }: Props) {
  const { currentDate, onCellClick, onEventClick } = useCalendarContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stores de colores
  const doctorColorOverrides = useDoctorColorsStore((s) => s.overrides);
  const clinicColorOverrides = useClinicColorsStore((s) => s.overrides);

  //Leemos los filtros actuales
  const visibleDoctorIds = useAppointmentsFilterStore((s) => s.visibleDoctorIds);
  const clinicFilters = useAppointmentsFilterStore((s) => s.clinicFilters);

  //Derivamos qué columnas realmente deben renderizarse
  const visibleResources = useMemo(() => {
    return resources.filter((r) => {
      // Debe estar "encendido" en el filtro de médicos
      const isVisible = visibleDoctorIds.includes(r.doctorClinicId);
      // Debe pertenecer a las clínicas seleccionadas (si hay alguna seleccionada)
      const matchesClinic = clinicFilters.length === 0 || clinicFilters.includes(r.clinicId);

      return isVisible && matchesClinic;
    });
  }, [resources, visibleDoctorIds, clinicFilters]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = START_HOUR * HOUR_HEIGHT;
    }
  }, []);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const now = dayjs();
  const isToday = currentDate.isSame(now, "day");

  if (visibleResources.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-subtitulo text-sm">
        Sin médicos asignados al consultorio seleccionado.
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto bg-fondo-inputs custom-scrollbar">
      {/* Header: columna de médicos */}
      <div
        className="grid sticky top-0 z-10 bg-fondo-inputs pb-1"
        style={{
          gridTemplateColumns: `48px repeat(${visibleResources.length}, minmax(${MIN_COLUMN_WIDTH}px, 1fr))`,
          minWidth: visibleResources.length * MIN_COLUMN_WIDTH + 48,
        }}
      >
        <div />
        {/* Mapeamos sobre los médicos filtrados */}
        {visibleResources.map((resource) => {
          const doctorColor = getDoctorColor(resource.doctorClinicId, resources, doctorColorOverrides);
          const clinicColor = getClinicColor(resource.clinicId, resources, clinicColorOverrides);
          return (
            <div
              key={resource.doctorClinicId}
              className="flex flex-col items-center justify-center text-center py-2 bg-interior rounded-sm mx-0.5 border-t-2 min-w-0 overflow-hidden"
              style={{ borderTopColor: doctorColor }}
            >
              <div className="w-full px-2 mb-0.5">
                <span className="text-xs font-bold text-encabezado truncate block w-full text-center">
                  {resource.firstName} {resource.lastNamePaternal}
                </span>
              </div>
              {/* 3. AÑADIMOS EL NOMBRE DE LA CLÍNICA */}
              <p
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 truncate max-w-[90%]"
                style={{
                  backgroundColor: hexToRgba(clinicColor, 0.15),
                  color: clinicColor,
                }}
              >
                {resource.clinicName}
              </p>
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `48px repeat(${visibleResources.length}, minmax(${MIN_COLUMN_WIDTH}px, 1fr))`,
          minWidth: visibleResources.length * MIN_COLUMN_WIDTH + 48,
        }}
      >
        {/* Horas */}
        <div>
          {hours.map((h) => (
            <div key={h} className="text-right pr-2 text-[10px] text-subtitulo" style={{ height: HOUR_HEIGHT }}>
              {h.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Columnas de médicos */}
        {visibleResources.map((resource) => {
          const colEvents = events.filter((e) => e.resourceId === resource.doctorClinicId);
          const clinicColor = getClinicColor(resource.clinicId, resources, clinicColorOverrides);
          return (
            <div key={resource.doctorClinicId} className="relative border-l border-disable/30 min-w-0">
              {hours.map((h) => (
                <div
                  key={h}
                  style={{ height: HOUR_HEIGHT }}
                  onClick={(e) => {
                    if (onCellClick) {
                      onCellClick({ start: currentDate.hour(h).minute(0), resourceId: resource.doctorClinicId }, e);
                    }
                  }}
                  className="border-b border-disable/20 bg-interior hover:bg-principal/5 cursor-pointer"
                />
              ))}

              {/* Eventos del médico */}
              {colEvents.map((event) => {
                const start = dayjs(event.start);
                const end = dayjs(event.end);
                const startFraction = start.hour() + start.minute() / 60;
                const endFraction = end.hour() + end.minute() / 60;
                const duration = Math.max(0.5, endFraction - startFraction);
                const top = startFraction * HOUR_HEIGHT;
                const height = duration * HOUR_HEIGHT - 2;

                return (
                  <div key={event.id} style={{ top, height, left: 2, right: 2, position: "absolute", zIndex: 5 }}>
                    <AppointmentEventChip
                      event={event}
                      variant="block"
                      clinicColor={clinicColor}
                      onClick={onEventClick ? (e) => onEventClick(e) : undefined}
                    />
                  </div>
                );
              })}

              {/* Línea de hora actual */}
              {isToday && (
                <div
                  className="absolute left-0 right-0 h-[2px] bg-red-500 z-9 pointer-events-none"
                  style={{ top: (now.hour() + now.minute() / 60) * HOUR_HEIGHT }}
                >
                  <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
