"use client";

import { useFormContext } from "react-hook-form";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { useSepomex } from "../../hooks/useSepomex";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { PatientFormData } from "../../schemas/patient.schema";
import type { SepomexNeighborhood, SepomexPostalCodeResult } from "../../types/patient.types";

interface Props {
  index: number;
}

export function AddressItem({ index }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<PatientFormData>();
  const { result, isLoading, error, lookup, reset } = useSepomex();

  // ── ESTADO PARA MODO MANUAL ──
  const [isManualNeighborhood, setIsManualNeighborhood] = useState(false);

  const typedResult = result as SepomexPostalCodeResult | null;

  const prefix = `addresses.${index}` as const;
  const addressErrors = errors.addresses?.[index];

  const country = watch(`${prefix}.country`);
  const postalCodeInput = watch(`${prefix}.postalCodeInput`);
  const isAutofilled = !!typedResult;

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && postalCodeInput?.length === 5 && country === "MX") {
      hasInitialized.current = true;
      lookup(postalCodeInput);
    }
  }, [postalCodeInput, country, lookup]);

  // ── Handlers ──

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "MX") {
      reset();
      setValue(`${prefix}.postalCodeInput`, "");
      setValue(`${prefix}.postalCodeId`, undefined);
      setValue(`${prefix}.neighborhoodId`, undefined);
      setValue(`${prefix}.neighborhoodInput`, "");
      setValue(`${prefix}.municipality`, "");
      setValue(`${prefix}.state`, "");
      setIsManualNeighborhood(false);
    }
  };

  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (country !== "MX") return;

    const cleanValue = e.target.value.replace(/\D/g, "");
    setValue(`${prefix}.postalCodeInput`, cleanValue, { shouldValidate: true });

    if (cleanValue.length === 5) {
      const res = (await lookup(cleanValue)) as SepomexPostalCodeResult | null;

      if (res) {
        setValue(`${prefix}.postalCodeId`, res.id);
        setValue(`${prefix}.municipality`, res.municipality.name);
        setValue(`${prefix}.state`, res.municipality.state.name);
        setValue(`${prefix}.neighborhoodId`, undefined);
        setValue(`${prefix}.neighborhoodInput`, "");
        setIsManualNeighborhood(false); // Reseteamos el modo manual si cambia de CP
      }
    } else if (cleanValue.length < 5 && typedResult) {
      reset();
      setValue(`${prefix}.postalCodeId`, undefined);
      setValue(`${prefix}.neighborhoodId`, undefined);
      setValue(`${prefix}.neighborhoodInput`, "");
      setValue(`${prefix}.municipality`, "");
      setValue(`${prefix}.state`, "");
      setIsManualNeighborhood(false);
    }
  };

  const selectClass = cn(
    "w-full px-4 py-[11px] bg-fondo-inputs rounded-sm text-sm text-encabezado border border-transparent",
    "outline-none focus:ring-2 focus:ring-principal/40 focus:border-principal transition-all",
  );

  return (
    <div className="space-y-4">
      {/* Fila 1: País + Código Postal + Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <select {...register(`${prefix}.country`, { onChange: handleCountryChange })} className={selectClass}>
            <option value="MX">México</option>
            <option value="US">Estados Unidos</option>
            <option value="CA">Canadá</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div className="relative flex flex-col gap-1">
          <Input
            label="Código postal"
            maxLength={5}
            inputMode="numeric"
            error={addressErrors?.postalCodeInput?.message}
            {...register(`${prefix}.postalCodeInput`, { onChange: handlePostalCodeChange })}
          />
          <div className="absolute right-1 top-[20px] flex items-center gap-1.5 pointer-events-none">
            {isLoading && <Loader2 size={14} className="animate-spin text-principal" />}
            {typedResult && !isLoading && <CheckCircle2 size={14} className="text-emerald-500" />}
            {error && !isLoading && <AlertCircle size={14} className="text-red-500" />}
          </div>
        </div>

        <Input
          label="Estado"
          error={addressErrors?.state?.message}
          readOnly={isAutofilled && country === "MX"}
          className={isAutofilled ? "bg-emerald-50/30 border-emerald-200" : ""}
          {...register(`${prefix}.state`)}
        />
      </div>

      {/* Fila 2: Municipio + Colonia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Municipio"
          error={addressErrors?.municipality?.message}
          readOnly={isAutofilled && country === "MX"}
          className={isAutofilled ? "bg-emerald-50/30 border-emerald-200" : ""}
          {...register(`${prefix}.municipality`)}
        />

        {/* ── LÓGICA DE COLONIA CON VÁLVULA DE ESCAPE ── */}
        <div className="flex flex-col gap-1 relative">
          {country === "MX" && typedResult && typedResult.neighborhoods.length > 0 && !isManualNeighborhood ? (
            <>
              <select
                {...register(`${prefix}.neighborhoodInput`, {
                  onChange: (e) => {
                    // Si selecciona la opción manual
                    if (e.target.value === "MANUAL_ENTRY") {
                      setIsManualNeighborhood(true);
                      setValue(`${prefix}.neighborhoodId`, undefined);
                      setValue(`${prefix}.neighborhoodInput`, "", { shouldValidate: true });
                      return;
                    }

                    // Flujo normal
                    const match = typedResult.neighborhoods.find((n: SepomexNeighborhood) => n.name === e.target.value);
                    setValue(`${prefix}.neighborhoodId`, match?.id, { shouldValidate: true });
                  },
                })}
                className={cn(
                  selectClass,
                  addressErrors?.neighborhoodInput ? "border-red-500 focus:border-red-500 focus:ring-red-500/40" : "",
                )}
              >
                <option value="">Selecciona tu colonia...</option>
                {typedResult.neighborhoods.map((n: SepomexNeighborhood) => (
                  <option key={n.id} value={n.name}>
                    {n.name}
                  </option>
                ))}
                {/* Opción de escape */}
                <option value="MANUAL_ENTRY" className="font-semibold text-principal">
                  Otra colonia (no está en la lista)...
                </option>
              </select>
              {addressErrors?.neighborhoodInput && (
                <span className="text-xs text-red-500 mt-1">{addressErrors.neighborhoodInput.message}</span>
              )}
            </>
          ) : (
            <div className="relative">
              {/* Botón para volver al selector si el CP sí trajo resultados */}
              {country === "MX" && typedResult && typedResult.neighborhoods.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsManualNeighborhood(false)}
                  className="absolute right-0 top-0 text-[10px] font-semibold text-principal hover:underline z-10"
                >
                  Volver a la lista
                </button>
              )}
              <Input
                label="Colonia"
                placeholder={country === "MX" && !typedResult ? "Ingresa tu CP primero..." : "Escribe el nombre de tu colonia..."}
                error={addressErrors?.neighborhoodInput?.message}
                {...register(`${prefix}.neighborhoodInput`)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Fila 3: Calle + Núm. Ext + Núm. Int */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-4">
        <Input label="Calle" error={addressErrors?.street?.message} {...register(`${prefix}.street`)} />
        <Input label="Num exterior" error={addressErrors?.extNumber?.message} {...register(`${prefix}.extNumber`)} />
        <Input label="Num interior" error={addressErrors?.intNumber?.message} {...register(`${prefix}.intNumber`)} />
      </div>

      {error && (
        <p className="text-xs text-red-500 font-medium flex gap-1 items-center mt-2">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
