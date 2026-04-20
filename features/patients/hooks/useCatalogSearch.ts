"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { catalogService } from "../services/catalog.service";

// ── Generic catalog search state ──────────────────────────────────────────────

interface CatalogSearchState<T> {
  results: T[];
  isLoading: boolean;
  query: string;
}

export interface CatalogSearchReturn<T> {
  results: T[];
  isLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  clear: () => void;
}

// ── Factory hook ─────────────────────────────────────────────────────────────

export function createCatalogSearchHook<T>(searchFn: (query: string, limit: number) => Promise<T[]>) {
  return function useCatalogSearch(debounceMs = 300): CatalogSearchReturn<T> {
    const [state, setState] = useState<CatalogSearchState<T>>({
      results: [],
      isLoading: false,
      query: "",
    });

    const cache = useRef(new Map<string, T[]>());
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const setQuery = useCallback(
      (q: string) => {
        setState((p) => ({ ...p, query: q }));

        if (timerRef.current) clearTimeout(timerRef.current);

        if (q.trim().length < 2) {
          setState((p) => ({ ...p, results: [], isLoading: false }));
          return;
        }

        const clean = q.trim();

        if (cache.current.has(clean)) {
          setState((p) => ({
            ...p,
            results: cache.current.get(clean)!,
            isLoading: false,
          }));
          return;
        }

        setState((p) => ({ ...p, isLoading: true }));

        timerRef.current = setTimeout(async () => {
          abortRef.current?.abort();
          abortRef.current = new AbortController();

          try {
            const data = await searchFn(clean, 8);

            cache.current.set(clean, data);

            setState((p) => ({
              ...p,
              results: data,
              isLoading: false,
            }));
          } catch {
            setState((p) => ({
              ...p,
              isLoading: false,
            }));
          }
        }, debounceMs);
      },
      [debounceMs],
    );

    const clear = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);

      setState({
        results: [],
        isLoading: false,
        query: "",
      });
    }, []);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        abortRef.current?.abort();
      };
    }, []);

    return {
      ...state,
      setQuery,
      clear,
    };
  };
}

export const useIcd10Search = createCatalogSearchHook(catalogService.searchIcd10);

// ICD-10 trauma
export const useIcd10SearchTrauma = createCatalogSearchHook(catalogService.searchIcd10Trauma);

// medicamentos
export const useMedicationSearch = createCatalogSearchHook(catalogService.searchMedications);
