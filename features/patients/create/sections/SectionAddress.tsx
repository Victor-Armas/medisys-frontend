"use client";

import { useFormContext } from "react-hook-form";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { useSepomex } from "../../hooks/useSepomex";
import { useEffect, useState } from "react";
import { SepomexNeighborhood } from "../../types/patient.types";
import type { AddressFormData } from "../../schemas/patient.schema";

interface BaseAddressForm {
  address: AddressFormData;
}

export function SectionAddress() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BaseAddressForm>();
  const { result, isLoading, error, lookup, reset } = useSepomex();
  const [suggestion, setSuggestion] = useState("");

  const country = watch("address.country");
  const currentNeighborhood = watch("address.neighborhoodId") || "";
  const isAutofilled = !!result;
  const postalCodeInput = watch("address.postalCodeInput");
  // 1. Manejador de cambio de País

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    if (selectedCountry !== "MX") {
      reset();
      setSuggestion("");
      setValue("address.postalCodeInput", undefined);
      setValue("address.postalCodeId", undefined);
      setValue("address.neighborhoodId", undefined); //colonia
      setValue("address.municipality", "");
      setValue("address.state", "");
    }
  };

  //Manejador para el cambio de Código Postal

  const handlePostalCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (country !== "MX") return;

    const cleanValue = e.target.value.replace(/\D/g, "");
    setValue("address.postalCodeInput", cleanValue, { shouldValidate: true });

    if (cleanValue.length === 5) {
      // Importante: El hook debe devolver el objeto 'result' en su promesa
      const res = await lookup(cleanValue);
      if (res) {
        setValue("address.postalCodeId", res.id);
        setValue("address.municipality", res.municipality.name);
        setValue("address.state", res.municipality.state.name);
        // Limpiamos colonia previa para que el usuario elija o escriba
        setValue("address.neighborhoodId", "");
        setSuggestion("");
      }
    } else if (cleanValue.length < 5 && result) {
      // Limpieza si el usuario borra dígitos
      reset();
      setSuggestion("");
      setValue("address.postalCodeId", undefined);
      setValue("address.neighborhoodId", undefined);
      setValue("address.municipality", "");
      setValue("address.state", "");
      setValue("address.neighborhoodId", "");
    }
  };

  //Lógica de Ghost Text para Colonia

  const handleNeighborhoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("address.neighborhoodInput", value);

    if (value && result?.neighborhoods) {
      // Buscamos la primera coincidencia que empiece con lo escrito
      const neighborhoods = result.neighborhoods as SepomexNeighborhood[];
      const match = neighborhoods.find((n) => n.name.toLowerCase().startsWith(value.toLowerCase()));

      if (match && value.toLowerCase() !== match.name.toLowerCase()) {
        setSuggestion(match.name);
      } else {
        setSuggestion("");
      }
    } else {
      setSuggestion("");
    }
  };

  //Aceptar sugerencia con Tab o Flecha Derecha

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Tab" || e.key === "ArrowRight") && suggestion) {
      e.preventDefault();
      // 1. Buscamos el objeto de la colonia completo
      const match = result?.neighborhoods.find((n) => n.name === suggestion);

      // 2. Guardamos el NOMBRE para el input
      setValue("address.neighborhoodInput", suggestion);

      // 3. Guardamos el ID para el backend
      if (match) {
        setValue("address.neighborhoodId", match.id);
      }

      setSuggestion("");
    }
  };

  useEffect(() => {
    // Si el CP se vacía (por el reset), reiniciamos el hook de SEPOMEX
    if (!postalCodeInput || postalCodeInput === "") {
      reset(); // Este es el reset de useSepomex
    }
  }, [postalCodeInput, reset]);

  return (
    <div className="space-y-4">
      {/* País + Código postal */}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <select
            {...register("address.country", { onChange: handleCountryChange })}
            className="w-full px-4 py-4 bg-fondo-inputs rounded-md text-sm text-encabezado"
          >
            <option disabled value="">
              --Selecciona el Pais--
            </option>
            <option value="MX">México</option>
            <option value="US">Estados Unidos</option>
            <option value="CA">Canadá</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div className="relative">
          <Input
            label="Código postal"
            maxLength={5}
            inputMode="numeric"
            error={errors.address?.postalCodeInput?.message}
            {...register("address.postalCodeInput", { onChange: handlePostalCodeChange })}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {isLoading && <Loader2 size={14} className="animate-spin text-principal" />}
            {result && !isLoading && <CheckCircle2 size={14} className="text-emerald-500" />}
            {error && !isLoading && <AlertCircle size={14} className="text-red-500" />}
          </div>
        </div>
      </div>

      {/* Municipio + Estado */}

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Municipio"
          error={errors.address?.municipality?.message}
          readOnly={isAutofilled && country === "MX"}
          className={isAutofilled ? "bg-emerald-50 border-emerald-200" : ""}
          {...register("address.municipality")}
        />

        <Input
          label="Estado"
          error={errors.address?.state?.message}
          readOnly={isAutofilled && country === "MX"}
          className={isAutofilled ? "bg-emerald-50 border-emerald-200" : ""}
          {...register("address.state")}
        />
      </div>

      {/* Colonia con Ghost Text */}
      <div className="relative group">
        {/* Capa de sugerencia (Ghost Text) */}
        {suggestion && !isLoading && (
          <div className="absolute left-4 top-5 text-sm text-principal/40 pointer-events-none flex items-center z-100">
            {/* Texto invisible que ocupa el mismo espacio que lo ya escrito */}
            <span className="opacity-0 whitespace-pre">{currentNeighborhood}</span>
            {/* Texto gris con el resto de la sugerencia */}
            <span>{suggestion.substring(currentNeighborhood.length)}</span>
          </div>
        )}

        <Input
          label="Colonia"
          error={errors.address?.neighborhoodInput?.message}
          autoComplete="off"
          {...register("address.neighborhoodInput", {
            onChange: handleNeighborhoodChange,
          })}
          onKeyDown={handleKeyDown}
          // Hacemos el fondo transparente para ver el Ghost Text detrás
          className=" relative z-0"
        />

        {suggestion && (
          <span className="absolute right-3 top-5 text-[10px] text-principal font-medium uppercase tracking-wider z-20">
            [Tab] o [➜]
          </span>
        )}
      </div>

      {/* Calle + Número exterior */}
      <Input label="Calle" error={errors.address?.street?.message} {...register("address.street")} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Num exterior" error={errors.address?.extNumber?.message} {...register("address.extNumber")} />

        <Input label="Num interior " error={errors.address?.intNumber?.message} {...register("address.intNumber")} />
      </div>

      {/* Número interior */}

      {/* Error SEPOMEX */}

      {error && (
        <p className="text-xs text-red-500 font-medium flex gap-1 items-center">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}
