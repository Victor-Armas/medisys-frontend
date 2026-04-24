"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useUpdateAppointmentStatus } from "../../hooks/useAppointments";
import { STATUS_CONFIG } from "../../utils/appointment.colors";
import { getValidTransitions } from "../../utils/appointment.utils";
import type { AppointmentStatus } from "../../types/appointment.types";

interface Props {
  appointmentId: string;
  currentStatus: AppointmentStatus;
  onSuccess: () => void;
}

export function AppointmentStatusActions({ appointmentId, currentStatus, onSuccess }: Props) {
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelReason, setShowCancelReason] = useState(false);

  const { mutate, isPending } = useUpdateAppointmentStatus(onSuccess);

  const validTransitions = getValidTransitions(currentStatus);

  if (validTransitions.length === 0) return null;

  const handleTransition = (status: AppointmentStatus) => {
    if (status === "CANCELLED") {
      if (!showCancelReason) {
        setShowCancelReason(true);
        return;
      }
      mutate({ id: appointmentId, payload: { status, reason: cancelReason || undefined } });
      return;
    }
    mutate({ id: appointmentId, payload: { status } });
  };

  return (
    <div className="flex flex-col gap-2">
      {showCancelReason && (
        <div className="flex flex-col gap-2 p-3 bg-negative/5 rounded-md border border-negative/20">
          <Input
            label="Motivo de cancelación (opcional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="cancelar" className="flex-1 py-1.5 text-xs" onClick={() => setShowCancelReason(false)}>
              Volver
            </Button>
            <Button
              variant="danger"
              className="flex-1 py-1.5 text-xs"
              disabled={isPending}
              onClick={() => handleTransition("CANCELLED")}
            >
              {isPending ? "..." : "Confirmar cancelación"}
            </Button>
          </div>
        </div>
      )}

      {!showCancelReason && (
        <div className="flex flex-wrap gap-2">
          {validTransitions.map((status) => {
            const config = STATUS_CONFIG[status];
            const isDanger = status === "CANCELLED" || status === "NO_SHOW";

            return (
              <Button
                key={status}
                variant={isDanger ? "danger" : "primary"}
                className="flex-1 py-2 text-xs min-w-[120px]"
                disabled={isPending}
                onClick={() => handleTransition(status)}
              >
                {config.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
