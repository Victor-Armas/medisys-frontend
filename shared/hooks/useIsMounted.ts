import { useState, useEffect } from "react";

/**
 * Hook de infraestructura utilizado para mitigar los problemas de
 * Hydration Mismatch en Next.js (SSR).
 * Retrasa la evaluación de dependencias del cliente hasta el segundo render.
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return isMounted;
}
