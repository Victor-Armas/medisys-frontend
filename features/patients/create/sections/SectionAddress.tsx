"use client";

import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";
import { UseFieldArrayRemove, UseFieldArrayAppend, FieldArrayWithId } from "react-hook-form";
import { buildEmptyAddress } from "../../adapters/patient.adapters";
import { AddressItem } from "./AddressItem";
import type { PatientFormData } from "../../schemas/patient.schema";

interface Props {
  fields: FieldArrayWithId<PatientFormData, "addresses", "id">[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<PatientFormData, "addresses">;
}

export function SectionAddress({ fields, remove, append }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Siempre tener al menos 1 dirección disponible
  useEffect(() => {
    if (fields.length === 0) {
      append(buildEmptyAddress(true));
    }
  }, [fields.length, append]);

  // Auto-scroll al final cuando se agrega una dirección
  const prevLength = useRef(fields.length);
  useEffect(() => {
    if (fields.length > prevLength.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
        }
      }, 100);
    }
    prevLength.current = fields.length;
  }, [fields.length]);

  return (
    <div className="space-y-4">
      {/* ── Contenedor de Direcciones con scroll horizontal ── */}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-thin -mx-5 px-5 lg:mx-0 lg:px-0">
        {fields.length === 0 ? (
          <div className="min-w-full flex items-center justify-center py-12 text-sm text-subtitulo border border-dashed border-disable rounded-lg">
            Haz click en Agregar dirección en el encabezado para comenzar
          </div>
        ) : (
          <div className="flex gap-6 pb-2">
            {fields.map((field, index) => (
              <div key={field.id} className="min-w-[400px] max-w-[450px] shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-black text-principal uppercase tracking-widest">
                    Dirección {index + 1} {index === 0 ? "(Principal)" : ""}
                  </p>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      title="Eliminar esta dirección"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="p-5 bg-fondo-inputs/20 rounded-xl border border-disable/40 shadow-sm">
                  <AddressItem index={index} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
