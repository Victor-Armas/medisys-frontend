import { useState } from "react";
import { useMedicationSearch } from "./useCatalogSearch";
import { notify } from "@/shared/ui/toaster";
import type { MedicationSearchResult } from "../types/patient.types";
import {
  useCreateMedication,
  useRemoveMedication,
  useUpdateMedication,
} from "./useMedications";

interface UseMedicationsSectionProps {
  patientId: string;
}

export function useMedicationsSection({
  patientId,
}: UseMedicationsSectionProps) {
  const { results, isLoading, query, setQuery, clear } = useMedicationSearch();
  const createMedication = useCreateMedication();
  const removeMedication = useRemoveMedication();
  const updateMedication = useUpdateMedication();

  const [freeTextMode, setFreeTextMode] = useState(false);
  const [freeText, setFreeText] = useState("");

  const showDropdown = query.length >= 2 && (results.length > 0 || isLoading);

  async function handleSelect(item: MedicationSearchResult) {
    clear();
    const loadId = notify.loading("Guardando…");
    try {
      await createMedication.mutateAsync({
        patientId,
        payload: {
          catalogId: item.id,
          name: item.name + " - " + item.description,
          isNonCoded: false,
        },
      });
      notify.success("Medicamento agregado", item.name, { id: loadId });
    } catch {
      notify.error("Error al guardar", undefined, { id: loadId });
    }
  }

  async function handleAddFreeText() {
    const name = freeText.trim();
    if (!name) return;
    setFreeText("");
    setFreeTextMode(false);
    const loadId = notify.loading("Guardando…");
    try {
      await createMedication.mutateAsync({
        patientId,
        payload: { name, isNonCoded: true },
      });
      notify.success("Medicamento agregado sin código", name, { id: loadId });
    } catch {
      notify.error("Error al guardar", undefined, { id: loadId });
    }
  }

  async function handleRemove(medicationId: string) {
    try {
      await removeMedication.mutateAsync({ patientId, medicationId });
    } catch {
      notify.error("Error al eliminar");
    }
  }

  async function handleUpdateDoseFreq(
    medicationId: string,
    dose: string,
    frequency: string,
  ) {
    try {
      await updateMedication.mutateAsync({
        patientId,
        medicationId,
        payload: {
          dose: dose || undefined,
          frequency: frequency || undefined,
        },
      });
    } catch {
      notify.error("Error al actualizar");
    }
  }

  return {
    // Search & States
    query,
    setQuery,
    results,
    isLoading,
    showDropdown,
    freeTextMode,
    setFreeTextMode,
    freeText,
    setFreeText,
    clearSearch: clear,
    // Actions
    handleSelect,
    handleAddFreeText,
    handleRemove,
    handleUpdateDoseFreq,
  };
}
