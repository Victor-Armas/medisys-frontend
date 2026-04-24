"use client";

import dayjs from "dayjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody } from "@/shared/ui/dialog";
import { CreateAppointmentForm } from "./CreateAppointmentForm";
import type { DoctorResource } from "../../types/appointment.types";

interface SlotInfo {
  start: dayjs.Dayjs;
  resourceId?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources: DoctorResource[];
  slotInfo: SlotInfo | null;
}

export function CreateAppointmentModal({ open, onOpenChange, resources, slotInfo }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nueva cita</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <CreateAppointmentForm
            resources={resources}
            defaultDoctorClinicId={slotInfo?.resourceId}
            defaultDate={slotInfo ? slotInfo.start.format("YYYY-MM-DD") : undefined}
            defaultStartTime={slotInfo ? slotInfo.start.format("HH:mm") : undefined}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
