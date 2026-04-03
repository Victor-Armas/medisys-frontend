// features/users/components/profile/clinic-detail/availability/DoctorAvailabilityView.tsx

import { AvailabilityToolbar } from "./AvailabilityToolbar";
import { AvailabilityWeekView } from "./AvailabilityWeekView";
import { AvailabilityMonthView } from "./AvailabilityMonthView";
import { ClinicAvailabilityInput } from "@/features/users/types/availability.types";
import { useClinicAvailability } from "@/features/users/hooks/useClinicAvailability";

interface Props {
  input: ClinicAvailabilityInput;
}

export function DoctorAvailabilityView({ input }: Props) {
  const { data, viewMode, setViewMode, periodLabel, goNext, goPrev, goToday } = useClinicAvailability(input);
  return (
    <div>
      <AvailabilityToolbar periodLabel={periodLabel} viewMode={viewMode} onViewModeChange={setViewMode} onPrev={goPrev} onNext={goNext} onToday={goToday} />
      {viewMode === "week" ? <AvailabilityWeekView data={data} /> : <AvailabilityMonthView data={data} />}
    </div>
  );
}
