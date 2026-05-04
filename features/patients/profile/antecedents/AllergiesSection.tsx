import { useMemo, useState } from "react";
import { X, TriangleAlert, CloudUpload, AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/ui/toaster";
import { ALLERGY_SEVERITY_COLORS, ALLERGY_SEVERITY_LABELS, searchAllergies } from "@/shared/utils/allergies.utils";
import { useCreateAllergy, useRemoveAllergy } from "@/features/patients/hooks/useAllergies";
import { AllergySeverity, PatientAllergy } from "../../types/patient.types";

/* ───────────────────────────────────────────── */

interface Props {
  patientId: string;
  allergies: PatientAllergy[];
  canEdit: boolean;
}

interface DraftAllergy {
  id: string;
  substance: string;
  severity: AllergySeverity;
}

const SEVERITIES: AllergySeverity[] = ["UNKNOWN", "MILD", "MODERATE", "SEVERE"];

/* ───────────────────────────────────────────── */

export function AllergiesSection({ patientId, allergies, canEdit }: Props) {
  const createAllergy = useCreateAllergy();
  const removeAllergy = useRemoveAllergy();

  const [query, setQuery] = useState("");
  const [draftAllergies, setDraftAllergies] = useState<DraftAllergy[]>([]);

  /* ───────────────────────────────────────────── */

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  /* ───────────────────────────────────────────── */

  const results = useMemo(() => {
    if (!query) return [];

    return searchAllergies(query).filter(
      (item) =>
        !allergies.some((a) => normalize(a.substance) === normalize(item.name)) &&
        !draftAllergies.some((d) => normalize(d.substance) === normalize(item.name)),
    );
  }, [query, allergies, draftAllergies]);

  /* ───────────────────────────────────────────── */

  function handleSelectDraft(substance: string) {
    setDraftAllergies((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        substance,
        severity: "UNKNOWN",
      },
    ]);
    setQuery("");
  }

  async function handleSaveDrafts() {
    if (draftAllergies.length === 0) return;

    const loadId = notify.loading(`Guardando ${draftAllergies.length > 1 ? "alergias" : "alergia"}…`);

    try {
      await Promise.all(
        draftAllergies.map((draft) =>
          createAllergy.mutateAsync({
            patientId,
            payload: {
              substance: draft.substance,
              severity: draft.severity,
            },
          }),
        ),
      );

      notify.success("Alergias registradas", undefined, { id: loadId });
      setDraftAllergies([]);
    } catch {
      notify.error("Error al guardar", undefined, {
        id: loadId,
      });
    }
  }

  /* ───────────────────────────────────────────── */

  async function handleRemove(allergyId: string) {
    try {
      await removeAllergy.mutateAsync({
        patientId,
        allergyId,
      });
    } catch {
      notify.error("Error al eliminar");
    }
  }

  /* ───────────────────────────────────────────── */

  const groupedResults = useMemo(() => {
    const groups: Record<string, typeof results> = {};

    results.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];

      groups[item.category].push(item);
    });

    return groups;
  }, [results]);

  /* ───────────────────────────────────────────── */

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div className="flex items-center gap-2">
        <TriangleAlert className="text-[#8B2FA1]" size={16} strokeWidth={2.5} />
        <p className="text-xs font-bold uppercase tracking-wide text-encabezado">Alergias</p>
      </div>

      {/* SEARCH INPUT */}

      {canEdit && (
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Agregar alergia..."
            className="w-full px-4 py-2.5 text-xs border border-transparent rounded-sm bg-fondo-inputs outline-none focus:border-brand focus:ring-2 focus:ring-principal/40 transition-all text-encabezado placeholder:text-subtitulo"
          />

          {results.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border  rounded-xl shadow-lg max-h-56 overflow-y-auto">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category}>
                  <div className="sticky top-0 px-3 py-1.5 text-[9px] uppercase opacity-70 bg-subtitulo font-bold z-10 border-b /30 shadow-sm backdrop-blur-sm">
                    {category}
                  </div>

                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectDraft(item.name)}
                      className="flex justify-between w-full px-3 py-2.5 text-xs hover:bg-principal hover:text-principal transition-colors text-left"
                    >
                      <span className="text-encabezado text-xs leading-snug">{item.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STANDBY DRAFTS */}

      {draftAllergies.length > 0 && (
        <div
          className="space-y-4 mt-6 p-5 border border-dashed border-purple-300 bg-[#FDFPFF] rounded-[24px]"
          style={{ backgroundColor: "#FCF8FF" }}
        >
          <p className="text-[11px] font-extrabold text-[#702183] uppercase tracking-wide">
            Alergias por guardar ({draftAllergies.length})
          </p>

          <div className="flex flex-col gap-3">
            {draftAllergies.map((draft) => (
              <div
                key={draft.id}
                className="flex flex-col w-fit min-w-[280px] bg-white px-5 py-4 rounded-[20px] border border-purple-100 shadow-sm animate-in fade-in slide-in-from-top-1"
              >
                {/* Nombre de la alergia */}
                <div className="text-[14px] font-bold text-encabezado leading-snug mb-4">{draft.substance}</div>

                {/* Selector de Intensidad */}
                <div className="flex items-center gap-2 flex-wrap">
                  {SEVERITIES.map((sev) => {
                    const isActive = draft.severity === sev;

                    return (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => {
                          setDraftAllergies((prev) => prev.map((d) => (d.id === draft.id ? { ...d, severity: sev } : d)));
                        }}
                        className={cn(
                          "text-[9px] px-3 py-1.5 rounded-full border transition-all  uppercase font-bold",
                          isActive
                            ? "bg-[#E6D4ED] text-[#8B2FA1] border-transparent shadow-xs"
                            : "bg-white text-subtitulo  hover:border-text-disabled hover:bg-subtitulo",
                        )}
                      >
                        {ALLERGY_SEVERITY_LABELS[sev]}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setDraftAllergies((prev) => prev.filter((d) => d.id !== draft.id))}
                    className="ml-2 text-purple-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSaveDrafts}
              disabled={createAllergy.isPending}
              className="px-5 py-2.5 flex items-center gap-2 text-[13px] font-bold bg-[#8B2FA1] text-white rounded-full hover:bg-purple-800 transition-all disabled:opacity-50"
            >
              <CloudUpload size={16} />
              Cargar Información
            </button>
          </div>
        </div>
      )}

      {/* CHIPS */}

      {allergies.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {allergies.map((allergy) => {
            const colors = ALLERGY_SEVERITY_COLORS[allergy.severity];

            return (
              <div
                key={allergy.id}
                className={cn(
                  "group flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase transition-all shadow-xs",
                  colors.bg,
                  colors.text,
                )}
              >
                <AlertCircle size={12} className="shrink-0 opacity-80" strokeWidth={3} />
                <span className="leading-none pt-0.5">{allergy.substance}</span>

                {canEdit && (
                  <button
                    type="button"
                    onClick={() => handleRemove(allergy.id)}
                    className="opacity-50 hover:opacity-100 transition-opacity ml-1 p-0.5"
                  >
                    <X size={10} strokeWidth={3} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY STATE */}

      {allergies.length === 0 && !canEdit && <p className="text-xs italic text-subtitulo">Sin alergias conocidas</p>}
    </div>
  );
}
