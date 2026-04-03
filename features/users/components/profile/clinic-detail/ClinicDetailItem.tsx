// features/users/components/profile/clinic-detail/ClinicDetailItem.tsx

import { Building2, MapPin, Star, Calendar } from "lucide-react";
import type { DoctorClinicItem } from "@features/users/types/doctors.types";
import { DoctorAvailabilityView } from "./availability/DoctorAvailabilityView";

interface Props {
  dc: DoctorClinicItem;
  apointmentDuration: number;
}

export function ClinicDetailItem({ dc, apointmentDuration }: Props) {
  return (
    <div className={`rounded-xl border p-4 ${dc.isPrimary ? "border-brand/30 bg-brand/5" : "border-border-default bg-bg-base/50"}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${dc.isPrimary ? "bg-brand/10 text-brand" : "bg-bg-subtle text-text-secondary"}`}
          >
            <Building2 size={16} strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{dc.clinic.name}</p>
            {dc.clinic.city && (
              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                <MapPin size={10} />
                {dc.clinic.city}
              </p>
            )}
          </div>
        </div>
        {dc.isPrimary && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-brand/10 text-brand border border-brand/20 px-2 py-0.5 rounded-md shrink-0">
            <Star size={9} className="fill-current" /> Principal
          </span>
        )}
      </div>

      {/* Vista de disponibilidad */}
      <DoctorAvailabilityView
        input={{
          doctorClinicId: dc.id,
          scheduleRanges: dc.scheduleRanges,
          scheduleOverrides: dc.scheduleOverrides,
          slotDurationMinutes: apointmentDuration,
        }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-border-default/50">
        <span className="text-[11px] text-text-disabled flex items-center gap-1">
          <Calendar size={10} />
          Asignado{" "}
          {new Date(dc.assignedAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        <span className={`w-1.5 h-1.5 rounded-full ${dc.clinic.isActive ? "bg-emerald-500" : "bg-zinc-400"}`} />
      </div>
    </div>
  );
}
