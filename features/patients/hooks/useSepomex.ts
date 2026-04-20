// features/patients/hooks/useSepomex.ts
"use client";

import { useCallback, useRef, useState } from "react";
import type { SepomexPostalCodeResult } from "../types/patient.types";
import { sepomexService } from "../services/sepomex.service";

interface UseSepomexReturn {
  result: SepomexPostalCodeResult | null;
  isLoading: boolean;
  error: string | null;
  /** Llama esto cuando el usuario termina de escribir el CP (onBlur o enter) */
  lookup: (code: string) => Promise<SepomexPostalCodeResult | null>;
  reset: () => void;
}

/**
 * Hook para consultar el catálogo SEPOMEX por código postal.
 *
 * Estrategia:
 * - Solo hace fetch cuando el código tiene exactamente 5 dígitos
 * - Cachea resultados en memoria durante la sesión (Map)
 * - Evita requests duplicados al mismo CP
 * - No carga miles de registros al montar — consulta bajo demanda
 */
export function useSepomex(): UseSepomexReturn {
  const [result, setResult] = useState<SepomexPostalCodeResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache en memoria — se limpia al recargar la página, no al navegar entre rutas
  const cache = useRef(new Map<string, SepomexPostalCodeResult>());
  // Evitar doble fetch si el user escribe el mismo CP
  const lastQueriedCode = useRef<string | null>(null);

  const lookup = useCallback(
    async (code: string): Promise<SepomexPostalCodeResult | null> => {
      const clean = code.replace(/\D/g, "").trim();

      if (clean.length !== 5) return null;
      if (clean === lastQueriedCode.current) return result;

      if (cache.current.has(clean)) {
        const cachedData = cache.current.get(clean)!;
        setResult(cachedData);
        setError(null);
        lastQueriedCode.current = clean;
        return cachedData; // CAMBIO: Devolver del caché
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await sepomexService.getByPostalCode(clean);
        cache.current.set(clean, data);
        setResult(data);
        lastQueriedCode.current = clean;
        return data;
      } catch {
        setError("Código postal no encontrado");
        setResult(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [result],
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    lastQueriedCode.current = null;
  }, []);

  return { result, isLoading, error, lookup, reset };
}
