import dayjs from "dayjs";
import "dayjs/locale/es";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Configuración de dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale("es");

/**
 * Formatea una fecha al estándar solicitado: DD/MM/YYYY.
 * Acepta string ISO, Date objeto o null.
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) return "—";
  return dayjs(date).format("DD/MM/YYYY");
}

/**
 * Formatea una fecha con nombre de mes: D [de] MMMM, YYYY.
 * Ejemplo: 12 de octubre, 2023.
 */
export function formatFullDate(date?: string | Date | null): string {
  if (!date) return "—";
  return dayjs(date).format("D [de] MMMM, YYYY");
}

/**
 * Convierte una fecha a string ISO YYYY-MM-DD para el backend.
 */
export function toISODate(date: string | Date): string {
  return dayjs(date).format("YYYY-MM-DD");
}

/**
 * Formatea un rango de fechas para mostrar periodos.
 */
export function formatDateRange(from: string | Date, to: string | Date): string {
  const f = dayjs(from);
  const t = dayjs(to);
  
  if (f.year() === t.year()) {
    return `${f.format("D [de] MMM")} – ${t.format("D [de] MMM, YYYY")}`;
  }
  return `${f.format("D [de] MMM, YYYY")} – ${t.format("D [de] MMM, YYYY")}`;
}

export default dayjs;
