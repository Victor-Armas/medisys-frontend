import { create } from "zustand";
import Cookies from "js-cookie";

// Cookie con colores personalizados por usuario
// Formato: { [doctorClinicId]: "#hexColor" }
const COOKIE_KEY_PREFIX = "medisys_doctor_colors_";

function buildCookieKey(userId: string): string {
  return `${COOKIE_KEY_PREFIX}${userId}`;
}

function loadFromCookie(userId: string): Record<string, string> {
  try {
    const raw = Cookies.get(buildCookieKey(userId));
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function saveToCookie(userId: string, overrides: Record<string, string>): void {
  Cookies.set(buildCookieKey(userId), JSON.stringify(overrides), {
    expires: 365,
    path: "/",
  });
}

interface DoctorColorsState {
  overrides: Record<string, string>;
  // Inicializa con los colores guardados del usuario
  initForUser: (userId: string) => void;
  setDoctorColor: (doctorClinicId: string, color: string, userId: string) => void;
  resetDoctorColor: (doctorClinicId: string, userId: string) => void;
}

export const useDoctorColorsStore = create<DoctorColorsState>((set, get) => ({
  overrides: {},

  initForUser: (userId) => {
    set({ overrides: loadFromCookie(userId) });
  },

  setDoctorColor: (doctorClinicId, color, userId) => {
    const next = { ...get().overrides, [doctorClinicId]: color };
    set({ overrides: next });
    saveToCookie(userId, next);
  },

  resetDoctorColor: (doctorClinicId, userId) => {
    const next = { ...get().overrides };
    delete next[doctorClinicId];
    set({ overrides: next });
    saveToCookie(userId, next);
  },
}));
