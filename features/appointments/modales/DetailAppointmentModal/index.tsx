"use client";

import dayjs from "dayjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/shared/ui/dialog";
import { useAppointmentDetail } from "../../hooks/useAppointments";
import { AppointmentStatusActions } from "./AppointmentStatusActions";
import { STATUS_CONFIG } from "../../utils/appointment.colors";
import { getAppointmentTypeLabel, isImmutableStatus, toClinicTime } from "../../utils/appointment.utils";

interface Props {
  appointmentId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function DetailAppointmentModal({ appointmentId, onOpenChange }: Props) {
  const open = !!appointmentId;
  const { appointment, isLoading } = useAppointmentDetail(appointmentId);
  const statusConfig = appointment ? STATUS_CONFIG[appointment.status] : null;

  const isPast = appointment ? dayjs(appointment.startTime).isBefore(dayjs()) : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle de la cita</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {isLoading && <div className="py-8 text-center text-subtitulo text-sm">Cargando...</div>}
          {appointment && statusConfig && (
            <div className="flex flex-col gap-4">
              {/* Status badge */}
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: statusConfig.bgColor,
                    color: statusConfig.color,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusConfig.color }} />
                  {statusConfig.label}
                </span>
                <span className="text-xs text-subtitulo">{getAppointmentTypeLabel(appointment.type)}</span>
              </div>

              {/* Info de la cita */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-subtitulo uppercase tracking-wider mb-0.5">Fecha y hora</p>
                  <p className="text-encabezado font-medium">{toClinicTime(appointment.startTime).format("DD MMM YYYY")}</p>
                  <p className="text-subtitulo text-xs">
                    {toClinicTime(appointment.startTime).format("HH:mm")} — {toClinicTime(appointment.endTime).format("HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-subtitulo uppercase tracking-wider mb-0.5">Médico</p>
                  <p className="text-encabezado font-medium">
                    {appointment.doctorClinic.doctorProfile.user.firstName}{" "}
                    {appointment.doctorClinic.doctorProfile.user.lastNamePaternal}
                  </p>
                  <p className="text-subtitulo text-xs">{appointment.doctorClinic.clinic.name}</p>
                </div>
              </div>

              {/* Paciente */}
              <div>
                <p className="text-[10px] text-subtitulo uppercase tracking-wider mb-0.5">Paciente</p>
                {appointment.patient ? (
                  <p className="text-encabezado text-sm font-medium">
                    {appointment.patient.firstName} {appointment.patient.lastNamePaternal}
                    {appointment.patient.phone && (
                      <span className="text-subtitulo font-normal ml-2 text-xs">{appointment.patient.phone}</span>
                    )}
                  </p>
                ) : (
                  <p className="text-encabezado text-sm">
                    {appointment.guestName ?? "Invitado"}
                    {appointment.guestPhone && <span className="text-subtitulo ml-2 text-xs">{appointment.guestPhone}</span>}
                  </p>
                )}
              </div>

              {/* Motivo */}
              {appointment.reason && (
                <div>
                  <p className="text-[10px] text-subtitulo uppercase tracking-wider mb-0.5">Motivo</p>
                  <p className="text-sm text-encabezado">{appointment.reason}</p>
                </div>
              )}

              {/* Notas internas */}
              {appointment.internalNotes && (
                <div className="p-2 rounded-md bg-wairning-soft/30 border border-wairning/20">
                  <p className="text-[10px] text-subtitulo uppercase tracking-wider mb-0.5">Nota interna</p>
                  <p className="text-xs text-encabezado">{appointment.internalNotes}</p>
                </div>
              )}

              {/* Acciones de estado */}
              {!isImmutableStatus(appointment.status) && isPast && (
                <div className="border-t border-disable/40 pt-3">
                  <p className="text-[10px] text-subtitulo uppercase tracking-wider mb-2">Cambiar estado</p>
                  <AppointmentStatusActions
                    appointmentId={appointment.id}
                    currentStatus={appointment.status}
                    onSuccess={() => onOpenChange(false)}
                  />
                </div>
              )}
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
