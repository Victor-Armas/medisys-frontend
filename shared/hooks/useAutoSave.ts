// shared/hooks/useAutoSave.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

interface UseAutoSaveOptions<T> {
  /** Clave única para localStorage — ej: "patient-form-new" */
  storageKey: string;
  /** Datos a guardar */
  data: T;
  /** Tiempo de debounce en ms (default: 800) */
  debounceMs?: number;
  /** ¿Está el formulario en modo "dirty" (tiene cambios)? */
  enabled?: boolean;
}

interface UseAutoSaveReturn<T> {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
  /** Recupera el draft guardado, o null si no hay */
  getDraft: () => T | null;
  /** Borra el draft del localStorage (llamar al submit exitoso) */
  clearDraft: () => void;
  /** Guarda manualmente (sin esperar debounce) */
  saveNow: () => void;
}

/**
 * AutoSave robusto con localStorage.
 *
 * - Guarda con debounce para no saturar localStorage en cada keystroke
 * - Persiste incluso si se cierra la pestaña o falla la red
 * - Recupera drafts al montar el componente
 * - Limpia el draft al submit exitoso
 *
 * @example
 * const { status, getDraft, clearDraft } = useAutoSave({
 *   storageKey: `patient-form-${patientId ?? 'new'}`,
 *   data: formValues,
 *   enabled: isDirty,
 * });
 */
export function useAutoSave<T>({
  storageKey,
  data,
  debounceMs = 800,
  enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn<T> {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef<T>(data);

  // Siempre mantener la ref actualizada sin re-suscribirse al efecto
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const persist = useCallback(() => {
    try {
      setStatus("saving");
      const snapshot = JSON.stringify({
        data: dataRef.current,
        savedAt: new Date().toISOString(),
        version: 1,
      });
      localStorage.setItem(storageKey, snapshot);
      setStatus("saved");
      setLastSavedAt(new Date());
    } catch {
      // localStorage puede estar lleno (quota exceeded) o bloqueado
      setStatus("error");
    }
  }, [storageKey]);

  // Efecto que dispara el autoguardado con debounce
  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(persist, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, enabled, debounceMs, persist]);

  // Guardar también cuando el usuario abandona la pestaña (beforeunload)
  useEffect(() => {
    if (!enabled) return;

    const handleUnload = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        persist();
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [enabled, persist]);

  const getDraft = useCallback((): T | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { data: T; savedAt: string; version: number };
      return parsed.data;
    } catch {
      return null;
    }
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setStatus("idle");
    setLastSavedAt(null);
  }, [storageKey]);

  const saveNow = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    persist();
  }, [persist]);

  return { status, lastSavedAt, getDraft, clearDraft, saveNow };
}
