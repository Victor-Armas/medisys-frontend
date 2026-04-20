import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { ScheduleOverride } from "@features/clinics/types/clinic.types";
import { useRemoveScheduleOverride } from "@features/clinics/hooks";

export function useDoctorOverrides(overrides: ScheduleOverride[]) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const removeOverride = useRemoveScheduleOverride();

  // Lógica de Negocio: Solo mostramos lo que es de hoy en adelante y ordenado
  const activeOverrides = useMemo(() => {
    const todayMX = dayjs().tz("America/Mexico_City").startOf("day");

    return [...overrides]
      .filter((o) => {
        const overrideDate = dayjs.tz(o.date, "America/Mexico_City").startOf("day");
        return !overrideDate.isBefore(todayMX);
      })
      .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
  }, [overrides]);

  const requestDelete = (id: string) => {
    setPendingId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingId) return;
    await removeOverride.mutateAsync(pendingId);
    setConfirmOpen(false);
    setPendingId(null);
  };

  const pendingOverride = activeOverrides.find((o) => o.id === pendingId);

  return {
    activeOverrides,
    confirmOpen,
    setConfirmOpen,
    pendingOverride,
    requestDelete,
    confirmDelete,
    isDeleting: removeOverride.isPending,
  };
}
